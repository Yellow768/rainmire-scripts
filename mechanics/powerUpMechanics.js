function dialogOption(e) {
	if (e.option.getName() == "Improve my swim speed") {
		aquaticPowerUp(e)
		e.player.message("&b&lYour swim speed has been increased...")
		addToScore("swmspd", 1)
	}
	if (e.option.getName() == "Improve my lung capacity") {
		aquaticPowerUp(e)
		e.player.message("&b&lYour lung capacity has been increased...")
		e.player.storeddata.put("airDecreaseRate", (e.player.storeddata.get("airDecreaseRate") - .05).toFixed(2))
	}
	if (e.option.getName().indexOf("Enhance my body with") != -1) {
		executeCommand("/particle minecraft:dragon_breath ~ ~1 ~ 1 1 1 .02 100")
		executeCommand("/playsound minecraft:block.bell.use player @a[distance=..4] ~ ~ ~")
		executeCommand("/playsound minecraft:block.beacon.power_select player @a[distance=..4] ~ ~ ~")

		e.player.message("&d&lYou have been blessed with an enhancement...")
	}

}

function aquaticPowerUp(e) {
	e.player.world.spawnParticle("minecraft:soul_fire_flame", e.player.x, e.player.y, e.player.z, 1, 1, 1, 0.5, 100)
	e.player.world.playSoundAt(e.player.pos, "minecraft:block.beacon.power_select", 1, 1)
	e.player.world.playSoundAt(e.player.pos, "minecraft:block.bubble_column.upwards_inside", 1, 1)

}