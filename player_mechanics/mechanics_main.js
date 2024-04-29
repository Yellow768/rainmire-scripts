//Gameplay Mechanics Non-Datapack
var confirm = false
var cantAttack = false
var CREATE_PERK_GUI = 768950
function init(e) {
	e.player.timers.forceStart(768200, 40, true)

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
			createPerkGui(e, true, true)
			break;
		case 7:
			openAquaticGUI()
			break;
		case STATS_MECHANIC_TIMER:
			handlePlayerMovementSpeed(e)
			if (e.player.world.getBlock(e.player.pos).name == "kubejs:thorny_kelp") {
				e.player.damage(2)
			}
			break;
	}
}

function trigger(e) {
	craftingTriggers(e)
	statTriggers(e)
}


function tick(e) {
	removePhantom(e, false)
	deleteBoat(e, false)

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
			createStatsScreen(e)
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