//Developer Tools
var keyMode = false
var keyBinds
var statsStringArray = ["Heart", "Body", "Mind"]

function init(e) {
    if (!e.player.world.storeddata.has("ids")) {
        e.player.world.storeddata.put("ids", JSON.stringify({
            counter: 1,
            ids: {},
            lookup: {}
        }))
    }

    e.player.world.tempdata.put("ids", JSON.parse(e.player.world.storeddata.get("ids")))
    if (e.player.storeddata.get("helpMessage") == 1) {
        e.player.message("&dDeveloper Tools On. Type &6!devHelp &dfor a list of functions")
    }

    if (e.player.world.storeddata.get(e.player.name + "uiPlayChime") == undefined) {
        e.player.world.storeddata.put(e.player.name + "uiPlayChime", 1)
    }
    if (e.player.world.storeddata.get(e.player.name + "brushArray") == undefined) {
        e.player.world.storeddata.put(e.player.name + "brushArray", "[]")
    }
    if (!e.player.storeddata.has("creativeStats")) {
        e.player.storeddata.put("creativeStats", 0)
    }
    if (!e.player.storeddata.has("helpMessage")) {
        e.player.storeddata.put("helpMessage", 0)
    }
    e.player.playSound("minecraft:block.note_block.chime", e.player.storeddata.get("uiPlayChime"), 1)
    if (!e.player.storeddata.has("keyBindsJSON")) {
        e.player.storeddata.put("keyBindsJSON", JSON.stringify(defaultKeyBinds))
    }
    e.player.tempdata.put("currentOpponents", [])
    executeCommand("/stopsound " + e.player.name + " record iob:music.battle.drums")
    registerScoreboardPlayer(e)
    e.player.timers.forceStart(909820, 0, true)

}


function keyPressed(e) {
    if (keybindMode) {
        assignKey(e)
        return
    }
    var keyBinds = JSON.parse(e.player.storeddata.get("keyBindsJSON"))
    if (keyMode) {
        e.player.message(e.key)
    }
    if (e.openGui == '') {

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
                //toggleCommandFeedback()
                break;
            case keyBinds.key_reload:
                executeCommand('/tellraw @a {"text":"CUSTOMNPCS: Reloading Scripts (This may take a bit! Expect lag!)","color":"yellow"}')
                executeCommand("noppes script reload")
                break;
            case keyBinds.key_breath:
                switch (e.player.getPotionEffect(13)) {
                    case -1:
                        executeCommand("/effect give " + player.name + " minecraft:water_breathing infinite 0 true")
                        e.player.message("&bWater Breathing &dturned &aon")
                        break;
                    default:
                        executeCommand("/effect clear " + player.name + " minecraft:water_breathing");
                        e.player.message("&bWater Breathing &dturned &coff")
                        break;
                }
                break;
            case keyBinds.key_npcTools:
                toggleNPCTools()
                break;
            case keyBinds.key_soundsMenu:
                e.player.showSoundSelectionGUI()
                break;
        }
    }
}










