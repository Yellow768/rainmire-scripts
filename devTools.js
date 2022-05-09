//Developer Tools
var keyMode = false


function init(e) {
    if (e.player.getGamemode() == 1) {
        e.player.message("&dDeveloper Tools On. Type &6!devhelp &dfor a list of functions")
        if (e.player.storeddata.get("uiPlayChime") == undefined) {
            e.player.storeddata.put("uiPlayChime", 1)
        }
        e.player.playSound("minecraft:block.note_block.chime", e.player.storeddata.get("uiPlayChime"), 1)


    }
    setUpVals(e)

}



function keyPressed(e) {
    if (e.openGui == '') {
        if (keyMode) {
            e.player.message(e.key)
        }
        switch (e.key) {
            case 71:
                switchGamemode()
                break;
            case 78:
                toggleNightVision()
                break;
            case 72:
                fullyHeal();
                break;
            case 77:
                toggleCommandFeedback()
                break;
        }
    }
}

function chat(e) {
    e.setCanceled(true)
    switch (e.message) {
        case "!devhelp":
            displayHelpMessage()
            break;
        case "!toggleChime":
            toggleChime()
            break;
        case "!showKey":
            toggleShowKey()
            break;
        case "!resetStats":
            resetStats()
            break;
        case "!levelUp":
            forceLevelUp()
            break;
        case "!giveAttrPoints":
            giveAttributePoints(e, e.message.substr(16, 19))
            break;
        case "!toggleCommandFeedback":
            toggleCommandFeedback(e)
            break;
        default:
            e.setCanceled(false)
    }

}








function displayHelpMessage() {
    player.message("&a===Dev Help===")
    player.message("&6!devhelp: &rBrings this list up")
    player.message("&6!showKey : &rToggles show key mode. When on, key presses will return their key ID in chat (for scripting uses)")
    player.message("&6!toggleChime : &rToggles if the chime plays whenever the dev tools are reloaded")
    player.message("&6!resetStats: &rReset your level and attributes to base level")
    player.message("&6!levelUp: &rLevel up!")
    player.message("&6!giveAttrPoints [number]: &rGive yourself an amount of attribute points")
    player.message("&6!toggleCommandFeedback: &rToggles the gamerule 'sendCommandFeedback'")
    player.message(" ")
    player.message("&6N: &rToggles Nightvision")
    player.message("&6G: &rSwitched between Adventure Mode and Creative Mode")
    player.message("&6H: &rFully heals you")
    player.message("&6M: &rToggles the gamerule 'sendCommandFeedback")
}

function toggleChime() {

    switch (player.storeddata.get("uiPlayChime")) {
        case 0:
            player.storeddata.put("uiPlayChime", 1)
            break;
        case 1:
            player.storeddata.put("uiPlayChime", 0)
            break;
    }
    player.message("&dPlay chime set to &b" + Boolean(player.storeddata.get("uiPlayChime")))
}

function toggleShowKey() {
    keyMode = !keyMode
    player.message("&dShow Key Numbers set to &a" + keyMode)
}

function toggleCommandFeedback() {
    var result = executeCommand("gamerule sendCommandFeedback").substr(50)
    if (result == "true") {
        executeCommand("gamerule sendCommandFeedback false")
    }
    else {
        executeCommand("gamerule sendCommandFeedback true")
    }
    player.message("&d" + executeCommand("gamerule sendCommandFeedback"))
}

function toggleNightVision() {
    switch (player.getPotionEffect(16)) {
        case -1:
            player.addPotionEffect(16, 5555, 0, true)
            player.message("&bNightvision turned on")
            break;
        default:
            executeCommand("/effect clear " + player.name + " minecraft:night_vision");
            player.message("&3Nightvision turned off")
            break;
    }
}

function switchGamemode() {
    switch (player.gamemode) {
        case 0:
            player.setGamemode(1)
            break;
        case 1:
            player.setGamemode(2)
            break;
        case 2:
            player.setGamemode(1)
            break;
    }
}



function fullyHeal() {
    player.setHealth(player.getMaxHealth())
    player.message("&aYou have been fully healed")
}



//Leveling

function forceLevelUp() {
    var xpThreshold = 0
    for (var i = 0; i < player.getExpLevel(); i++) {
        xpThreshold += 50 + ((i) * 50)
    }
    player.storeddata.put("totalExperiencePoints", xpThreshold)
    executeCommand("tag " + player.name + " add LevelUp")
    player.setExpLevel(player.getExpLevel() + 1)
}

function resetStats() {
    var statsStringArray = ["Charm", "Empathy", "Suggestion", "Brawn", "Grit", "Deftness", "Intellect", "Perception", "Aptitude"]
    for (var i = 0; i < 9; i++) {
        setScore(statsStringArray[i] + "Base", 1)
        setScore(statsStringArray[i] + "Mod", 0)
        setScore(statsStringArray[i], 1)
    }
    e.player.storeddata.put("totalExperiencePoints", 0)
    executeCommand("xp set " + player.name + " 1 levels")
    executeCommand("xp set " + player.name + " 0 points")
    setScore("AttrPoints", 0)
    setScore("PerkPoints", 0)
    setScore("swmspd", 0)
    setScore("breath", 0)
    executeCommand("tag " + player.name + " remove LevelUp")
    player.message("&dYour level and attributes have been reset")
}

function giveAttributePoints(amount) {
    if (!isNaN(amount)) {
        addToScore("AttrPoints", parseInt(amount))
        player.message("Gave " + amount + " attribute points")
    }
    else {
        player.message("&cInvalid amount. Amount must be a number")
    }

}