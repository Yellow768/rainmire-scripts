//Developer Tools
var keyMode = false
var keyBinds

function init(e) {
    if (e.player.getGamemode() == 1) {
        e.player.message("&dDeveloper Tools On. Type &6!devhelp &dfor a list of functions")
        if (e.player.storeddata.get("uiPlayChime") == undefined) {
            e.player.storeddata.put("uiPlayChime", 1)
        }
        if (e.player.storeddata.get("brushArray") == undefined) {
            e.player.storeddata.put("brushArray", "[]")
        }
        e.player.playSound("minecraft:block.note_block.chime", e.player.storeddata.get("uiPlayChime"), 1)


    }
    setUpVals(e)

}



function keyPressed(e) {
    var keyBinds = JSON.parse(e.player.storeddata.get("keyBindsJSON"))
    if (e.openGui == '') {
        if (keyMode) {
            e.player.message(e.key)
        }
        switch (e.key) {
            case keyBinds.key_gamemode:
                switchGamemode()
                break;
            case keyBinds.key_nightvision:
                toggleNightVision()
                break;
            case keyBinds.key_heal:
                fullyHeal();
                break;
            case keyBinds.key_command:
                toggleCommandFeedback()
                break;
            case keyBinds.key_reload:
                executeCommand('/tellraw @a {"text":"CUSTOMNPCS: Reloading Scripts (This may take a bit! Expect lag!)","color":"yellow"}')
                executeCommand("noppes script reload")
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
        case "!help":
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
        case "!toggleCommandFeedback":
            toggleCommandFeedback(e)
            break;
        case "!giveAttrPoints":
            e.player.message("&cUsage: !giveAttrPoints [amount]")
            break;
        case "!brushes":
            listBrushPresets(e)
            break;
        case "!br":
            listBrushPresets(e)
            break;
        default:
            e.setCanceled(false)
    }
    if (e.message.indexOf("!giveAttrPoints ") != -1) {
        giveAttributePoints(e.message.split(' ')[1])
        e.setCanceled(true)
    }
    if (e.message.indexOf("!brushes") != -1) {
        e.setCanceled(true)
        runBrushCommand(e.message)
    }
    if (e.message.indexOf("!br ") != -1) {
        e.setCanceled(true)
        runBrushCommand(e.message)
    }
}









function displayHelpMessage() {
    player.message("&a===Dev Help===")
    player.message("&6!devhelp: &rBrings this list up")
    player.message("&6!keyBinds: &rBrings up GUI to edit key bindings")
    player.message("&6!showKey : &rToggles show key mode. When on, key presses will return their key ID in chat (for scripting uses)")
    player.message("&6!toggleChime : &rToggles if the chime plays whenever the dev tools are reloaded")
    player.message("&6!resetStats: &rReset your level and attributes to base level")
    player.message("&6!levelUp: &rLevel up!")
    player.message("&6!giveAttrPoints [number]: &rGive yourself an amount of attribute points")
    player.message("&6!toggleCommandFeedback: &rToggles the gamerule 'sendCommandFeedback'")
    player.message("&6!brushes &rOR &6!br: &rDisplays saved brushes. Type &6!br help&r for more commands")
    player.message(" ")
    player.message("&6N: &rToggles Nightvision")
    player.message("&6G: &rSwitched between Adventure Mode and Creative Mode")
    player.message("&6H: &rFully heals you")
    player.message("&6M: &rToggles the gamerule 'sendCommandFeedback")
    player.message("&6O: &rReloads CustomNPCs scripts")
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
    player.message(amount)
    if (!isNaN(amount)) {
        addToScore("AttrPoints", parseInt(amount))
        player.message("Gave " + amount + " attribute points")
    }
    else {
        player.message("&cInvalid amount. Amount must be a number")
    }

}


function runBrushCommand(message) {
    var splitMessage = message.split(' ')
    if (splitMessage[1] != undefined) {
        switch (splitMessage[1]) {
            case "save":
                saveBrushPreset(message)
                break;
            case "list":
                listBrushPresets()
                break;
            case "edit":
                editBrushPreset(message)
                break;
            case "delete":
                deleteBrushPreset(message)
                break;
            case "help":

                player.message("&a==Brushes Commands==")
                player.message("&6!br list &eOR &6!br: &rDisplays the list of saved brushes, which can be clicked on to apply")
                player.message("&6!br save [name] [brush] : &r Saves a new brush preset")
                player.message("&6!br edit [number] [brush] : &rReplaces the command of a saved brush")
                player.message("&6!br delete [number] : &rDeletes a certain brush OR deletes all brushes if you use 'all' as the number")
                break;
            default:
                player.message("&cUnrecognized command. Type &6!br help &cfor a list of commands")
        }
    }
}



function listBrushPresets() {
    var brushes = JSON.parse(player.storeddata.get("brushArray"))

    var singleTellRawElement
    var fullTellRaw = ""
    for (var i = 0; i < brushes.length; i++) {
        singleTellRawElement = '{"text":"\\n[' + i + '.","color":"light_purple"},{"text":" ","bold":true,"color":"light_purple"},{"text":"' + brushes[i].name + '","color":"light_purple","clickEvent":{"action":"run_command","value":"' + brushes[i].command + '"},"hoverEvent":{"action":"show_text","contents":"Click to apply brush"}},{"text":" ","color":"light_purple"},{"text":"(?)","color":"yellow","clickEvent":{"action":"suggest_command","value":"' + brushes[i].command + '"},"hoverEvent":{"action":"show_text","contents":"' + brushes[i].command + '"}},{"text":"(T)","color":"yellow","clickEvent":{"action":"run_command","value":"/give ' + player.name + ' ' + brushes[i].tool + '"},"hoverEvent":{"action":"show_text","contents":"' + brushes[i].tool + '"}},{"text":"]","color":"light_purple"},{"text":" "}'
        //'{"text":"[' + i + ': ' + brushes[i].name + '","color":"light_purple","clickEvent":{"action":"run_command","value":"' + brushes[i].command + '"}},{"text":" "},{"text":"(?)","color":"yellow","clickEvent":{"action":"suggest_command","value":"' + brushes[i].command + '"},"hoverEvent":{"action":"show_text","contents":"' + brushes[i].command + '"}},{"text":"]","color":"light_purple"},{"text":" "}'
        fullTellRaw = fullTellRaw + ',' + singleTellRawElement
    }
    player.message("&e&nSaved Brushes:")
    player.message(" ")

    executeCommand('/tellraw ' + player.name + ' [""' + fullTellRaw + ']')



}






function saveBrushPreset(commandString) {
    var splitCommandString = commandString.split(' ')
    var brushes = JSON.parse(player.storeddata.get("brushArray"))

    if (splitCommandString[2] == undefined) {
        player.message("&cUsage: !br save [name] args...")
    }
    else if (splitCommandString[2].indexOf('\\') != -1) {
        player.message("&cSorry, you are not allowed to use \\ in the brush name")
    }
    else if (splitCommandString[3] == undefined) {
        player.message("&cYou must define a command")
    }
    else {
        var command = commandString.slice(commandString.indexOf(splitCommandString[2]) + splitCommandString[2].length + 1)
        if (command[0] != "/") {
            command = "/" + command
        }
        brushes.push({ "name": escapeRegex(splitCommandString[2]), "command": escapeRegex(command), "tool": player.getMainhandItem().getName() })
        player.storeddata.put("brushArray", JSON.stringify(brushes))
        player.message("&aNew Brush saved as " + splitCommandString[2] + " [" + command + "]")
    }
}

function editBrushPreset(commandString) {
    var splitCommandString = commandString.split(' ')
    var brushes = JSON.parse(player.storeddata.get("brushArray"))
    var brushIndex = splitCommandString[2]
    if (brushIndex == undefined || isNaN(brushIndex) || brushIndex > brushes.length || brushes[0] == undefined) {
        player.message("&cSyntax Error: A valid number must be selected")
    }
    else if (splitCommandString[3] == undefined) {
        player.message("&cBrush was not updated. You must define the command to replace.")
    }
    else {
        var newCommand = commandString.slice(commandString.indexOf(brushIndex) + brushIndex.length + 1)
        if (newCommand[0] != "/") {
            newCommand = "/" + newCommand
        }
        brushes[brushIndex].command = escapeRegex(newCommand)
        player.storeddata.put("brushArray", JSON.stringify(brushes))
        player.message("&eBrush " + brushIndex + " [" + brushes[brushIndex].name + "] has been updated. NOTE! You need to run !br list again")
    }
}



function deleteBrushPreset(commandString) {
    var splitCommandString = commandString.split(' ')
    var brushes = JSON.parse(player.storeddata.get("brushArray"))
    var deletionIndex = splitCommandString[2]
    if (deletionIndex == undefined) {
        player.message("&cYou must select a number to delete")
    }
    else if (deletionIndex == "all") {
        brushes = []
        player.storeddata.put("brushArray", JSON.stringify(brushes))
        player.message("&eAll brushes deleted")
    }
    else if (!isNaN(deletionIndex)) {
        player.message("&eBrush " + deletionIndex + " [" + brushes[deletionIndex].name + "] deleted")
        brushes.splice(deletionIndex, 1)
        player.storeddata.put("brushArray", JSON.stringify(brushes))
    }
    else {
        player.message("&cSyntax Error: You need to type either a number or 'all'")
    }
}

