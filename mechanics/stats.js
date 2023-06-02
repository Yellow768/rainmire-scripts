var statsStringArray = ["Charm", "Empathy", "Suggestion", "Brawn", "Grit", "Deftness", "Intellect", "Perception", "Aptitude"]
var GUI_STATS
var xPos = [18, 100, 180]
var yPos = [42, 62, 84]
var justLoggedIn = false

function init(e) {
	setUpVals(e)
	updateStats(e)
}

function login(e) {
	justLoggedIn = true
	e.player.timers.start(20, 10, false)
}

function timer(e) {
	if (e.id == 20) {
		justLoggedIn = false
	}
}

function setUpVals(e) {
	scoreboard = e.player.world.getScoreboard()
	player = e.player
	playerName = e.player.name
	if (!e.player.storeddata.has("currentAir") || isNaN(e.player.storeddata.get("currentAir"))) {
		e.player.storeddata.put("currentAir", 300)
		e.player.storeddata.put("airDecreaseRate", 1)
	}
	if (e.player.storeddata.get("airDecreaseRate") == null) {
		e.player.storeddata.put("airDecreaseRate", 1)
	}
	updateStats(e)
	setScore("perk_power", getScore("max_perk_power"))
	e.player.setHealth(e.player.getMaxHealth())



}





function levelUp(e) {
	if (e.player.hasTag("LevelUp")) {
		e.player.removeTag("LevelUp")
		addToScore("AttrPoints", 1)
		e.player.playSound("minecraft:ui.toast.challenge_complete", 1, 1)
		executeCommand("/particle minecraft:end_rod " + e.player.x + " " + e.player.y + " " + e.player.z + " .5 .5 .5 .5 100")
		executeCommand('/title ' + e.player.name + ' actionbar {"text":"You have leveled up!","bold":true,"color":"yellow"}')
		executeCommand('/title ' + e.player.name + ' times 0 40 20')
		executeCommand('/title ' + e.player.name + ' subtitle {"text":"Check stats screen!","bold":true,"color":"gold"}')
		executeCommand('/title ' + e.player.name + ' title {"text":"LEVEL UP!","bold":true,"color":"gold"}')
		e.player.message("&e&lYou have leveled up! Press X to view your stats screen!")
	}
}


function keyPressed(e) {
	var keyBinds = JSON.parse(e.player.world.storeddata.get(e.player.name + "keyBindsJSON"))
	if (e.key == keyBinds.key_stats && e.openGui == '') {
		createStatsScreen(e)
	}
}




function updateStats(e) {
	for (var i = 0; i < 9; i++) {
		setScore(statsStringArray[i], getScore(statsStringArray[i] + "Base") + getScore(statsStringArray[i] + "Mod"))

	}
	var sumOfHnM = getScore("Charm") + getScore("Empathy") + getScore("Suggestion") + getScore("Intellect") + getScore("Perception") + getScore("Aptitude")
	setScore("max_perk_power", sumOfHnM + getScore("perk_power_mod"))
	if (getScore("perk_power") > getScore("max_perk_power")) {
		setScore("perk_power", getScore("max_perk_power"))
	}
	var health = 4 * (getScore("Grit") + 1)
	var damage = +1 + (2 * (getScore("Brawn") - 1))
	executeCommand("attribute " + player.name + " minecraft:generic.max_health base set " + health)
	executeCommand("attribute " + player.name + " minecraft:generic.attack_damage base set " + damage)

}





function tick(e) {
	var sprint = .08 + (0.04 * (getScore("Deftness") - 1))
	if (e.player.hasTag("winded")) {
		sprint = sprint = .08 + (0.02 * (getScore("Deftness") - 1))
	}
	var walk = .08 + (0.01 * (getScore("Deftness") - 1))
	if (e.player.isSprinting()) {

		executeCommand("attribute " + e.player.name + " minecraft:generic.movement_speed base set " + sprint)
	}
	else {
		executeCommand("attribute " + e.player.name + " minecraft:generic.movement_speed base set " + walk)
	}

	e.player.setHunger(10)


}

function createStatsScreen(e) {
	GUI_STATS = e.API.createCustomGui(id("STATS_GUI"), 256, 256, false)
	GUI_STATS.setBackgroundTexture("iob:textures/customgui/statsscreen.png")
	createScores(e)
	createValues()
	if (getScore("AttrPoints") > 0) {
		createUpgradeButtons()
	}
	e.player.showCustomGui(GUI_STATS)
}

function returnAttString(val) {
	return "iob:textures/customgui/att_level_" + val + ".png"

}

