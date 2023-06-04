var API = Java.type('noppes.npcs.api.NpcAPI').Instance();

"use strict";
//Runon's Stuff
var _GUI_IDS = {
    counter: 1,
    ids: {},
    lookup: {}
}

function id(name) {
    if (!name) {
        name = Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7);
    }

    var _id = _GUI_IDS.ids[name] || (_GUI_IDS.ids[name] = _GUI_IDS.counter++);

    _GUI_IDS.lookup[_id] = name;
    return _id;
}

function idname(_id) {
    return _GUI_IDS.lookup[_id];
}

function removeid(name) {
    var _id = id(name);

    delete _GUI_IDS.lookup[_id];
    delete _GUI_IDS.ids[name];
}

;

var perkGUI, selected_perk_buttons, collected_perk_buttons, selected_perk_array, collected_perk_array, selected_bad_perk_array, collected_bad_perk_array
var guiOpen = false
var player
var fromRemant = false


function createPerkGui(e, editable, init) {
    fromRemant = false
    if (editable && init) {
        e.player.playSound("minecraft:block.conduit.activate", 1, 1)
        fromRemant = true
    }

    e.player.playSound("minecraft:item.book.page_turn", 1, 1)
    var base_x = 10
    var base_y = 30
    var selected_base_x = 78
    var selected_base_y = 40
    guiOpen = true
    perkGUI = e.API.createCustomGui(id(player.name + "PERKGUI"), 256, 256, false)
    perkGUI.setBackgroundTexture("iob:textures/customgui/perk_gui.png")
    selected_perk_array = JSON.parse(e.player.storeddata.get("selected_perk_array"))
    collected_perk_array = JSON.parse(e.player.storeddata.get("collected_perk_array"))
    selected_bad_perk_array = JSON.parse(e.player.storeddata.get("selected_bad_perk_array"))
    collected_bad_perk_array = JSON.parse(e.player.storeddata.get("collected_bad_perk_array"))
    for (var i = 0; i < selected_perk_array.length; i++) {
        var newButton = perkGUI.addButton(i, "", selected_base_x + 4, 4 + selected_base_y + (36 * i), 16, 16)
        newButton.setHoverText("§e" + selected_perk_array[i].name + " | §bCost: " + selected_perk_array[i].cost + " §r" + selected_perk_array[i].description)
        newButton.setEnabled(editable)
        var texture = perkGUI.addTexturedRect(500 + i, "iob:textures/customgui/perks/good/" + selected_perk_array[i].id + ".png", selected_base_x, selected_base_y + (36 * i), 256, 256)
        texture.setScale(.10)
    }
    for (var i = 0; i < collected_perk_array.length; i++) {
        var newButton = perkGUI.addButton(20 + i, "", base_x + 5, 4 + base_y + (27 * i), 16, 16)
        newButton.setEnabled(editable)

        if (JSON.stringify(selected_perk_array).indexOf(JSON.stringify(collected_perk_array[i])) != -1) {
            newButton.setEnabled(false)
            var texture = perkGUI.addTexturedRect(600 + i, "iob:textures/customgui/perks/good/" + collected_perk_array[i].id + "_dark.png", base_x, base_y + (27 * i), 256, 256)
            texture.setScale(.10)
        }
        else {
            var texture = perkGUI.addTexturedRect(600 + i, "iob:textures/customgui/perks/good/" + collected_perk_array[i].id + ".png", base_x, base_y + (27 * i), 256, 256)
            texture.setScale(.10)
            newButton.setHoverText("§e" + collected_perk_array[i].name + " | §bCost: " + collected_perk_array[i].cost + " §r" + collected_perk_array[i].description)
        }
    }
    for (var i = 0; i < selected_bad_perk_array.length; i++) {
        var newButton = perkGUI.addButton(100 + i, "", base_x + 146, 14 + base_y + (36 * i), 16, 16)
        newButton.setHoverText("§d" + selected_bad_perk_array[i].name + " | §cCost: " + selected_bad_perk_array[i].cost + " §r " + selected_bad_perk_array[i].description)
        newButton.setEnabled(editable)
        var texture = perkGUI.addTexturedRect(900 + i, "iob:textures/customgui/perks/bad/heart.png", base_x + 142, 10 + base_y + (36 * i), 256, 256)
        texture.setScale(.10)
    }
    for (var i = 0; i < collected_bad_perk_array.length; i++) {

        var newButton = perkGUI.addButton(50 + i, "", base_x + 189, 4 + base_y + (27 * i), 15, 15)
        newButton.setHoverText("§d" + collected_bad_perk_array[i].name + " | §cCost: " + collected_bad_perk_array[i].cost + " §r " + collected_bad_perk_array[i].description)
        newButton.setEnabled(editable)

        if (JSON.stringify(collected_bad_perk_array).indexOf(JSON.stringify(selected_bad_perk_array[i])) != -1) {
            newButton.setEnabled(false)
        }
        var texture = perkGUI.addTexturedRect(700 + i, "iob:textures/customgui/perks/bad/heart.png", base_x + 185, base_y + (27 * i), 256, 256)
        texture.setScale(.10)
    }
    var good_color = 65280
    if (getScore("bad_perk_debt") < getScore("good_perk_debt")) { good_color = 16711680 }
    perkGUI.addLabel(80, getScore("good_perk_debt"), 87, 220, 25, 25, good_color)
    perkGUI.addLabel(81, getScore("bad_perk_debt"), 163, 220, 25, 25)
    e.player.showCustomGui(perkGUI)
}

