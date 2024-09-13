var statsStringArray = ["Heart", "Body", "Mind"]

var justLoggedIn = false


function attributes_init(e) {
	updateStats(e)
	initPerkItems(e)

	registerAirSupply(e)
	registerAttributes(e)
	updateStats(e)
}



function registerAttributes(e) {
	if (hasScore("Body") == false) {
		for (var i = 0; i < statsStringArray.length; i++) {
			setScore(statsStringArray[i] + "Base", 1)
			setScore(statsStringArray[i] + "Mod", 0)
		}
	}
	e.player.setHealth(e.player.getMaxHealth())

	if (e.player.storeddata.get("originalAttPts") != getScore("AttrPoints")) {
		setScore("AttrPoints", e.player.storeddata.get("originalAttPts"))
	}
}

function registerAirSupply(e) {
	if (!e.player.storeddata.has("currentAir") || isNaN(e.player.storeddata.get("currentAir"))) {
		e.player.storeddata.put("currentAir", 300)
		e.player.storeddata.put("airDecreaseRate", 1)
	}
	if (e.player.storeddata.get("airDecreaseRate") == null) {
		e.player.storeddata.put("airDecreaseRate", 1)
	}
	e.player.timers.forceStart(id("air_supply_timer"), 0, true)
}


function attributes_timer(e) {
	switch (e.id) {
		case id("air_supply_timer"):
			handlePlayerAirSupply(e)
			attribute_functions(e)
			break;
		case id("force_open_stats_screen"):
			player.tempdata.put("canEditPerks", true)
			createStatsScreen(e)
			break;
		case id("updateSelectedPerks"):
			updateSelectedPerks()
			break;

		case (id("initPerkItemsDelay")):
			initPerkItems(e)
			break;
		case id("perkGUIDelay"):
			createPerkGui(e, true, true)
			break;
		case 1001:
			justLoggedIn = false
			break;
	}
}

function levelUp(e) {
	if (e.player.hasTag("LevelUp")) {
		e.player.removeTag("LevelUp")
		addToScore("AttrPoints", 1)
		e.player.playSound("minecraft:ui.toast.challenge_complete", 1, 1)
		executeCommand("/particle minecraft:end_rod " + e.player.x + " " + e.player.y + " " + e.player.z + " .5 .5 .5 .5 100 force")
		executeCommand('/title ' + e.player.name + ' actionbar {"text":"You have leveled up!","bold":true,"color":"yellow"}')
		executeCommand('/title ' + e.player.name + ' times 0 40 20')
		executeCommand('/title ' + e.player.name + ' subtitle {"text":"Check stats screen!","bold":true,"color":"gold"}')
		executeCommand('/title ' + e.player.name + ' title {"text":"LEVEL UP!","bold":true,"color":"gold"}')
		e.player.message("&e&lYou have leveled up! Press X to view your stats screen!")
	}
}


function updateStats(e) {
	for (var i = 0; i < 3; i++) {
		setScore(statsStringArray[i], getScore(statsStringArray[i] + "Base") + getScore(statsStringArray[i] + "Mod"))
		if (getScore(statsStringArray[i]) < 1) {
			setScore(statsStringArray[i], 1)
		}
	}
	if (player.hasTag("Intro")) {
		setScore("max_perk_power", 0)
	}
	if (getScore("perk_power") > getScore("max_perk_power")) {
		setScore("perk_power", getScore("max_perk_power"))
	}
	var health = 4 * player.getExpLevel()
	if (!player.hasTag("Intro")) {
		executeCommand("attribute " + player.name + " minecraft:generic.max_health base set " + health)
	}
	else {
		executeCommand("attribute " + player.name + " minecraft:generic.max_health base set 20")
	}


}

function updateHydrationData(e) {
	player.nbt.setInteger("hydration", getScore("perk_power"))
	player.nbt.setInteger("max_hydration", getScore("max_perk_power"))
	player.nbt.setInteger("delta", getScore("using"))
	player.nbt.setInteger("breath", getScore("breath"))
	player.nbt.setInteger("restoring", getScore("restore_hydrate"))
}

