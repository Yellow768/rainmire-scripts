"use strict";


var selected_perk_buttons, collected_perk_buttons, selected_powers, collected_powers, selected_dampeners, collected_dampeners
var guiOpen = false
var player

var perk_to_button_id = {}

var good_perk_items = {}
var bad_perk_items = {}
var good_perk_ids = Object.keys(good_perks)
var bad_perk_ids = Object.keys(dampening_perks)

function initPerkItems(e) {
    player = e.player
    for (var i = 0; i < good_perk_ids.length; i++) {
        good_perk_items[good_perk_ids[i]] = createItemFromPerk(e.player.world, good_perk_ids[i], false)

    }
    for (var i = 0; i < bad_perk_ids.length; i++) {
        bad_perk_items[bad_perk_ids[i]] = createItemFromPerk(e.player.world, bad_perk_ids[i], true)

    }
}

function createItemFromPerk(world, perkname, dampener) {
    var perk_list = good_perks
    var perk_ids = good_perk_ids
    var color_code = "§b"
    var item_id = "emerald"
    if (dampener) { perk_list = dampening_perks; color_code = "§6"; perk_ids = bad_perk_ids; item_id = "raw_copper" }
    var lore = []
    lore[0] = color_code + "Cost: " + perk_list[perkname].cost
    for (var i = 0; i < perk_list[perkname].description.length; i++) {
        lore[i + 1] = perk_list[perkname].description[i]
    }
    var perkItem = world.createItem(item_id, 1)
    perkItem.nbt.putString("perk_name", perkname)
    perkItem.nbt.setBoolean("isDampener", dampener)
    perkItem.getNbt().setInteger("CustomModelData", perk_ids.indexOf(perkname) + 1)
    perkItem.getNbt().setInteger("HideFlags", 1)
    perkItem.setLore(lore)
    perkItem.setCustomName(color_code + perk_list[perkname].name)


    return perkItem
}