function createScores(e) {
	var L_Stat = 0

	updateStats(e)
	GUI_STATS.addTexturedRect(L_Stat + 1, returnAttString(getScore("Charm")), xPos[0], yPos[0], 70, 8)
	GUI_STATS.addTexturedRect(L_Stat + 2, returnAttString(getScore("Empathy")), xPos[0], yPos[1], 70, 8)
	GUI_STATS.addTexturedRect(L_Stat + 3, returnAttString(getScore("Suggestion")), xPos[0], yPos[2], 70, 8)

	GUI_STATS.addTexturedRect(L_Stat + 4, returnAttString(getScore("Brawn")), xPos[1], yPos[0], 70, 8)
	GUI_STATS.addTexturedRect(L_Stat + 5, returnAttString(getScore("Grit")), xPos[1], yPos[1], 70, 8)
	GUI_STATS.addTexturedRect(L_Stat + 6, returnAttString(getScore("Deftness")), xPos[1], yPos[2], 70, 8)

	GUI_STATS.addTexturedRect(L_Stat + 7, returnAttString(getScore("Intellect")), xPos[2], yPos[0], 70, 8)
	GUI_STATS.addTexturedRect(L_Stat + 8, returnAttString(getScore("Perception")), xPos[2], yPos[1], 70, 8)
	GUI_STATS.addTexturedRect(L_Stat + 9, returnAttString(getScore("Aptitude")), xPos[2], yPos[2], 70, 8)

}

function createValues() {
	var xpThreshold = 0
	for (var i = 0; i < player.getExpLevel(); i++) {
		xpThreshold += 50 + ((i) * 50)
	}

	var speedAttribute = (.04 + (getScore("Deftness") * .03)) * 43.1
	var speedString = speedAttribute.toString()

	var swimSpeed = 5.612 * (1 + (0.5 * getScore("swmspd")))
	var swimString = swimSpeed.toString()

	GUI_STATS.addLabel(30, player.getExpLevel(), 45, 117, 1, 1)
	GUI_STATS.addLabel(31, player.world.storeddata.get(player.name + "totalExperiencePoints") + "/" + xpThreshold, 45, 137, 1, 1)
	GUI_STATS.addLabel(52, getScore("AttrPoints"), 220, 117, 1, 1)
	GUI_STATS.addLabel(53, getScore("max_perk_power"), 220, 137, 1, 1)



	GUI_STATS.addLabel(500, player.getMaxHealth(), 58, 188, 1, 1)
	GUI_STATS.addLabel(401, speedString.substr(0, 4) + " m/s", 58, 208, 1, 1)
	GUI_STATS.addLabel(90, -3 + getScore("Brawn") * 2, 58, 228, 1, 1)

	GUI_STATS.addLabel(91, player.storeddata.get("airDecreaseRate") + "s", 220, 188, 1, 1)
	GUI_STATS.addLabel(92, swimString.substr(0, 4) + " m/s", 220, 208, 1, 1)
	GUI_STATS.addLabel(93, 10 * getScore("Aptitude") + "%", 220, 228, 1, 1)
}

function createUpgradeButtons() {
	var xint = 0
	var yint = 0
	for (var i = 0; i < 9; i++) {
		if (getScore(statsStringArray[i] + "Base") < 5) {
			GUI_STATS.addTexturedButton(20 + i, '', xPos[xint] + 55, yPos[yint] - 1, 8, 9, "iob:textures/customgui/add.png")
		}
		if (yint < 2) { yint++ }
		else {
			xint++
			yint = 0
		}
	}
}

function customGuiButton(e) {
	for (var i = 0; i < 9; i++) {
		if (e.buttonId == 20 + i) {
			addToScore(statsStringArray[i] + "Base", 1)
			addToScore("AttrPoints", -1)
			createStatsScreen(e)
		}
	}
}

function trigger(e) {
	if (e.id == 1 && !justLoggedIn) {
		var player = e.arguments[0]
		var fromItem = e.arguments[1]
		var toItem = e.arguments[2]
		var slot = e.arguments[3]
		var attributes = ["Charm", "Empathy", "Suggestion", "Brawn", "Grit", "Deftness", "Intellect", "Perception", "Aptitude"]

		for (var i = 0; i < attributes.length; i++) {
			if (fromItem.nbt.has(attributes[i])) {
				if (fromItem.isWearable()) {
					if (slot == "HEAD" || slot == "CHEST" || slot == "LEGS" || slot == "FEET") {
						addToScore(attributes[i] + "Mod", -fromItem.nbt.getInteger(attributes[i]))
					}

				}
				else {
					addToScore(attributes[i] + "Mod", -fromItem.nbt.getInteger(attributes[i]))
				}
				i
			}
			if (toItem.nbt.has(attributes[i])) {
				if (toItem.isWearable()) {
					if (slot == "HEAD" || slot == "CHEST" || slot == "LEGS" || slot == "FEET") {
						addToScore(attributes[i] + "Mod", toItem.nbt.getInteger(attributes[i]))
					}
				}
				else {
					addToScore(attributes[i] + "Mod", toItem.nbt.getInteger(attributes[i]))
				}
			}
		}
		updateStats(e)
	}
}

function dialog(e) {
	if (e.player.hasTag("social_anxiety")) {
		for (var i = 0; i < 9; i++) {
			addToScore(statsStringArray[i] + "Mod", -1)
		}
		title(e, "You're starting to sweat", '#E441C3')
		updateStats(e)
	}

}

function dialogClose(e) {
	if (e.player.hasTag("social_anxiety")) {
		for (var i = 0; i < 9; i++) {
			addToScore(statsStringArray[i] + "Mod", 1)
		}
		title(e, "That wasn't so bad", '#E441C3')
		updateStats(e)
	}

}