function attribute_functions(e) {
	handlePlayerMovementSpeed(e)
	handlePlayerAttackSpeed(e)
	e.player.setHunger(10)
}

function handlePlayerAttackSpeed(e) {
	var base = 4.0

	if (e.player.tempdata.get("perk_tags").indexOf("faster_attack") != -1) {
		base += 1
	}
	if (e.player.tempdata.get("perk_tags").indexOf("sloth") != -1) {
		base -= 1.1
	}
	executeCommand("/attribute " + e.player.name + " minecraft:generic.attack_speed base set " + base)
}

function handlePlayerMovementSpeed(e) {
	if (player.hasTag("Intro")) {
		executeCommand("attribute " + e.player.name + " minecraft:generic.movement_speed base set 0.075")
		return
	}
	if (!dataGet(e.player, "creativeStats") && e.player.gamemode == 1) {
		executeCommand("attribute " + e.player.name + " minecraft:generic.movement_speed base set 0.1")
		executeCommand("attribute " + e.player.name + " forge:swim_speed base set 0.8")
		return
	}
	//Define Speed Values
	var sprint_speed = .08 + (0.04 * (getScore("SprintSpeed")))
	if (e.player.tempdata.get("perk_tags").indexOf("speed_perk") != -1) { sprint_speed *= 1.3 }
	if (e.player.tempdata.get("perk_tags").indexOf("winded") != -1) { sprint_speed /= 2 }
	var walk_speed = 0.08
	var swim_sprint_speed = getScore("swmspd")
	var swim_walk_speed = 1 + (0.25 * getScore("swmspd"))
	if (e.player.inWater() && e.player.world.getBlock(e.player.pos).name == "minecraft:water") {

		if (e.player.world.getBlock(e.player.pos).getProperty("level") == 7) walk_speed += 1
	}
	if (e.player.hasTag("winded")) {
		sprint = sprint = .08 + (0.02 * (getScore("SprintSpeed") - 1))
	}
	//Apply them
	if (e.player.hasTag("paralyzed")) {
		executeCommand("attribute " + e.player.name + " forge:swim_speed base set 0")
		executeCommand("attribute " + e.player.name + " minecraft:generic.movement_speed base set 0")
		return
	}
	if (e.player.isSprinting()) {
		executeCommand("attribute " + e.player.name + " minecraft:generic.movement_speed base set " + sprint_speed)
		executeCommand("/attribute " + e.player.name + " forge:swim_speed base set " + swim_sprint_speed)
	}
	if (!e.player.isSprinting() && !e.player.hasTag("levitating")) {
		executeCommand("attribute " + e.player.name + " forge:swim_speed base set " + swim_walk_speed)
		executeCommand("attribute " + e.player.name + " minecraft:generic.movement_speed base set " + walk_speed)
	}
}



var modifier_interval = 0
function applyArmorAttributeModifiers(e) {

	if (modifier_interval % 3 != 0) { modifier_interval += 1; return }
	modifier_interval += 1
	var player = e.arguments[0]
	var fromItem = e.arguments[1]
	var toItem = e.arguments[2]
	var slot = e.arguments[3]
	for (var i = 0; i < statsStringArray.length; i++) {
		if (fromItem.nbt.has(statsStringArray[i])) {
			if (fromItem.isWearable()) {
				if (slot == "HEAD" || slot == "CHEST" || slot == "LEGS" || slot == "FEET") {
					addToScore(statsStringArray[i] + "Mod", -fromItem.nbt.getInteger(statsStringArray[i]))
				}

			}
			else {
				addToScore(statsStringArray[i] + "Mod", -fromItem.nbt.getInteger(statsStringArray[i]))
			}
			i
		}
		if (toItem.nbt.has(statsStringArray[i])) {
			if (toItem.isWearable()) {
				if (slot == "HEAD" || slot == "CHEST" || slot == "LEGS" || slot == "FEET") {
					addToScore(statsStringArray[i] + "Mod", toItem.nbt.getInteger(statsStringArray[i]))
				}
			}
			else {
				addToScore(statsStringArray[i] + "Mod", toItem.nbt.getInteger(statsStringArray[i]))
			}
		}
	}

	if (fromItem.isWearable()) {
		if (toItem.isEmpty()) {
			player.message(player.getOpenContainer().getSize())
		}
	}
	updateStats(e)

}

