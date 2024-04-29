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
	return player.f_36080_
}

function addToPlayerXP(player, amount) {
	player.f_36080_ += amount
}

function setPlayerXP(player, value) {
	player.f_36080_ = value
}

function getPlayerLevel(player) {
	return player.f_36078_
}

function addToPlayerLevel(player, amount) {
	player.f_36078_ += amount
}

function getRequiredXPForLevel(level) {
	return 50 + ((level - 1) * 50)
}


function runCommand(command) {
	return API.executeCommand(API.getIWorld("overworld"), command)

}

var xpEventChangeTriggerIteration = 0
function playerXpEventXpChange(e) {
	if (e.event.getAmount() > 0 && xpEventChangeTriggerIteration == 0) {
		runCommand("xp add " + getPlayerName(e.event.getPlayer()) + " -" + e.event.getAmount() + " points");
		addCustomXpValue(e.event.getPlayer(), e.event.getAmount())

	}
	xpEventChangeTriggerIteration++
	if (xpEventChangeTriggerIteration == 5) {
		xpEventChangeTriggerIteration = 0
	}
}

var xpPickupEventTriggerIteration = 0
function playerXpEventPickupXp(e) {
	if (xpPickupEventTriggerIteration == 0) {
		var xp = e.event.getOrb().f_20770_;
		e.event.getOrb().f_20770_ = 0
		addCustomXpValue(e.event.getPlayer(), xp)
	}
	xpPickupEventTriggerIteration++
	if (xpPickupEventTriggerIteration == 5) {
		xpPickupEventTriggerIteration = 0
	}
}


function addCustomXpValue(forgePlayer, xpToAdd) {
	var noppesPlayer = API.getIEntity(forgePlayer)
	noppesPlayer.getStoreddata().put("totalExperiencePoints", noppesPlayer.getStoreddata().get("totalExperiencePoints") + xpToAdd)

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