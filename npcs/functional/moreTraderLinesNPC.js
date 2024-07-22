//This script goes onto the NPC
"use strict";
//Runon's Stuff
var _IDS = {
    counter: 1,
    ids: {},
    lookup: {}
}; // var tempdata = API.getIWorld(0).getTempdata();
// if(tempdata.get('_GUI_IDS')) {
//     _GUI_IDS = tempdata.get('_GUI_IDS');
// } else {
//     tempdata.put('_GUI_IDS', _GUI_IDS);
// }

function id(name) {
    if (!name) {
        name = Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7);
    }

    var _id = _IDS.ids[name] || (_IDS.ids[name] = _IDS.counter++);

    _IDS.lookup[_id] = name;
    return _id;
}

function idname(_id) {
    return _IDS.lookup[_id];
}

function removeid(name) {
    var _id = id(name);

    delete _IDS.lookup[_id];
    delete _IDS.ids[name];
}

;


var KEYBIND_GUI
var LINE_EDITOR
var thisNPC
var lineCategory
var randomLines

var tradeLinesArray
var failedLinesArray
var closeLinesArray


function init(e) {
    randomLines = e.npc.storeddata.get("randomLines")
    e.npc.storeddata.put("tradeLineCounter", -1)
    e.npc.storeddata.put("failedLineCounter", -1)
    e.npc.storeddata.put("closeLineCounter", -1)
    if (e.npc.storeddata.get("randomLines") == undefined) {
        randomLines = true
        e.npc.storeddata.put("randomLines", randomLines)
    }
}

function interact(e) {
    thisNPC = e.npc
    if (e.player.isSneaking() && e.player.gamemode == 1) {
        openTraderDialogGUI(e)
        e.setCanceled(true)
    }
    else {
        updateArrays(e)
        e.player.tempdata.put("currentTraderNPC", e.npc)
        e.player.tempdata.put("traderClosedArray", closeLinesArray)
    }
}


//Trader NPC
function openTraderDialogGUI(e) {
    var horizontalPos = 50
    var verticalPos = 10
    var horizontalSize = 140
    var verticalSize = 20




    KEYBIND_GUI = e.API.createCustomGui(id("TRADER_GUI"), 256, 256, false)
    KEYBIND_GUI.setBackgroundTexture("minecraft:textures/gui/demo_background.png")
    KEYBIND_GUI.addButton(10, "Trade Lines", horizontalPos, verticalPos, horizontalSize, verticalSize)
    KEYBIND_GUI.addButton(20, "Failed Lines", horizontalPos, verticalPos + 30, horizontalSize, verticalSize)
    KEYBIND_GUI.addButton(30, "Close Lines", horizontalPos, verticalPos + 60, horizontalSize, verticalSize)
    KEYBIND_GUI.addButton(40, randomLines, 130, verticalPos + 90, 40, 20)
    KEYBIND_GUI.addButton(50, "Exit", 200, 140, 40, 20)

    KEYBIND_GUI.addLabel(5, "More Trader Lines", 75, -5, 1, 1)
    KEYBIND_GUI.addLabel(41, "Random Lines:", horizontalPos, verticalPos + 100, 1, 1)




    e.player.showCustomGui(KEYBIND_GUI)

}


function openLineEditor(e, category) {
    lineCategory = category
    LINE_EDITOR = e.API.createCustomGui(id("LINE_GUI"), 512, 256, false)
    LINE_EDITOR.setBackgroundTexture("customnpcs:textures/gui/menubg.png")
    LINE_EDITOR.addLabel(10, "Lines", 120, -5, 1, 1)
    LINE_EDITOR.addLabel(15, "Sounds", 350, -5, 1, 1)
    for (var i = 0; i < 8; i++) {
        //Lines
        LINE_EDITOR.addTextField(100 + i, 10, 10 + (i * 25), 240, 20)
        LINE_EDITOR.getComponent(100 + i).setText(thisNPC.storeddata.get(lineCategory + "Line" + i))

        //Sounds
        LINE_EDITOR.addTextField(120 + i, 266, 10 + (i * 25), 240, 20)
        LINE_EDITOR.getComponent(120 + i).setText(thisNPC.storeddata.get(lineCategory + "Sound" + i))

    }
    LINE_EDITOR.addButton(60, "Back", 240, 220, 40, 20)
    e.player.showCustomGui(LINE_EDITOR)
}


