function dialogOption(e) {
	if (e.option.getName() == "Improve my swim speed") {
		aquaticPowerUp()
		e.player.message("&b&lYour swim speed has been increased...")
		addToScore("swmspd", 1)
	}
	if (e.option.getName() == "Improve my lung capacity") {
		aquaticPowerUp()
		e.player.message("&b&lYour lung capacity has been increased...")
		addToScore("breath", 10)
	}
	if (e.option.getName().indexOf("Enhance my body with") != -1) {
		executeCommand("/particle minecraft:dragon_breath ~ ~1 ~ 1 1 1 .02 100")
		executeCommand("/playsound minecraft:block.bell.use player @a[distance=..4] ~ ~ ~")
		executeCommand("/playsound minecraft:block.beacon.power_select player @a[distance=..4] ~ ~ ~")

		e.player.message("&d&lYou have been blessed with an enhancement...")
	}

}

function aquaticPowerUp() {
	executeCommand("/particle minecraft:soul_fire_flame ~ ~ ~ 1 1 1 .05 100")
	executeCommand("/playsound minecraft:block.beacon.power_select player @a[distance=..4] ~ ~ ~")
	executeCommand("/playsound minecraft:block.bubble_column.upwards_inside player @a[distance=..4] ~ ~ ~")

}