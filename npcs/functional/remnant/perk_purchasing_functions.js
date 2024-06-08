var perk1_id, perk2_id, perk3_id, npc, perkEditorGUI, aquaticUpgradePurchasingGUI, collected_dampeners, collected_powers, available_perks
var playerName, type


function initalizePerksData(e) {
    if (!e.npc.storeddata.has("perk1ID")) {
        e.npc.storeddata.put("perk1ID", "")
        e.npc.storeddata.put("perk2ID", "")
        e.npc.storeddata.put("perk3ID", "")
        e.npc.storeddata.put("type", "good")
    }
    perk1_id = e.npc.storeddata.get("perk1ID")
    perk2_id = e.npc.storeddata.get("perk2ID")
    perk3_id = e.npc.storeddata.get("perk3ID")
    type = e.npc.storeddata.get("type")
    e.npc.timers.stop(1)
    available_perks = []
}



function openPerkEditorGUI(e) {
    perkEditorGUI = API.createCustomGui(2, 256, 256, false, player)
    var id_1_text = perkEditorGUI.addTextField(1, 50, 50, 150, 18)
    var id_2_text = perkEditorGUI.addTextField(2, 50, 90, 150, 18)
    var id_3_text = perkEditorGUI.addTextField(3, 50, 130, 150, 18)
    id_1_text.setText(perk1_id)
    id_2_text.setText(perk2_id)
    id_3_text.setText(perk3_id)
    perkEditorGUI.addLabel(4, "Perk 1 ID", 0, 55, 1, 1, 16777215)
    perkEditorGUI.addLabel(5, "Perk 2 ID", 0, 95, 1, 1, 16777215)
    perkEditorGUI.addLabel(6, "Perk 3 ID", 0, 135, 1, 1, 16777215)
    perkEditorGUI.addButton(7, type, 50, 190, 50, 20)
    perkEditorGUI.addButton(180, "Respawn Point", 160, 20, 100, 20)
    player.showCustomGui(perkEditorGUI)
}


function perkEditorGuiButton(e) {
    if (e.buttonId == 7) {
        switch (type) {
            case "good":
                type = "dampening"
                break;
            case "dampening":
                type = "good"
                break;
            default:
                type = "good"
                break;

        }
        npc.storeddata.put("type", type)
        perkEditorGUI.getComponent(7).setLabel(type)
        perkEditorGUI.update()
    }
}