var vertical_space = 23
var selected_good_base_x = 105
var selected_bad_base_x = 135
var selected_good_base_y = 135
var cost_total_y = 233
function createPerkGui(e, editable, init) {
    var good_base_x = 15
    var good_base_y = 135
    var bad_base_x = 225
    var bad_base_y = 135
    player = e.player
    var scale = .09
    guiOpen = true
    selected_powers = JSON.parse(e.player.storeddata.get("selected_powers"))
    collected_powers = JSON.parse(e.player.storeddata.get("collected_powers"))
    selected_dampeners = JSON.parse(e.player.storeddata.get("selected_dampeners"))
    collected_dampeners = JSON.parse(e.player.storeddata.get("collected_dampeners"))
    GUI_STATS.addTexturedRect(id("powers_total_1"), "iob:textures/customgui/numbers.png", selected_good_base_x - 2, cost_total_y, 25, 25, 0, 0).setScale(.5)
    GUI_STATS.addTexturedRect(id("powers_total_2"), "iob:textures/customgui/numbers.png", selected_good_base_x + 7, cost_total_y, 25, 25, 0, 0).setScale(.5)
    GUI_STATS.addTexturedRect(id("dampeners_total_1"), "iob:textures/customgui/numbers.png", selected_bad_base_x - 2, cost_total_y, 25, 25, 0, 0).setScale(.5)
    GUI_STATS.addTexturedRect(id("dampeners_total_2"), "iob:textures/customgui/numbers.png", selected_bad_base_x + 7, cost_total_y, 25, 25, 0, 0).setScale(.5)
    for (var i = 0; i < 20; i++) {
        if (i > 1 && i % 5 == 0) {
            good_base_x += 20
            good_base_y -= 100
        }
        var item = e.player.world.createItem("air", 1)

        if (collected_powers[i] != null && !isPerkSelected(collected_powers[i])) {
            item = good_perk_items[collected_powers[i]].copy()
            if (player.tempdata.get("canEditPerks")) { item.addEnchantment("infinity", 1) }
        }
        GUI_STATS.addItemSlot(good_base_x, good_base_y + (i * 20), item).setGuiType(0)

    }
    for (var i = 0; i < 5; i++) {
        var item = e.player.world.createItem("air", 1)
        if (selected_powers[i] != null) {
            item = good_perk_items[selected_powers[i]].copy()
            if (player.tempdata.get("canEditPerks")) { item.addEnchantment("infinity", 1) }
        }
        GUI_STATS.addItemSlot(selected_good_base_x, selected_good_base_y + (i * 20), item).setGuiType(0)
        //GUI_STATS.addTexturedRect(id("empty_good_slot" + i), "iob:textures/customgui/perks/empty_slot.png", selected_good_base_x - 1, selected_good_base_y + (i * 20) - 1, 256, 256).setScale(0.07)
    }
    for (var b = 0; b < 20; b++) {
        if (b > 1 && b % 5 == 0) {
            bad_base_x -= 20
            bad_base_y -= 100
        }
        var item = e.player.world.createItem("air", 1)
        if (collected_dampeners[b] != null && !isDampenerSelected(collected_dampeners[b])) {
            item = bad_perk_items[collected_dampeners[b]].copy()
            if (player.tempdata.get("canEditPerks")) { item.addEnchantment("infinity", 1) }

        }
        GUI_STATS.addItemSlot(bad_base_x, bad_base_y + (b * 20), item).setGuiType(0)


    }
    for (var b = 0; b < 5; b++) {
        var item = e.player.world.createItem("air", 1)
        if (selected_dampeners[b] != null) {
            item = bad_perk_items[selected_dampeners[b]].copy()
            if (player.tempdata.get("canEditPerks")) { item.addEnchantment("infinity", 1) }
        }
        GUI_STATS.addItemSlot(selected_bad_base_x, selected_good_base_y + (b * 20), item).setGuiType(0)
        //GUI_STATS.addTexturedRect(id("empty_bad_slot" + b), "iob:textures/customgui/perks/empty_slot.png", selected_bad_base_x - 1, selected_good_base_y + (b * 20) - 1, 256, 256).setScale(0.07)
    }

    GUI_STATS.addTexturedRect(id("comparator"), "iob:textures/customgui/comparators.png", selected_good_base_x + 17, 233, 32, 32, 0, 0).setScale(0.4).setHoverText("§6Dampening§f total must be higher than §bpower §ftotal")
    GUI_STATS.update()

    updateSelectedPerks()
}

var currentlyHeldPerk = null

function customGuiSlotClicked(e) {
    e.player.message(e.player.tempdata.get("canEditPerks"))
    if (!e.player.tempdata.get("canEditPerks")) { e.setCanceled(true); return }
    if (e.clickType == "CLONE") { e.setCanceled(true) }
    if (e.slotId >= 0 && e.slotId <= 19) {
        if (currentlyHeldPerk && !currentlyHeldPerk.isEmpty() && currentlyHeldPerk.nbt.getBoolean("isDampener")) {
            e.setCanceled(true)
            return
        }

    }

    if (e.slotId >= 20 && e.slotId <= 24) {
        if (currentlyHeldPerk && !currentlyHeldPerk.isEmpty() && currentlyHeldPerk.nbt.getBoolean("isDampener")) {
            e.setCanceled(true)
            return
        }
        e.player.timers.forceStart(id("updateSelectedPerks"), 1, false)
        if (e.stack.isEmpty()) {
            e.player.playSound("minecraft:item.trident.return", 1, 1)

        }
        else {
            e.player.playSound("minecraft:item.trident.return", .7, .2)
        }
    }

    if (e.slotId >= 25 && e.slotId <= 44) {
        if (currentlyHeldPerk && !currentlyHeldPerk.isEmpty() && !currentlyHeldPerk.nbt.getBoolean("isDampener")) {
            e.setCanceled(true)
            return
        }

    }

    if (e.slotId >= 45 && e.slotId <= 49) {
        if (currentlyHeldPerk && !currentlyHeldPerk.isEmpty() && !currentlyHeldPerk.nbt.getBoolean("isDampener")) {
            e.setCanceled(true)
            return
        }
        if (e.stack.isEmpty()) {
            e.player.playSound("minecraft:item.trident.return", 1, 1)

        }
        else {
            e.player.playSound("minecraft:item.trident.return", .7, .2)
        }
        e.player.timers.forceStart(id("updateSelectedPerks"), 1, false)


    }


    currentlyHeldPerk = e.stack.copy()


}


