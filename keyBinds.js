var KEYBIND_GUI
var keybindMode = false
var rebindingID
var rebindingFunction

var defaultKeyBinds = {
        "key_nightvision":78,
        "key_gamemode":71,
        "key_heal":72,
        "key_command":77,
        "key_stats":88
    }

function init(e){
    if(e.player.storeddata.get("keyBindsJSON") == undefined){
        e.player.storeddata.put("keyBindsJSON",JSON.stringify(defaultKeyBinds))
    }
}

function chat(e){
    if(e.message=="!keyBinds"){
        e.setCanceled(true)
        showKeybindGUI(e)
    }
}

function showKeybindGUI(e){
    var keyBinds = JSON.parse(e.player.storeddata.get("keyBindsJSON"))
    var keyBindsKeys = Object.keys(keyBinds)

    var horizontalPos = 120
    var verticalPos = 10
    var horizontalSize = 25
    var verticalSize = 20
    KEYBIND_GUI = e.API.createCustomGui(id("KEYBIND_GUI"), 256, 256, false)
    KEYBIND_GUI.addLabel(id("GUI_Title"), "Custom Keybinds", 100, -5, 1, 1)
    KEYBIND_GUI.addButton(id(keyBindsKeys[4]), String.fromCharCode(keyBinds.key_stats), horizontalPos, verticalPos, horizontalSize, verticalSize)
    
    KEYBIND_GUI.addButton(id(keyBindsKeys[0]), String.fromCharCode(keyBinds.key_nightvision), horizontalPos, verticalPos + 60, horizontalSize, verticalSize)
    KEYBIND_GUI.addButton(id(keyBindsKeys[1]), String.fromCharCode(keyBinds.key_gamemode), horizontalPos, verticalPos + 90, horizontalSize, verticalSize)
    KEYBIND_GUI.addButton(id(keyBindsKeys[2]),String.fromCharCode(keyBinds.key_heal), horizontalPos, verticalPos+120, horizontalSize, verticalSize)
    KEYBIND_GUI.addButton(id(keyBindsKeys[3]), String.fromCharCode(keyBinds.key_command), horizontalPos, verticalPos+150, horizontalSize, verticalSize)
    
    KEYBIND_GUI.addLabel(id("L_Stats"), "Stats Screen:", horizontalPos-80, verticalPos+10, 1, 1)
    KEYBIND_GUI.addLabel(id("L_Nightvision"), "Nightvision:", horizontalPos-80, verticalPos+70, 1, 1)
    KEYBIND_GUI.addLabel(id("L_Gamemode"), "Gamemode:", horizontalPos-80, verticalPos+100, 1, 1)
    KEYBIND_GUI.addLabel(id("L_Heal"), "Fully heal:", horizontalPos-80, verticalPos+130, 1, 1)
    KEYBIND_GUI.addLabel(id("L_Command"), "Cmnd Feedback:", horizontalPos-80, verticalPos+160, 1, 1)
    e.player.showCustomGui(KEYBIND_GUI)
} 


function customGuiButton(e){
    if(e.buttonId != id("Exit")){
        editKeyBind(e)
        }
}


function editKeyBind(e){
    KEYBIND_GUI.getComponent(e.buttonId).setLabel('')
    KEYBIND_GUI.update(e.player)
    keybindMode = true
    rebindingID = e.buttonId
}


function keyPressed(e){
    if(keybindMode){
        var keyBinds = JSON.parse(e.player.storeddata.get("keyBindsJSON"))
        keyBinds[idname(rebindingID)] = e.key
        keybindMode = false
        KEYBIND_GUI.getComponent(rebindingID).setLabel(String.fromCharCode(e.key))
        KEYBIND_GUI.update(e.player)
        e.player.storeddata.put("keyBindsJSON",JSON.stringify(keyBinds))
    }
}