function chat(e) {
    e.setCanceled(true)
    switch (e.message) {

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
            //toggleCommandFeedback(e)
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
        case "!bw":
            convertToBreakableWall(e)
            break;
        case "!resetIDGenerator":
            resetIds(e.player.world)
            e.player.message("&eReset all IDs")
            break;
        case "!togglePerks":
            togglePerks(e)
            break;
        case "!resetPerks":
            e.player.storeddata.remove("selected_powers")
            setScore("good_perk_debt", 0)
            setScore("bad_perk_debt", 0)
            e.player.message("&eAll Perks Forgotten. Reset Scripts")
            break;
        case "!allPerks":
            var perk_ids = Object.keys(good_perks)
            for (var i = 0; i < perk_ids.length; i++) {
                givePerk(perk_ids[i])
            }
            e.player.message("&bAll perks granted")
            break;
        case "!allDampeners":
            var perk_ids = Object.keys(dampening_perks)
            for (var i = 0; i < perk_ids.length; i++) {
                giveDampener(perk_ids[i])
            }
            e.player.message("&6All dampeners granted")
            break;
        case "!resetCurrentAir":
            resetCurrentAir()
            break;
        case "!markImportant":
            markImportant()
            break;
        case "!keyBinds":
            showKeybindGUI(e)
            break;
        case "!display":
            setItemDisplay(e)
            break;
        case "!resetRespawns":
            e.player.storeddata.remove("respawnArray")
            e.player.message("Respawns Reset")
            break;
        case "!creativeStats":
            toggleCreativeStats(e)
            break;
        case "!cs":
            toggleCreativeStats(e)
            break;
        case "!toggleInitMessage":
            toggleInitMessage(e)
            break;
        case "!resetSpawns":
            e.player.storeddata.remove("respawnArray")
            e.player.message("Respawns cleared")
            break;
        case "!resetChecks":
            e.player.storeddata.remove("prev_failed_dialogs")
            e.player.storeddata.remove("prev_passed_dialogs")
            e.player.message("Checks cleared")
            break;
        case "!resetObservations":
            e.player.storeddata.put("foundObservationNPCS", "[]")
            break;
        case "!resetTraps":
            e.player.storeddata.put("encounteredTrapBlocks", "[]")
            e.player.message("&eReset Trap Block Checks")
            break;
        case "!toggleObservationBlockVisibility":
            if (!e.player.world.storeddata.has("observationBlocksVisible")) e.player.world.storeddata.put("observationBlocksVisible", 0)
            e.player.world.storeddata.put("observationBlocksVisible", Number(!Boolean(e.player.world.storeddata.get("observationBlocksVisible"))))
            e.player.message("&dObservation Blocks Visibility Toggled")
            break;
        case "!tobv":
            e.player.world.storeddata.put("observationBlocksVisible", Number(!Boolean(e.player.world.storeddata.get("observationBlocksVisible"))))
            e.player.message("&dObservation Blocks Visibility Toggled")
            break;
        case "!ua":
            e.player.trigger(id("upgrade_aquatic_gui"), [])
            break;
        case "!god":
            var god_mode = e.player.storeddata.get("godmode")
            if (god_mode != 1) {
                e.player.storeddata.put("godmode", 1)
                e.player.message("&eGod mode turned &aon")
            }
            if (god_mode == 1) {
                e.player.storeddata.put("godmode", 0)
                e.player.message("&eGod mode turned &coff")
            }
            break;
        case "!infiniteHydration":
            toggleInfiniteHydration()
            break;
        case "!ih":
            toggleInfiniteHydration()
            break;
        case "!ignorePerkDebt":
            toggleIgnorePerkDebt()
            break;
        case "!ipd":
            toggleIgnorePerkDebt()
            break;
        case "!copyCoordinates":
            copyCoordinates()
            break;
        case "!cc":
            copyCoordinates()
            break;
        case "!npctools":
            toggleNPCTools()
            break;
        case "!resetDialogData":
            resetDialogData()
            break;
        case "!resetQuestData":
            resetQuestData()
            break;
        case "!resetDQ":
            resetDialogData()
            resetQuestData()
            break;
        default:

            e.setCanceled(false)
    }
    if (e.message.indexOf("!devHelp") != -1) {
        e.setCanceled(true)
        displayHelpMessage(e.message.split(' ')[1])
    }
    if (e.message.indexOf("!giveAttrPoints ") != -1) {
        giveAttributePoints(e.message.split(' ')[1])
        e.setCanceled(true)
    }
    if (e.message.indexOf("!applyAttributeModifier ") != -1) {
        applyAttributeModifier(e, e.message.split(' ')[1], e.message.split(' ')[2])
        e.setCanceled(true)
    }
    if (e.message.indexOf("!setBreath ") != -1) {
        e.setCanceled(true)
        setBreathCommand(e.message.split(' ')[1])
    }
    if (e.message.indexOf("!givePerk ") != -1) {
        e.setCanceled(true)
        givePerk(e.message.split(' ')[1])
    }
    if (e.message.indexOf("!giveDampener ") != -1) {
        e.setCanceled(true)
        giveDampener(e.message.split(' ')[1])
    }
}



function damaged(e) {
    if (e.player.storeddata.get("godmode") == 1) {
        e.setCanceled(true)
    }
}



function trigger(e) {
    if (e.id == 2) {
        displayHelpMessage(2)
    }
    if (e.id == 3) {
        displayHelpMessage(3)
    }
    if (e.id == 4) {
        displayHelpMessage(1)
    }
}

