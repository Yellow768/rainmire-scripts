//Gameplay Mechanics Non-Datapack
var confirm = false
var cantAttack = false
function init(e) {
	e.player.timers.forceStart(768200, 40, true)
	setUpVals(e)
}

function timer(e) {
	switch (e.id) {
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

	}
}



function tick(e) {
	if (e.player.hasTag("justFired")) {
		applyEffectToArrow(e)
		e.player.removeTag("justFired")
	}
	if (!e.player.inWater() && e.player.hasTag("inWater")) {
		e.player.removeTag("inWater")
		e.player.removeTag("waterSprint")
		executeCommand("attribute " + e.player.name + " forge:swim_speed base set 1")
	}

	if (e.player.inWater()) {
		if (!e.player.hasTag("inWater")) {
			e.player.addTag("inWater")
			if (e.player.getPotionEffect(13) == -1) {
				e.player.addPotionEffect(13, getScore("breath"), 0, true)

			}
		}


		if (e.player.isSprinting() && !e.player.hasTag("waterSprint")) {
			e.player.addTag("waterSprint")
			executeCommand("/attribute " + e.player.name + " forge:swim_speed base set " + swimSpeed())
		}
		if (!e.player.isSprinting() && e.player.hasTag("waterSprint")) {
			e.player.removeTag("waterSprint")
			executeCommand("attribute " + e.player.name + " forge:swim_speed base set 1")
		}
	}


}

function swimSpeed() {
	return 1 + (0.5 * getScore("swmspd"))
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
	}
	else if (e.player.getMainhandItem().getDisplayName().indexOf("Puff Bomb") != -1) {
		summonThrowableBomb(e)
	}
	else if (e.player.getMainhandItem().getFoodLevel() > 0) {
		e.setCanceled(true)
		var foodLevel = e.player.getMainhandItem().getFoodLevel()
		if (e.player.hasTag("pescetarian")) {
			var isFish = false
			var fish_food = ["minecraft:cod", "minecraft:cooked_cod", "minecraft:salmon", "minecraft:cooked_salmon", "minecraft:tropical_fish",
				"upgrade_aquatic:pike", "upgrade_aquatic:cooked_pike", "upgrade_aquatice:lionfish", "upgrade_aquatice:cooked_lionfish", "upgrade_aquatice:perch", , "upgrade_aquatice:cooked_perch"]
			for (var i = 0; i < fish_food.length; i++) {
				if (e.player.getMainhandItem().name == fish_food[i]) {
					isFish = true
				}

			}
			if (!isFish) {
				executeCommand('/title ' + e.player.name + ' actionbar {"text":"You can\'t eat that!","color":"purple"}')
				return
			}

		}

		addToScore("perk_power", Math.floor(foodLevel / 2))
		setScore("restore_hydrate", 1)
		e.player.timers.forceStart(768080, 4, false)
		if (getScore("perk_power") > getScore("max_perk_power")) {
			setScore("perk_power", getScore("max_perk_power"))
		}
		produceFoodParticles(e)
		e.player.playSound("minecraft:entity.generic.eat", 1, 1)
		e.player.playSound("minecraft:entity.player.burp", 1, 1)
		e.player.playSound("minecraft:entity.witch.drink", 1, 1)
		if (e.player.gamemode != 1) { e.player.removeItem(e.player.getMainhandItem(), 1) }
		e.player.setHealth(e.player.getHealth() + foodLevel)
		if (e.player.getHealth() > e.player.getMaxHealth()) {
			e.player.setHealth(e.player.getMaxHealth())
		}

	}

}

function produceFoodParticles(e) {
	var angle = e.player.getRotation()
	var dx = -Math.sin(angle * Math.PI / 180)
	var dz = Math.cos(angle * Math.PI / 180)
	var dy = -Math.tan(e.player.getPitch() / 90)
	var pitch = (90 - (Math.abs(e.player.getPitch()))) * 0.011
	if (dy < 0) {
		dy = 0
	}
	var x = e.player.x + (dx * pitch)
	var y = e.player.y + 1 + dy
	var z = e.player.z + (dz * pitch)
	executeCommand("/particle minecraft:item " + e.player.getMainhandItem().name + " " + x + " " + y + " " + z + " .3 .2 .3 .00001 20")

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
	if (e.key == keyBinds.key_summonMount) {
		summonMount(e)
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



