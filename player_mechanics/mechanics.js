//Gameplay Mechanics Non-Datapack
var confirm = false
var cantAttack = false
function init(e) {
	e.player.timers.forceStart(768200, 40, true)
	setUpVals(e)
}

function timer(e) {
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
			break;
	}
}



function tick(e) {
	stat_tick_functions(e)
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
	}
	else if (e.player.getMainhandItem().getDisplayName().indexOf("Puff Bomb") != -1) {
		summonThrowableBomb(e)
	}
	else if (e.player.getMainhandItem().getFoodLevel() > 0) {
		eatFood(e)
	}

}


function dialog(e) {
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
	if (e.openGui) {
		return
	}
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