function displayHelpMessage(page) {
    if (page == 1) {
        player.message("&a===Dev Help (1/3)===")
        player.message("&6!applyAttributeModifier <attribute> <value>: &rAdds an attribute modifer to the item in your hand")
        player.message("&6!bw: &rAdds/Removes 'Breakable' at the beginning of your held item name. Placing a 'Breakable' places a breakable version of that block")
        player.message("&6!copyCoordinates || !cc: &rMessages you your current coordinates. Clicking it will copy to clipboard")
        player.message("&6!creativeStats || !cs: &rToggle whether Deftness affects you in creative mode")
        player.message("&6!devhelp: &rBrings this list up")
        player.message("&6!giveAttrPoints [number]: &rGive yourself an amount of attribute points")
        player.message("&6!givePerk <name>: &rUnlocks this perk for you, if it exists")
        executeCommand('/tellraw @p ["",{"text":"(1/3)","color":"light_purple","clickEvent":{"action":"run_command","value":"/noppes script trigger 2"}},{"text":" ","clickEvent":{"action":"run_command","value":"/noppes script trigger 2"}},{"text":"Next Page >>","color":"gold","clickEvent":{"action":"run_command","value":"/noppes script trigger 2"}}]')
        return
    }
    if (page == 2) {
        player.message("&a===Dev Help (2/3)===")
        player.message("&6!giveDampener <name>: &rUnlocks this dampener for you, if it exists")
        player.message("&6!god: &rGod mode")
        player.message("&6!ignorePerkDebt || !ipd: &rToggles whether good perks activate regardless of perk debt.")
        player.message("&6!infiniteHydration || !ih: &rToggles whether hydration is drained upon using powers.")
        player.message("&6!itemDisplay: &rToggles item display mode. If on, right clicking with an item will place a display of it on the block")
        player.message("&6!keyBinds: &rBrings up GUI to edit key bindings")
        player.message("&6!levelUp: &rLevel up!")
        player.message("&6!resetStats: &rReset your level and attributes to base level")
        player.message("&6!resetChecks: &rClear your passed and failed dialog checks.")
        player.message("&6!showKey : &rToggles show key mode. When on, key presses will return their key ID in chat (for scripting uses)")
        player.message("&6!setBreath <value>: &rSets your air decrease rate")
        player.message("&6!toggleObservationBlockVisibility || !tobv: &rToggles whether observation blocks are visible")
        player.message("&6!toggleChime : &rToggles if the chime plays whenever the dev tools are reloaded")
        executeCommand('/tellraw @p ["",{"text":"(2/3)","color":"light_purple","clickEvent":{"action":"run_command","value":"/noppes script trigger 2"}},{"text":" << Prev Page","color":"gold","clickEvent":{"action":"run_command","value":"/noppes script trigger 4"}},{"text":" \\u0020"},{"text":"Next Page >>","color":"gold","clickEvent":{"action":"run_command","value":"/noppes script trigger 3"}}]')
        return
    }
    if (page == 3) {
        player.message("&a===Dev Help (3/3)===")
        player.message("&6!toggleCommandFeedback: &rToggles the gamerule 'sendCommandFeedback'")
        player.message("&6!toggleInitMessage: &rToggles whether the init message appears when scripts reload")
        player.message("&6!togglePerks: &rToggles perks being active.")
        player.message("&6N: &rToggles Nightvision")
        player.message("&6G: &rSwitched between Adventure Mode and Creative Mode")
        player.message("&6H: &rFully heals you")
        player.message("&6Z: &rPuts your coords in chat. Click it to copy to clipboard")
        player.message("&6O: &rReloads CustomNPCs scripts")
        executeCommand('/tellraw @p ["",{"text":"(3/3)","color":"light_purple","clickEvent":{"action":"run_command","value":"/noppes script trigger 2"}},{"text":" ","clickEvent":{"action":"run_command","value":"/noppes script trigger 2"}},{"text":"<< Prev Page","color":"gold","clickEvent":{"action":"run_command","value":"/noppes script trigger 2"}}]')
        return
    }
    else {
        displayHelpMessage(1)
    }


}