function perkGuiButton(e) {

    if (e.buttonId >= 0 && e.buttonId <= 4) {
        if (selected_perk_array[e.buttonId].type == 1) {
            addToScore("perk_power_mod", selected_perk_array[e.buttonId].cost)
            e.player.removeTag(selected_perk_array[e.buttonId].id)
        }
        addToScore("good_perk_debt", -selected_perk_array[e.buttonId].cost)
        selected_perk_array.splice(e.buttonId, 1)
        e.player.storeddata.put("selected_perk_array", JSON.stringify(selected_perk_array))
        e.player.playSound("minecraft:item.trident.throw", 1, .2)


    }
    if (e.buttonId >= 20 && e.buttonId <= 40) {
        selected_perk_array.push(collected_perk_array[e.buttonId - 20])
        e.player.storeddata.put("selected_perk_array", JSON.stringify(selected_perk_array))
        if (collected_perk_array[e.buttonId - 20].type == 1) {
            addToScore("perk_power_mod", -collected_perk_array[e.buttonId - 20].cost)
            e.player.addTag(collected_perk_array[e.buttonId - 20].id)
        }
        e.player.playSound("minecraft:item.trident.return", 1, 1)
        addToScore("good_perk_debt", collected_perk_array[e.buttonId - 20].cost)

    }
    if (e.buttonId >= 100 && e.buttonId <= 104) {
        e.player.removeTag(selected_bad_perk_array[e.buttonId - 100].id)
        addToScore("bad_perk_debt", -selected_bad_perk_array[e.buttonId - 100].cost)
        selected_bad_perk_array.splice(e.buttonId - 100, 1)
        e.player.storeddata.put("selected_bad_perk_array", JSON.stringify(selected_bad_perk_array))
        e.player.playSound("minecraft:item.trident.throw", 1, .2)


    }
    if (e.buttonId >= 50 && e.buttonId <= 70) {
        selected_bad_perk_array.push(collected_bad_perk_array[e.buttonId - 50])
        e.player.storeddata.put("selected_bad_perk_array", JSON.stringify(selected_bad_perk_array))
        e.player.playSound("minecraft:item.trident.return", 1, 1)
        e.player.addTag(collected_bad_perk_array[e.buttonId - 50].id)
        addToScore("bad_perk_debt", collected_bad_perk_array[e.buttonId - 50].cost)

    }
    createPerkGui(e, true, false)
    e.player.trigger(200)

}

function customGuiClosed(e) {
    if (fromRemant) {
        e.player.playSound("minecraft:block.conduit.attack.target", 1, 1)
    }

}