function openPerkPurchasingGUI(init) {
    if (init) {
        player.playSound("minecraft:block.enchantment_table.use", 1, .4)
        player.playSound("minecraft:item.trident.return", 1, .4)
    }
    var color
    switch (type) {
        case "good":
            color = "§b"
            break;
        case "dampening":
            color = "§6"
            break;
    }
    aquaticUpgradePurchasingGUI = API.createCustomGui(1, 256, 256, false, player)
    collected_powers = JSON.parse(player.storeddata.get("collected_powers"))
    collected_dampeners = JSON.parse(player.storeddata.get("collected_dampeners"))
    var starting_x_position = 60
    available_perks = []
    if (npc.storeddata.get("perk1ID") != "" && collected_powers.indexOf(perk1_id) == -1 && collected_dampeners.indexOf(perk1_id) == -1) available_perks.push(perk1_id);
    if (npc.storeddata.get("perk2ID") != "" && collected_powers.indexOf(perk2_id) == -1 && collected_dampeners.indexOf(perk2_id) == -1) { available_perks.push(perk2_id); }
    if (npc.storeddata.get("perk3ID") != "" && collected_powers.indexOf(perk3_id) == -1 && collected_dampeners.indexOf(perk3_id) == -1) { available_perks.push(perk3_id); }
    switch (available_perks.length) {
        case 0:
            player.message(color + "You have exhausted this Remnant")
            player.playSound("minecraft:entity.elder_guardian.hurt", 1, 1)
            player.closeGui()
            return;
        case 1:
            starting_x_position = 55
            break;
        case 2:
            starting_x_position = -10
            break;
        case 3:
            starting_x_position = -80
            break;
    }
    if (highlighted_perk != -1) {
        for (var j = 0; j < eval(type + "_perks." + available_perks[highlighted_perk] + ".description").length; j++) {
            aquaticUpgradePurchasingGUI.addLabel(id("perk_desc" + j), eval(type + "_perks." + available_perks[highlighted_perk] + ".description")[j], 86, 150 + (j * 10), 90, 1).setCentered(true)
        }

    }
    for (var i = 0; i < available_perks.length; i++) {
        var x_offset = 0
        if (highlighted_perk == i) { x_offset = 125 }
        aquaticUpgradePurchasingGUI.addTexturedButton(i, "", starting_x_position + (i * 140), 0, 125, 128, "iob:textures/customgui/perks/" + type + "/cards/" + available_perks[i] + ".png", x_offset, 0)
        aquaticUpgradePurchasingGUI.addLabel(id("perk_name" + i), color + eval(type + "_perks." + available_perks[i] + ".name"), (22 + starting_x_position) + (i * 140), 135, 90, 1).setCentered(true)
        //.setHoverText(color + eval(type + "_perks." + available_perks[i] + ".name") + "§r | " + eval(type + "_perks." + available_perks[i] + ".description"))
    }



    aquaticUpgradePurchasingGUI.addTexturedRect(5, "aquamirae:textures/item/esca.png", 250, 185, 256, 256).setScale(.15)
    aquaticUpgradePurchasingGUI.addLabel(6, "x" + player.getInventory().count(player.world.createItem("aquamirae:esca", 1), true, true), 230, 180, 1, 1, 16777215).setScale(1.2)
    aquaticUpgradePurchasingGUI.addButton(id("purchasePerk"), "Absorb", 20, 210, 200, 20).setOnPress(function (gui, t) { absorbPerk(available_perks[highlighted_perk]) }).setEnabled(highlighted_perk != -1 && player.getInventory().count(player.world.createItem("aquamirae:esca", 1), true, true))
    aquaticUpgradePurchasingGUI.addButton(4, "Cancel", 20, 230, 200, 20).setOnPress(function (gui, t) { player.closeGui(); highlighted_perk = -1 })
    player.showCustomGui(aquaticUpgradePurchasingGUI)

}

var highlighted_perk = -1


function perkPurchasingGuiButton(e) {
    if (e.buttonId >= 0 && e.buttonId <= 2) {
        if (highlighted_perk == e.buttonId) {
            highlighted_perk = -1
        }
        else {
            highlighted_perk = e.buttonId
        }
        openPerkPurchasingGUI(false)
    }

}

function absorbPerk(perkname) {
    var color
    switch (type) {
        case "good":
            color = "aqua"
            break;
        case "dampening":
            color = "gold"
            break;
    }

    npc.executeCommand('/title ' + player.name + ' actionbar ["",{"text":"You have gained ","underlined":false,"color":"light_purple"},{"text":"' + eval(type + "_perks." + available_perks[highlighted_perk] + ".name") + '","bold":true,"underlined":true,"color":"' + color + '"}]')
    npc.timers.start(1, 0, false)
    player.playSound("minecraft:block.respawn_anchor.charge", 1, 1)
    player.playSound("minecraft:block.respawn_anchor.set_spawn", 1, 1)
    player.removeItem("aquamirae:esca", 1)
    highlighted_perk = -1
    if (type == "good") player.trigger(210, perkname)
    if (type == "dampening") player.trigger(220, perkname)

}


function savePerkData() {
    npc.storeddata.put("perk1ID", perkEditorGUI.getComponent(1).getText())
    npc.storeddata.put("perk2ID", perkEditorGUI.getComponent(2).getText())
    npc.storeddata.put("perk3ID", perkEditorGUI.getComponent(3).getText())
    perk1_id = npc.storeddata.get("perk1ID")
    perk2_id = npc.storeddata.get("perk2ID")
    perk3_id = npc.storeddata.get("perk3ID")
}