function toggleChime() {
    if (player.storeddata.get("uiPlayChime") == null) {
        player.storeddata.put("uiPlayChime", 0)
    }
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
            executeCommand("/effect give " + player.name + " minecraft:night_vision infinite 0 true")
            player.message("&bNightvision turned on")
            break;
        default:
            executeCommand("/effect clear " + player.name + " minecraft:night_vision");
            player.message("&3Nightvision turned off")
            break;
    }
}

function togglePerks(e) {
    var toggle = e.player.world.storeddata.get(e.player.name + "togglePerks")
    if (toggle == null) {
        toggle = 0
    }
    switch (toggle) {
        case 0:
            toggle = 1
            break;
        case 1:
            toggle = 0
            break;
    }

    e.player.world.storeddata.put(e.player.name + "togglePerks", toggle)
    if (toggle) {
        e.player.message("&aPerks have been turned on for you")
    }
    else {
        e.player.message("&ePerks have been turned off for you")
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
    player.getMCEntity().m_20301_(300)
    player.storeddata.put("currentAir", 300)
    setScore("perk_power", getScore("max_perk_power"))
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

    for (var i = 0; i < 3; i++) {
        player.message(statsStringArray[i] + "Mod")
        setScore(statsStringArray[i] + "Base", 1)
        setScore(statsStringArray[i] + "Mod", 0)
        setScore(statsStringArray[i], 1)
    }

    executeCommand("xp set " + player.name + " 1 levels")
    executeCommand("xp set " + player.name + " 0 points")
    setScore("AttrPoints", 0)
    setScore("PerkPoints", 0)
    setScore("swmspd", 1)
    player.storeddata.put("airDecreaseRate", 1)
    player.storeddata.put("originalAttPts", 0)

    player.removeTag("levelUp")
    player.message("&dYour level and attributes have been reset")
    player.storeddata.put("totalExperiencePoints", 0)
}

function giveAttributePoints(amount) {
    if (!isNaN(amount)) {
        addToScore("AttrPoints", parseInt(amount))
        player.message("&aGave " + amount + " attribute points")
    }
    else {
        player.message("&cInvalid amount. Amount must be a number")
    }

}

function applyAttributeModifier(e, attribute, value) {
    var isValidAttribute = false
    for (var i = 0; i < statsStringArray.length; i++) {
        if (statsStringArray[i] == attribute) {
            isValidAttribute = true
        }
    }
    if (!isValidAttribute) {
        player.message("&c" + attribute + " is not a valid attribute, and thus could not be applied")
        return
    }
    if (isNaN(value)) {
        player.message("&c" + value + " is not an integer, and thus could not be applied.")
        return
    }
    player.message("&aApplied " + attribute + " modifer of " + value)
    player.getMainhandItem().nbt.setInteger(attribute, value)
}



function compareSecondColumn(a, b) {
    var nameA = a.name.toUpperCase(); // ignore upper and lowercase
    var nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }

    // names must be equal
    return 0;
}


function setBreathCommand(amount) {
    player.storeddata.put("airDecreaseRate", amount)
    player.message("Set your decrease rate to " + amount)

}

function resetCurrentAir() {
    player.storeddata.put("currentAir", 300)

}

function markImportant() {
    switch (player.getMainhandItem().nbt.has("questItem")) {
        case true:
            player.getMainhandItem().nbt.remove("questItem")
            player.message("Item has been marked &eunimportant")
            break;
        case false:
            player.getMainhandItem().nbt.setBoolean("questItem", true)
            player.message("Item has been marked &aimportant")
            break;
    }
}


function copyCoordinates() {
    executeCommand('/tellraw ' + player.name + ' ["",{"text":"Coordinates are","color":"gold"},{"text":" "},{"text":"' + player.pos.x + ' ' + player.pos.y + ' ' + player.pos.z + '","color":"aqua","clickEvent":{"action":"copy_to_clipboard","value":"' + player.pos.x + ' ' + player.pos.y + ' ' + player.pos.z + '"}},{"text":" || "},{"text":"' + player.pos.x + ', ' + player.pos.y + ', ' + player.pos.z + '","color":"aqua","clickEvent":{"action":"copy_to_clipboard","value":"' + player.pos.x + ', ' + player.pos.y + ', ' + player.pos.z + '"}},{"text":" . "},{"text":"Click either to copy","color":"gold"}]')

}