function updateSelectedPerks() {
    var powers_cost = 0
    var dampeners_cost = 0
    var slots = GUI_STATS.getSlots()
    for (var i = 0; i < 5; i++) {
        if (slots[i + 20].hasStack()) {
            selected_powers[i] = slots[i + 20].getStack().nbt.getString("perk_name")
            powers_cost += good_perks[selected_powers[i]].cost
        }
        else {
            selected_powers[i] = null
        }
        if (slots[i + 45].hasStack()) {
            selected_dampeners[i] = slots[i + 45].getStack().nbt.getString("perk_name")
            dampeners_cost += dampening_perks[selected_dampeners[i]].cost
        }
        else {
            selected_dampeners[i] = null
        }
    }
    player.storeddata.put("selected_powers", JSON.stringify(selected_powers))
    player.storeddata.put("selected_dampeners", JSON.stringify(selected_dampeners))
    player.trigger(200)
    setScore("good_perk_debt", powers_cost)
    setScore("bad_perk_debt", dampeners_cost)
    var dampener_offset, power_offset
    if (getScore("bad_perk_debt") < getScore("good_perk_debt")) {
        GUI_STATS.getComponent(id("comparator")).setTextureOffset(32, 0)
        dampener_offset = 100
        power_offset = 100
    }
    else {
        GUI_STATS.getComponent(id("comparator")).setTextureOffset(0, 0)
        power_offset = 25
        dampener_offset = 50
    }
    if (powers_cost < 10) {
        GUI_STATS.getComponent(id("powers_total_2")).setScale(0)
        GUI_STATS.getComponent(id("powers_total_1")).setTextureOffset(25 * powers_cost, power_offset).setPos(selected_good_base_x + 2, cost_total_y)
    }
    else {
        GUI_STATS.getComponent(id("powers_total_2")).setScale(.5).setTextureOffset(25 * parseInt(powers_cost.toString()[1]), power_offset).setPos(selected_good_base_x + 7, cost_total_y)
        GUI_STATS.getComponent(id("powers_total_1")).setTextureOffset(25 * parseInt(powers_cost.toString()[0]), power_offset).setPos(selected_good_base_x - 2, cost_total_y)
    }
    if (dampeners_cost < 10) {
        GUI_STATS.getComponent(id("dampeners_total_2")).setScale(0)
        GUI_STATS.getComponent(id("dampeners_total_1")).setTextureOffset(25 * dampeners_cost, dampener_offset).setPos(selected_bad_base_x + 2, cost_total_y)
    }
    else {
        GUI_STATS.getComponent(id("dampeners_total_2")).setScale(.5).setTextureOffset(25 * parseInt(dampeners_cost.toString()[1]), dampener_offset).setPos(selected_bad_base_x + 7, cost_total_y)
        GUI_STATS.getComponent(id("dampeners_total_1")).setTextureOffset(25 * parseInt(dampeners_cost.toString()[0]), dampener_offset).setPos(selected_bad_base_x - 2, cost_total_y)
    }



    GUI_STATS.update()

}




function isPerkSelected(perkname) {

    for (var j = 0; j < 5; j++) {
        if (selected_powers[j] == perkname) {

            return true
        }
    }
    return false
}

function isDampenerSelected(perkname) {
    for (var j = 0; j < 5; j++) {
        if (selected_dampeners[j] == perkname) {

            return true
        }
    }
    return false
}

var isSlotSelected

function preventPerkToss(e) {
    var start = 0
    var range = 20
    if (e.player.getCustomGui()) {
        e.setCanceled(true)
        if (e.item.nbt.getBoolean("isDampener")) { start = 25; range = 44 }
        for (var i = start; i < range; i++) {
            if (!GUI_STATS.getSlots()[i].hasStack()) {
                GUI_STATS.getSlots()[i].setStack(e.item)
                GUI_STATS.update()
                currentlyHeldPerk = null
                break
            }
        }

    }


}