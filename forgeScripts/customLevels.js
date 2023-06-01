var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
var SCOREBOARD = API.getIWorld("overworld").getScoreboard()

function getPlayerScore(player, objective) {
	if (SCOREBOARD.hasObjective(objective) && SCOREBOARD.hasPlayerObjective(player.name, objective)) {
		return API.getIWorld("overworld").getScoreboard().getPlayerScore(player.name, objective)
	}
	else {
		return 0
	}

}

function setPlayerScore(player, objective, value) {
	API.getIWorld("overworld").getScoreboard().setPlayerScore(player.name, objective, value)
}

function addToPlayerScore(player, objective, amount) {
	API.getIWorld("overworld").getScoreboard().setPlayerScore(player.name, objective, getPlayerScore(objective) + amount)
}

function getPlayerName(player) {
	return API.getIEntity(player).name
}

function getPlayerXP(player) {
	return player.field_71106_cc
}

function addToPlayerXP(player, amount) {
	player.field_71106_cc += amount
}

function setPlayerXP(player, value) {
	player.field_71106_cc = value
}

function getPlayerLevel(player) {
	return player.field_71068_ca
}

function addToPlayerLevel(player, amount) {
	player.field_71068_ca += amount
}

function getRequiredXPForLevel(level) {
	return 50 + ((level - 1) * 50)
}


function runCommand(command) {
	return API.executeCommand(API.getIWorld("overworld"), command)

}


function playerXpEventXpChange(e) {
	if (e.event.getAmount() > 0) {
		runCommand("xp add " + getPlayerName(e.event.getPlayer()) + " -" + e.event.getAmount() + " points");
		addCustomXpValue(e.event.getPlayer(), e.event.getAmount())
	}
}

function playerXpEventPickupXp(e) {
	var xp = e.event.getOrb().field_70530_e;
	e.event.getOrb().field_70530_e = 0
	addCustomXpValue(e.event.getPlayer(), xp)
}


function addCustomXpValue(forgePlayer, xpToAdd) {
	var noppesPlayer = API.getIEntity(forgePlayer)
	noppesPlayer.getWorld().getStoreddata().put(noppesPlayer.name + "totalExperiencePoints", noppesPlayer.getWorld().getStoreddata().get(noppesPlayer.name + "totalExperiencePoints") + xpToAdd)
	if (getPlayerScore(noppesPlayer, "PERK_Educated") == 1) {
		xpToAdd = Math.ceil(xpToAdd * 1.1)
	}

	if (getPlayerXP(forgePlayer) == NaN) {
		setPlayerXP(forgePlayer, 0);
	}

	for (var i = 0; i < xpToAdd; xpToAdd--) { //Adding all the XP at once will cause the checks for leveling up to fail.
		addToPlayerXP(forgePlayer, 1 / getRequiredXPForLevel(getPlayerLevel(forgePlayer)));
		if (getPlayerXP(forgePlayer) >= 1) {
			levelPlayerUp(forgePlayer)
		}
	}
	runCommand("xp set " + getPlayerName(forgePlayer) + " " + getPlayerLevel(forgePlayer) + " levels")

}


function levelPlayerUp(player) {
	addToPlayerXP(player, -1);
	addToPlayerLevel(player, 1)
	runCommand("tag " + getPlayerName(player) + " add LevelUp");
}


function worldOut(text) {
	return API.getIWorld("overworld").broadcast(text);
}