function customGuiButton(e) {
    switch (e.buttonId) {
        case 10:
            openLineEditor(e, "trade")
            break;
        case 20:
            openLineEditor(e, "failed")
            break;
        case 30:
            openLineEditor(e, "closed")
            break;
        case 40:
            randomLines = !randomLines
            thisNPC.storeddata.put("randomLines", randomLines)
            e.player.getCustomGui().getComponent(40).setLabel(randomLines)
            e.player.getCustomGui().update(e.player)
            break;
        case 50:
            e.player.closeGui()
            break
        case 60:
            openTraderDialogGUI(e)
            break;
    }
}

function customGuiClosed(e) {
    if (e.gui.getID() == id("LINE_GUI")) {

        for (var i = 0; i < 8; i++) {
            thisNPC.storeddata.put(lineCategory + "Line" + i, e.gui.getComponent(100 + i).getText())
            thisNPC.storeddata.put(lineCategory + "Sound" + i, e.gui.getComponent(120 + i).getText())
        }
    }
    updateArrays(e)
}


function updateArrays(e) {
    var editedArrayIndex = 0
    switch (lineCategory) {
        case "trade":
            tradeLinesArray = []
            break;
        case "failed":
            failedLinesArray = []
            editedArrayIndex = 1
            break;
        case "closed":
            closeLinesArray = []
            editedArrayIndex = 2
            break;
        default:

    }

    var lineArrays = [tradeLinesArray, failedLinesArray, closeLinesArray]
    for (var j = 0; j < 8; j++) {
        if (thisNPC.storeddata.get(lineCategory + "Line" + j) != '') {
            var lineObject = { line: "", sound: "" };
            lineObject.line = thisNPC.storeddata.get(lineCategory + "Line" + j)
            lineObject.sound = thisNPC.storeddata.get(lineCategory + "Sound" + j)
            lineArrays[editedArrayIndex].push(lineObject)
        }
    }
}





function chooseLine(e, category) {
    var arrayIndex = [tradeLinesArray, failedLinesArray]
    var counterIndex = ["tradeLineCounter", "failedLineCounter"]
    var lineIndex
    if (arrayIndex[category].length > 0) {
        if (randomLines) {
            lineIndex = Math.floor(Math.random() * arrayIndex[category].length)
        }
        else {
            lineIndex = e.npc.storeddata.get(counterIndex[category])
            lineIndex = lineIndex + 1 % arrayIndex[category].length
            e.npc.storeddata.put(counterIndex[category], lineIndex)
        }
        e.npc.say(arrayIndex[category][lineIndex].line)
        if (arrayIndex[category][lineIndex].sound != undefined) {
            e.npc.getWorld().playSoundAt(e.npc.pos, arrayIndex[category][lineIndex].sound, 1, 1)
        }
    }
}



function trade(e) {
    chooseLine(e, 0)
}


function tradeFailed(e) {
    //e.event = Real event object, not cancelable
    //This event is now cancelable also, by still giving the sell item
    chooseLine(e, 1)
}


//Make sure that trade() and tradeFailed() gets executed
function role(e) {
    roleTraderEvents(e);
}

//==========================================================
function roleTraderEvents(e) {
    var role = e.npc.role;
    if (role) {
        if (role.getType() == RoleType_TRADER) {
            if (e.isCancelable() && typeof trade === 'function') {
                trade(e);
            }
            if (!e.isCancelable() && typeof tradeFailed === 'function') {
                var fakeEvent = {
                    event: e,
                    API: e.API,
                    npc: e.npc,
                    player: e.player,
                    currency1: e.currency1,
                    currency2: e.currency2,
                    sold: e.sold,
                    isCanceled: false,
                    isCancelable: function () { return true; },
                    setCanceled: function (c) { this.isCanceled = !!c; },
                };
                tradeFailed(fakeEvent);

                if (fakeEvent.isCanceled) {
                    if (fakeEvent.sold) {
                        if (!e.player.giveItem(fakeEvent.sold)) {
                            e.player.dropItem(fakeEvent.sold);
                        }
                    }
                }
            }
        }
    }
}