function timer(e) {
    //musicTimer(e)
    if (e.id == 451) {
        var place_pos = e.player.tempdata.get("npc_placed").up(1)
        var npc = e.player.world.getNearbyEntities(place_pos, 1, 2)[0]
        try {
            var nbt = npc.getEntityNbt()
            var s1 = e.API.stringToNbt('{}');
            s1.putString("Script", "");
            s1.setList("Console", []);
            nbt.setList("Scripts", [s1]);

            var scripts = nbt.getList("Scripts", nbt.getListType("Scripts"))[0];
            var sl = [];
            var requiredScripts = ["npcs/boiler/base_npc_script.js"]; // scripts from your folder

            for (var i = 0; i < requiredScripts.length; i++) {
                var test = e.API.stringToNbt('{}');
                test.putString('Line', requiredScripts[i]);
                sl.push(test);
            }

            scripts.setList("ScriptList", sl);
            nbt.setByte("ScriptEnabled", 1);

            npc.setEntityNbt(nbt);
            // when updated
            var sdata = npc.getStoreddata();
            sdata.put("updated", Date.now());
        }

        catch (er) {
            e.player.message("§cError: §r" + er);
        }
    }
}

function broken(e) {
    if (e.player.tempdata.has("setting_powerline_interface")) {
        e.setCanceled(true)
        e.player.message("&bRemoved Block From Array")
        e.player.tempdata.get("setting_powerline_interface").trigger(2, [e.block.pos])
    }
}