function attributes_trigger(e) {
	if (e.id == 1 && !justLoggedIn) {

		applyArmorAttributeModifiers(e)
	}
	if (e.id == id("force_open_stats_screen")) {
		player.playSound("minecraft:block.conduit.activate", 1, 1)
		e.arguments[0].player.timers.start(id("force_open_stats_screen"), 1, false)
	}
	if (e.id == id("force_update_stats")) {
		updateStats(e)
	}
	if (e.id == id("upgrade_aquatic_gui")) {
		openAquaticGUI()
	}
}





function died(e) {
	for (var i = 0; i < statsStringArray.length; i++) {
		setScore(statsStringArray[i] + "Mod", 0)
	}
}



function handlePlayerAirSupply(e) {
	if (e.player.hasTag("Intro")) { return }
	if (isNaN(e.player.storeddata.get("currentAir")) || e.player.storeddata.get("currentAir") == null) {
		e.player.message("No Air! Reset!")
		e.player.storeddata.put("currentAir", 300)
		return
	}
	if (e.player.gamemode == 1 || e.player.gamemode == 3) {
		return
	}
	var playerX = Math.floor(e.player.x)
	var playerZ = Math.floor(e.player.z)
	var currentEyePosition = e.player.getMCEntity().m_20188_()

	var blockAtEyeLevel = e.player.world.getBlock(e.player.x, currentEyePosition, e.player.z).name
	if (e.player.hasTag("resurfaced")) {
		e.player.getMCEntity().m_20301_(-10)
		e.player.storeddata.put("currentAir", -10)
	}
	if (e.player.getMCEntity().m_5842_() && !e.player.hasTag("oxygenating")) {
		if (e.player.storeddata.get("currentAir") < 1) {
			return
		}

		if (!e.player.getMCEntity().m_20146_() > 0) {
			return
		}

		var newAirSupply = e.player.storeddata.get("currentAir") - 300 / ((5 + (5 * e.player.storeddata.get("airDecreaseRate"))) * 20)
		e.player.getMCEntity().m_20301_(Math.ceil(newAirSupply))
		if (newAirSupply < -20) { newAirSupply = 0 }
		//worldOut(e.player.getMCEntity().func_70086_ai())
		e.player.storeddata.put("currentAir", newAirSupply)
	}
	else {
		if (e.player.storeddata.get("currentAir") < 300) {
			// e.player.storeddata.put("currentAir", e.player.getMCEntity().func_70086_ai())
			if (e.player.hasTag("oxygenating") && !e.player.tempdata.has("targetOxygen")) {
				e.player.tempdata.put("targetOxygen", parseFloat(e.player.storeddata.get("currentAir")) + 150)

			}
			e.player.getMCEntity().m_20301_(e.player.storeddata.get("currentAir"))
			var newAirSupply = parseFloat(e.player.storeddata.get("currentAir"))
			var airDecreaseRate = parseFloat(e.player.storeddata.get("airDecreaseRate"))

			newAirSupply += 5 / airDecreaseRate
			//worldOut(parseInt(newAirSupply) + parseInt(e.player.storeddata.get("airDecreaseRate")))
			if (e.player.hasTag("oxygenating") && newAirSupply >= e.player.tempdata.get("targetOxygen")) {
				e.player.removeTag("oxygenating")
				e.player.tempdata.remove("targetOxygen")
			}
			if (newAirSupply > 300) {
				newAirSupply = 300
				e.player.removeTag("oxygenating")
			}

			e.player.getMCEntity().m_20301_(Math.floor(newAirSupply))
			e.player.storeddata.put("currentAir", newAirSupply)

			//worldOut(noppesPlayer.storeddata.get("airDecreaseRate"))

		}

	}

}