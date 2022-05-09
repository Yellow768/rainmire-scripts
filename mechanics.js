//Gameplay Mechanics Non-Datapack




function levelUp(e) {
	if (e.player.hasTag("LevelUp")) {
		e.player.removeTag("LevelUp")
		addToScore("AttrPoints", 1)
		executeCommand("/playsound minecraft:ui.toast.challenge_complete player " + e.player.name + " ~ ~ ~")
		executeCommand("/particle minecraft:end_rod ~ ~ ~ .5 .5 .5 .5 100")
		executeCommand('/title ' + e.player.name + ' actionbar {"text":"You have leveled up!","bold":true,"color":"yellow"}')
		executeCommand('/title '+e.player.name+' times 0 40 20')
		executeCommand('/title '+e.player.name+' subtitle {"text":"Check stats screen!","bold":true,"color":"gold"}')
		executeCommand('/title '+e.player.name+' title {"text":"LEVEL UP!","bold":true,"color":"gold"}')
		e.player.message("&e&lYou have leveled up! Press X to view your stats screen!")

		if (e.player.getExpLevel() % 2 == 0) {
			addToScore("PerkPoints", 1)
		}
	}
}

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
	var crit = Math.random()

	if (crit < getScore("Aptitude") / 15) {
		e.damage *= 2
		e.player.message("&c&lCritical Hit!")
		executeCommand("/playsound iob:ui.crit player " + e.player.name + " ~ ~ ~")
		executeCommand("/particle minecraft:crimson_spore " + e.target.x + " " + e.target.y + " " + e.target.z + " .2 .5 .2 1000 50")
		executeCommand("/particle minecraft:enchanted_hit " + e.target.x + " " + e.target.y + " " + e.target.z + " .2 .5 .2 1 50")

	}
}