function interact(e) {
    useNPCTool(e)
    if (e.type == 0) {
        if (e.player.tempdata.has("setting_powerline_interface")) {
            e.player.tempdata.remove("setting_powerline_interface")
        }
    }
    if (e.type == 1) {

        if (e.player.getMainhandItem().name == "customnpcs:npcwand") {
            if (e.target.getStoreddata().has("controller_npc")) {
                var controller_npc = e.target.getTempdata().get("controller_npc")
                var NoppesUtilServer = Java.type('noppes.npcs.NoppesUtilServer').class.static;
                var EnumGuiType = Java.type('noppes.npcs.constants.EnumGuiType');
                NoppesUtilServer.sendOpenGui(e.player.getMCEntity(), EnumGuiType.MainMenuDisplay, controller_npc.getMCEntity())
                controller_npc.trigger(76802, [])
                e.target.despawn()
            }
        }
    }
    if (e.type == 2) {
        if (e.player.tempdata.has("setting_powerline_interface") && e.target.name != "customnpcs:npcscripted") {
            e.player.tempdata.get("setting_powerline_interface").trigger(1, [e.target.pos])
            e.player.message("&b[" + e.target.x + " " + e.target.y + " " + e.target.z + " ] added to interface's pos array")
        }
        if (e.player.getMainhandItem().name == "customnpcs:npcwand") {
            e.player.tempdata.put("npc_placed", e.target.pos)
            e.player.timers.start(451, 2, false)

        }
        if (e.player.hasTag("displayMode")) {
            e.setCanceled(true)
            var block = e.player.rayTraceBlock(10, true, false)
            var position = block.pos.offset(block.sideHit, 1)
            if (e.player.getMainhandItem().name != "minecraft:air") {

                executeCommand("/summon item " + position.x + " " + position.y + " " + position.z + " {Item:{id:\"" + e.player.getMainhandItem().name + "\",Count:1},PickupDelay:32767,Age:-32768,CustomModelData:" + e.player.getMainhandItem().getItemNbt().getInteger("customModelData") + ",Tags:[\"DISPLAY\"]}")
                e.player.message("&eItem display placed at " + position.x + " " + position.y + " " + position.z)

            }
            else {
                if (executeCommand('/kill @e[type=minecraft:item,x=' + position.x + ',y=' + position.y + ',z=' + position.z + ',distance=..1.5,tag=DISPLAY,limit=1]') == "No entity was found") {
                    e.player.message("&cThere is no display item there")
                }
                else {
                    e.player.message("&aDisplay Item deleted")
                }


            }
            return
        }

        if (e.player.tempdata.has("clamNPCConfig")) {
            e.player.tempdata.get("clamNPCConfig").trigger(1, [e.target.pos])
            e.player.message("Clam Redstone Set")
            e.player.tempdata.remove("clamNPCConfig")
        }
        if (e.player.getMainhandItem().getDisplayName().indexOf("Breakable") != -1) {
            var sidePlaced = e.player.rayTraceBlock(8, false, false).getSideHit()
            var place_pos = e.target.pos.offset(sidePlaced)
            e.player.world.setBlock(place_pos, "customnpcs:npcscripted")
            try {
                var nbt = e.player.world.getBlock(place_pos).getBlockEntityNBT()
                var s1 = e.API.stringToNbt('{}');
                s1.putString("Script", "");
                s1.setList("Console", []);
                nbt.setList("Scripts", [s1]);

                var scripts = nbt.getList("Scripts", nbt.getListType("Scripts"))[0];
                var sl = [];
                var requiredScripts = ["blocks/breakable_wall.js"]; // scripts from your folder

                for (var i = 0; i < requiredScripts.length; i++) {
                    var test = e.API.stringToNbt('{}');
                    test.putString('Line', requiredScripts[i]);
                    sl.push(test);
                }

                scripts.setList("ScriptList", sl);
                nbt.setByte("ScriptEnabled", 1);

                e.player.world.getBlock(place_pos.getX(), place_pos.getY(), place_pos.getZ()).setTileEntityNBT(nbt);
                e.player.world.getBlock(place_pos.getX(), place_pos.getY(), place_pos.getZ()).trigger(3, e.player.getMainhandItem().name)

                // when updated
                var sdata = e.player.world.getBlock(place_pos.getX(), place_pos.getY(), place_pos.getZ()).getStoreddata();
                sdata.put("updated", Date.now());
            }

            catch (er) {
                e.player.message("§cError: §r" + er);
            }
        }
        if (e.player.getMainhandItem().getDisplayName() == "Chain") {
            var sidePlaced = e.player.rayTraceBlock(8, false, false).getSideHit()
            var place_pos = e.target.pos.offset(sidePlaced)
            e.player.world.setBlock(place_pos, "customnpcs:npcscripted")
            try {
                var nbt = e.player.world.getBlock(place_pos).getBlockEntityNBT()
                var s1 = e.API.stringToNbt('{}');
                s1.putString("Script", "");
                s1.setList("Console", []);
                nbt.setList("Scripts", [s1]);

                var scripts = nbt.getList("Scripts", nbt.getListType("Scripts"))[0];
                var sl = [];
                var requiredScripts = ["blocks/chain.js"]; // scripts from your folder

                for (var i = 0; i < requiredScripts.length; i++) {
                    var test = e.API.stringToNbt('{}');
                    test.putString('Line', requiredScripts[i]);
                    sl.push(test);
                }

                scripts.setList("ScriptList", sl);
                nbt.setByte("ScriptEnabled", 1);
                var block = e.player.world.getBlock(place_pos.getX(), place_pos.getY(), place_pos.getZ())
                block.setTileEntityNBT(nbt);
                block.setModel("chain")
                e.player.world.playSoundAt(block.pos, "block.chain.place", 1, 1)
                // when updated
                var sdata = e.player.world.getBlock(place_pos.getX(), place_pos.getY(), place_pos.getZ()).getStoreddata();
                sdata.put("updated", Date.now());
            }

            catch (er) {
                e.player.message("§cError: §r" + er);
            }
        }
    }
}

function convertToBreakableWall(e) {
    var item = e.player.getMainhandItem()
    if (item.getDisplayName().indexOf("Breakable") != -1) {
        item.setCustomName(item.getDisplayName().replace("Breakable ", ""))
        e.player.message("&eBlock returned to normal")
    }
    else {
        item.setCustomName("Breakable " + item.getDisplayName())
        e.player.message("&eBlock converted to breakable")
    }


}

function setItemDisplay(e) {
    switch (e.player.hasTag("displayMode")) {
        case true:
            e.player.removeTag("displayMode")
            break;
        case false:
            e.player.addTag("displayMode")
            break;
    }
}

function toggleCreativeStats(e) {
    switch (e.player.storeddata.get("creativeStats")) {
        case 0:
            e.player.storeddata.put("creativeStats", 1)
            e.player.message("&eDeftness &anow affects you &ein creative mode")
            break;
        case 1:
            e.player.storeddata.put("creativeStats", 0)
            e.player.message("&eDeftness &cno longer affects you &ein creative mode")
            break
    }
}

