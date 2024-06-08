//Gameplay Mechanics Non-Datapack
var confirm = false
var cantAttack = false
var CREATE_PERK_GUI = 768950
function init(e) {
	loadIds(e.player.world)
	e.player.timers.forceStart(768200, 40, true)
	e.player.timers.forceStart(id("updateHydrationData"), 0, true)

	initPerkItems(e)
	setUpVals(e)

}





function timer(e) {
	attrbiuteCheck_timer(e)
	switch (e.id) {
		case 20:
			justLoggedIn = false
			break;
		case 30:
			confirm = false
			break;
		case 40:
			cantAttack = false
		case 900:
			applyEffectToArrow(e)
			break;
		case 768200:
			savePhantom(e)
			removePhantom(e, false)
			break;
		case 768201:
			deleteBoat(e, false)
			break;
		case 510001:
			e.player.removeTag("paralyzed")
			break;
		case AIR_SUPPLY_TIMER:
			handlePlayerAirSupply(e)
			attribute_functions(e)
			break;
		case CREATE_PERK_GUI:
			player.tempdata.put("canEditPerks", true)
			createStatsScreen(e)
			break;
		case 7:
			openAquaticGUI()
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
		case id("updateHydrationData"):
			updateHydrationData()
			break;
	}
}

function trigger(e) {
	craftingTriggers(e)
	statTriggers(e)
}

var thorny_time = 0
function tick(e) {
	removePhantom(e, false)
	deleteBoat(e, false)
	if (e.player.world.getBlock(e.player.pos).name == "kubejs:thorny_kelp") {
		thorny_time += 1
		if (thorny_time >= 1) {
			e.player.damage(1)
			thorny_time = 0
		}
	}
}






