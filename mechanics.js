//Gameplay Mechanics Non-Datapack

function tick(e) {
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


function damagedEntity(e) {
	
}