function toggleInitMessage(e) {
    switch (e.player.storeddata.get("helpMessage")) {
        case 0:
            e.player.storeddata.put("helpMessage", 1)
            e.player.message("&eDev help init message turned &aon")
            break;
        case 1:
            e.player.storeddata.put("helpMessage", 0)
            e.player.message("&eDev help init message turned &coff")
            break
    }
}

function givePerk(message) {
    player.trigger(id("grant_new_perk"), [message])
}

function giveDampener(message) {
    player.trigger(id("grant_new_dampener"), [message])
}

function tick(e) {
    if (e.player.hasTag("displayMode")) {
        executeCommand('/title ' + e.player.name + ' actionbar {"text":"Display Mode Active. type !display to disable.","color":"yellow"}')
    }
    if (e.player.tempdata.has("setting_powerline_interface")) {

        displayTitle(e, "Interface Power Line: Right/left click to add/remove block from interface's pos array. Edit interface to set it", "aqua")
    }
}



function toggleInfiniteHydration() {
    if (!player.storeddata.has("infiniteHydration")) player.storeddata.put("infiniteHydration", 0)
    if (player.storeddata.get("infiniteHydration") == 1) {
        player.storeddata.put("infiniteHydration", 0)
        player.message("&eInfinite Hydration turned &coff")
        return
    }
    else {
        player.storeddata.put("infiniteHydration", 1)
        player.message("&eInfinite Hydration turned &aon")
        return
    }

}

function toggleIgnorePerkDebt() {
    if (!player.storeddata.has("ignorePerkDebt")) {
        player.storeddata.put("ignorePerkDebt", 1)
        player.message("&eIgnore Perk Debt turned &aon")
        return
    }
    else {
        player.storeddata.remove("ignorePerkDebt")
        player.message("&eIgnore Perk Debt turned &coff")
        return
    }
}

function toggleNPCTools() {
    if (player.hasTag("npcToolMode")) {
        for (var i = 0; i < 9; i++) {
            player.getInventory().setSlot(i, player.tempdata.get("saved_hotbar")[i])
        }
        player.removeTag("npcToolMode")
        return
    }
    var spawner = player.world.createItem("netherite_hoe", 1)
    var eraser = player.world.createItem("copper_ingot", 1)
    var mover = player.world.createItem("recovery_compass", 1)
    spawner.getNbt().putString("Tool", "Spawner")
    eraser.getNbt().putString("Tool", "Eraser")
    mover.getNbt().putString("Tool", "Mover")
    spawner.setCustomName("§aSpawner")
    eraser.setCustomName("§cEraser")
    mover.setCustomName("§bMover")
    var current_hotbar = []
    for (var i = 0; i < 9; i++) {
        current_hotbar.push(player.getInventory().getSlot(i))
        player.getInventory().setSlot(i, player.world.createItem("air", 1))
    }
    player.tempdata.put("saved_hotbar", current_hotbar)
    player.addTag("npcToolMode")
    player.giveItem(spawner)
    player.giveItem(mover)
    player.giveItem(eraser)
    player.giveItem(player.world.createItem("customnpcs:npcwand", 1))
    player.giveItem(player.world.createItem("customnpcs:npcscripter", 1))
    player.giveItem(player.world.createItem("customnpcs:npcmobcloner", 1))


}

function logout(e) {
    if (player.hasTag("npcToolMode")) {
        for (var i = 0; i < 9; i++) {
            player.getInventory().setSlot(i, player.tempdata.get("saved_hotbar")[i])
        }
        player.removeTag("npcToolMode")
        return
    }
}

function died(e) {
    if (player.hasTag("npcToolMode")) {
        for (var i = 0; i < 9; i++) {
            player.getInventory().setSlot(i, player.tempdata.get("saved_hotbar")[i])
        }
        player.removeTag("npcToolMode")
        return
    }
}

function resetQuestData() {
    for (var i = 0; i < 1000; i++) {
        player.removeQuest(i)
    }
    player.message("&eQuest Data Cleared")
}
function resetDialogData() {
    for (var i = 0; i < 1000; i++) {
        player.removeDialog(i)
    }
    player.message("&eDialog Data Cleared")
    player.storeddata.remove("prev_failed_dialogs")
    player.storeddata.remove("prev_passed_dialogs")
}