function interact(e) {
	if (e.player.getOffhandItem().getDisplayName().indexOf("Jelly") != -1) {
		e.setCanceled(true)
		var item = e.player.getMainhandItem()
		var nbt = item.getNbt()
		if (isItemValidForJelly(e, item)) {
			applyJelly(e, item)
		}
		return
	}
	if (e.player.getOffhandItem().getDisplayName().indexOf("Remnant Shard") != -1 && e.player.getMainhandItem().getDisplayName().indexOf("Remnant Shard") != -1) {
		e.player.getOffhandItem().setStackSize(e.player.getOffhandItem().getStackSize() - 1)
		e.player.getMainhandItem().setStackSize(e.player.getMainhandItem().getStackSize() - 1)
		executeCommand('/give ' + e.player.name + ' aquamirae:esca{display:{Lore:[\'{"italic":false,"color":"white","extra":[{"text":""},{"color":"dark_aqua","text":"Use at a Power or Dampening Remnant"}],"text":""}\', \'{"italic":false,"color":"white","extra":[{"text":""},{"color":"dark_aqua","text":"to obtain a perk. Or ingest it to"}],"text":""}\', \'{"italic":false,"color":"white","extra":[{"text":""},{"color":"dark_aqua","text":"enhance your aquatic abilities"}],"text":""}\'],Name:\'{"italic":false,"extra":[{"text":""},{"underlined":true,"obfuscated":true,"color":"aqua","text":"a"},{"underlined":true,"color":"aqua","text":"Remnant Vessel"},{"underlined":true,"obfuscated":true,"color":"aqua","text":"K"}],"text":""}\'}} 1')
		e.player.playSound("minecraft:item.totem.use", 1, 1)
		e.player.playSound("minecraft:entity.blaze.ambient", 1, .7)
		e.player.world.spawnParticle("aquamirae:electric", e.player.x, e.player.y + 1, e.player.z, .3, .4, .3, 1, 100)
		e.player.world.spawnParticle("aquamirae:ghost", e.player.x, e.player.y + 1, e.player.z, .3, .4, .3, 1, 100)
		e.player.world.spawnParticle("aquamirae:ghost_shine", e.player.x, e.player.y + 1, e.player.z, .3, .4, .3, 1, 100)
		displayTitle(e, "...Remnant Vessel Created...", "aqua")
		return
	}
	if (e.player.getMainhandItem().getDisplayName().indexOf("Jelly") != -1) {
		if (e.type == 1 && e.target.name == "Water Summon") {
			applyJellyToWaterSummon(e)
		}
	}
	else if (e.type == 1) {
		checkPhantomInteractions(e)
		if (e.player.getOffhandItem().name.indexOf("shield") != -1 && e.target.type == 2 && e.target.getAttackTarget() == e.player) {
			e.setCanceled(true)
		}
		if (e.target.name.indexOf("Boat") != -1 && (e.target.getRiders().length > 0 && e.target.getRiders()[0].type == 2)) {
			e.setCanceled(true)
			e.player.message("This boat is occupied")
		}
	}
	else if (e.player.getMainhandItem().name == "minecraft:pufferfish") {
		summonThrowableBomb(e)
	}
	else if (e.player.getMainhandItem().getFoodLevel() > 0) {
		eatFood(e)
	}

	if (e.player.tempdata.has("interfaceEditing")) {
		if (!e.player.world.getStoreddata().has("ancientInterfaceArray")) {
			e.player.world.getStoreddata().put("ancientInterfaceArray", JSON.stringify({}))
		}
		var aip = JSON.parse(e.player.world.getStoreddata().get("ancientInterfaceArray"))
		var id = e.player.tempdata.get("interfaceEditing").x + "" + e.player.tempdata.get("interfaceEditing").y + "" + e.player.tempdata.get("interfaceEditing").z
		aip[id] = [e.target.x, e.target.y, e.target.z]
		e.player.world.storeddata.put("ancientInterfaceArray", JSON.stringify(aip))
		e.player.message("&eInterface Button Set to " + e.target.x + " " + e.target.y + " " + e.target.z)
		e.player.tempdata.remove("interfaceEditing")
	}
	if (e.player.tempdata.has("hourglassEditing")) {

		if (!e.player.world.getStoreddata().has("ancientInterfaceArray")) {
			e.player.world.getStoreddata().put("ancientInterfaceArray", JSON.stringify({}))
		}
		var aip = JSON.parse(e.player.world.getStoreddata().get("ancientInterfaceArray"))
		var id = e.player.tempdata.get("hourglassEditing").x + "" + e.player.tempdata.get("hourglassEditing").y + "" + e.player.tempdata.get("hourglassEditing").z
		aip[id]["buttonPos"] = [e.target.x, e.target.y, e.target.z]
		aip[id]["progress"] = 0
		e.player.world.storeddata.put("ancientInterfaceArray", JSON.stringify(aip))
		e.player.message("&eHourglass Button Set to " + e.target.x + " " + e.target.y + " " + e.target.z)
		e.player.tempdata.remove("hourglassEditing")
	}
	if (e.type == 2) {
		if (e.target.name == "kubejs:ancient_interface") {
			if (e.player.getMainhandItem().name == "minecraft:debug_stick") return
			if (!e.player.isSneaking() || e.player.gamemode != 1) {
				e.player.playAnimation(0)
				e.API.executeCommand(e.player.world, "/setblock " + e.target.x + " " + e.target.y + " " + e.target.z + " kubejs:ancient_interface[lit=" + !e.target.getProperty("lit") + ",facing=" + e.target.getProperty("facing") + ",waterlogged=" + e.target.getProperty("waterlogged") + "]")
				var aip = JSON.parse(e.player.world.getStoreddata().get("ancientInterfaceArray"))
				var id = e.target.x + "" + e.target.y + "" + e.target.z
				if (aip[id]) {
					e.player.world.getBlock(aip[id][0], aip[id][1], aip[id][2]).interact(0)
				}
				if (e.target.getProperty("lit")) {
					e.API.executeCommand(e.player.world, "/particle minecraft:dust 0 1 1 1 " + (e.target.x + .5) + " " + (e.target.y + 1) + " " + (e.target.z + .5) + " .1 .1 .1 0 50")
					e.player.world.spawnParticle("enchant", e.target.x + .5, e.target.y + 1, e.target.z + .5, .2, .2, .2, 0, 25)

					e.player.world.playSoundAt(e.target.pos, "minecraft:block.beacon.activate", 1, .8)
				}
				if (!e.target.getProperty("lit")) {
					e.player.world.spawnParticle("aquamirae:ghost_shine", e.target.x + .5, e.target.y + 1, e.target.z + .5, .2, .2, .2, 0, 5)
					e.player.world.playSoundAt(e.target.pos, "minecraft:block.beacon.deactivate", 1, .6)
				}
			}
			if (e.player.isSneaking() && e.player.gamemode == 1) {
				e.player.tempdata.put("interfaceEditing", e.target)
				e.player.message("&eSetting Interface Button")
			}
		}
		if (e.target.name == "kubejs:ancient_hourglass") {
			var aip = JSON.parse(e.player.world.getStoreddata().get("ancientInterfaceArray"))
			var id = e.target.x + "" + e.target.y + "" + e.target.z

			if (!aip[id]) {
				aip[id] = {
					time: 1,
					buttonPos: [1, 1, 1],
					progress: 0
				}
			}
			if (e.player.getMainhandItem().name == "minecraft:debug_stick") { aip[id]["progress"] = 0; return }
			if (e.player.getMainhandItem().name == "minecraft:clock" && e.player.gamemode == 1) {
				var time = aip[id]["time"]
				if (e.player.isSneaking()) {
					aip[id]["time"] = time - 1

				}
				else {
					aip[id]["time"] = time + 1
				}
				e.player.message("&eSet interval to " + aip[id]["time"])
			}
			else if (e.player.gamemode == 1 && e.player.isSneaking()) {
				e.player.tempdata.put("hourglassEditing", e.target)
				e.player.message("&eSetting Hourglass Button")

			}
			else {
				e.player.playAnimation(0)
				if (aip[id]["progress"] == 0) {

					e.API.executeCommand(e.player.world, "/particle minecraft:dust 0 1 1 1 " + (e.target.x + .5) + " " + (e.target.y + 1) + " " + (e.target.z + .5) + " .3 .3 .3 0 5")
					e.player.world.spawnParticle("enchant", e.target.x + .5, e.target.y + 1, e.target.z + .5, .2, .2, .2, 0, 25)

					e.player.world.playSoundAt(e.target.pos, "minecraft:block.beacon.activate", 1, 2)
				}
				if (aip[id]["progress"] < aip[id]["time"]) {
					aip[id]["progress"] = aip[id]["progress"] + 1
				}

				if (aip[id]["progress"] == aip[id]["time"]) {
					if (e.target.getProperty("power") < 4) {
						e.API.executeCommand(e.player.world, "/setblock " + e.target.x + " " + e.target.y + " " + e.target.z + " kubejs:ancient_hourglass[power=" + (e.target.getProperty("power") + 1) + ",facing=" + e.target.getProperty("facing") + ",waterlogged=" + e.target.getProperty("waterlogged") + "]")
						if (e.player.world.getBlock(e.target.x, e.target.y, e.target.z).getProperty("power") == 4) {
							e.player.world.getBlock(aip[id]["buttonPos"][0], aip[id]["buttonPos"][1], aip[id]["buttonPos"][2]).interact(0)
							e.API.executeCommand(e.player.world, "/particle minecraft:dust 0 1 1 1 " + (e.target.x + .5) + " " + (e.target.y + 1) + " " + (e.target.z + .5) + " .3 .3 .3 0 50")
							e.player.world.spawnParticle("enchant", e.target.x + .5, e.target.y + 1, e.target.z + .5, .2, .2, .2, 0, 25)
							e.player.world.playSoundAt(e.target.pos, "minecraft:block.beacon.activate", 1, .6)
						}
						else {
							aip[id]["progress"] = 0
						}
					}
				}
			}
			e.player.world.storeddata.put("ancientInterfaceArray", JSON.stringify(aip))
		}


	}

}




function dialog(e) {
	attributeCheck_Dialog(e)
	var skillCheck = e.dialog.text.substr(0, 3)

	if (skillCheck == "&a(") {
		e.player.playSound("minecraft:item.trident.return", 1, 1)
	}
	if (skillCheck == "&c(") {
		e.player.playSound("minecraft:entity.elder_guardian.hurt", 1, 1)
	}
	e.player.timers.forceStart(40, 25, false)
	cantAttack = true
}


function keyPressed(e) {
	var keyBinds = JSON.parse(e.player.world.storeddata.get(e.player.name + "keyBindsJSON"))
	if (e.openGui) { return }
	switch (e.key) {
		case keyBinds.key_summonMount:
			handleMountInput(e)
			break;
		case keyBinds.key_stats:
			e.player.tempdata.put("canEditPerks", e.player.gamemode == 1)
			createStatsScreen(e, true)

			break;
	}
}



function damagedEntity(e) {
	applyStatusToTarget(e)
	if (e.damageSource.isProjectile()) {
		e.target.setAttackTarget(e.player)
	}
}

function attack(e) {
	e.setCanceled(cantAttack)
	if (e.player.isSneaking() && e.player.gamemode == 1 && e.type == 1 && e.target.name.indexOf("Remnant")) {
		e.target.trigger(2, [e])
	}
}


function toss(e) {
	if (e.item.nbt.has("questItem") && confirm == false) {
		e.setCanceled(true)
		confirm = true
		e.player.message("&eYou second guess whether you should throw that away. If you're sure, go ahead and toss it again.")
		e.player.giveItem(e.item)
		e.player.timers.forceStart(30, 60, false)
	}
	preventPerkToss(e)
}

function damaged(e) {
	e.player.storeddata.put("DeathPosX", e.player.x)
	e.player.storeddata.put("DeathPosY", e.player.y)
	e.player.storeddata.put("DeathPosZ", e.player.z)
	if (e.player.getMCEntity().m_21254_()) {
		var shield
		if (e.player.getMainhandItem().name.indexOf("shield") != -1) {
			shield = e.player.getMainhandItem()
		}
		else {
			shield = e.player.getOffhandItem()
		}

		shield.setDamage(shield.getDamage() + 2)
	}

}

/**
 * @param {PlayerEvent.BreakEvent} e
 */
function broken(e) {
	if (e.block.name.indexOf("kubejs:ancient") != -1) {

		var aip = JSON.parse(e.player.world.getStoreddata().get("ancientInterfaceArray"))
		var id = e.block.x + "" + e.block.y + "" + e.block.z
		delete aip[id]
		e.player.world.getStoreddata().put("ancientInterfaceArray", JSON.stringify(aip))
	}
}