
var perk1_id, perk2_id, perk3_id, npc, setterGUI, API, collected_bad_perk_array, collected_perk_array, available_perks
var playerName, type, player


function perk_init(e) {
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
    npc = e.npc
    e.npc.timers.stop(1)
    API = e.API
    available_perks = []
}

function interact(e) {
    //addRemnantToRespawnArray(e)
    npc = e.npc
    if (e.player.gamemode == 1 && e.player.isSneaking()) {
        e.setCanceled(true)
        createPerkSetterGUI(e)
        return
    }
    //e.player.showDialog(12, "")

}

function createPerkSetterGUI(e) {
    setterGUI = e.API.createCustomGui(12, 256, 256, false, e.player)
    var id_1_text = setterGUI.addTextField(1, 50, 50, 150, 18)
    var id_2_text = setterGUI.addTextField(2, 50, 90, 150, 18)
    var id_3_text = setterGUI.addTextField(3, 50, 130, 150, 18)
    id_1_text.setText(perk1_id)
    id_2_text.setText(perk2_id)
    id_3_text.setText(perk3_id)
    setterGUI.addLabel(4, "Perk 1 ID", 0, 55, 1, 1, 16777215)
    setterGUI.addLabel(5, "Perk 2 ID", 0, 95, 1, 1, 16777215)
    setterGUI.addLabel(6, "Perk 3 ID", 0, 135, 1, 1, 16777215)
    setterGUI.addButton(7, type, 50, 190, 50, 20)
    e.player.showCustomGui(setterGUI)
}
function perk_customGuiButton(e) {
    if (e.player.getCustomGui() == AQUA_GUI) {
        if (e.buttonId >= 0 && e.buttonId <= 2) {
            var color
            switch (type) {
                case "good":
                    color = "aqua"
                    break;
                case "dampening":
                    color = "gold"
                    break;
            }
            if (type == "good") player.trigger(210, available_perks[e.buttonId])
            if (type == "dampening") player.trigger(220, available_perks[e.buttonId])
            npc.executeCommand('/title ' + player.name + ' actionbar ["",{"text":"You have gained ","underlined":true,"color":"light_purple"},{"text":"' + eval(type + "_perks." + available_perks[e.buttonId] + ".name") + '","bold":true,"underlined":true,"color":"' + color + '"}]')
            player.closeGui()
            npc.timers.start(1, 0, false)
            player.playSound("minecraft:block.respawn_anchor.charge", 1, 1)
            player.playSound("minecraft:block.respawn_anchor.set_spawn", 1, 1)
            player.removeItem("aquamirae:esca", 1)

        }
    }
    if (e.player.getCustomGui() == setterGUI) {
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
            setterGUI.getComponent(7).setLabel(type)
            setterGUI.update()
        }
    }

}

function customGuiClosed(e) {
    if (e.player.getCustomGui() != setterGUI) { return }
    npc.storeddata.put("perk1ID", setterGUI.getComponent(1).getText())
    npc.storeddata.put("perk2ID", setterGUI.getComponent(2).getText())
    npc.storeddata.put("perk3ID", setterGUI.getComponent(3).getText())
    perk1_id = npc.storeddata.get("perk1ID")
    perk2_id = npc.storeddata.get("perk2ID")
    perk3_id = npc.storeddata.get("perk3ID")
}

function dialogOption(e) {
    switch (e.option.slot) {
        case 0:
            player = e.player
            e.npc.timers.start(1, 1, false)
            break;
        case 1:
            e.player.trigger(5, [e])
            break;

    }
}

function timer(e) {
    openPerkPurchasingGUI()
}
var AQUA_GUI
function openPerkPurchasingGUI() {
    var color
    switch (type) {
        case "good":
            color = "§b"
            break;
        case "dampening":
            color = "§6"
            break;
    }
    AQUA_GUI = API.createCustomGui(10, 256, 256, false, player)
    collected_perk_array = JSON.parse(player.storeddata.get("collected_perk_array"))
    collected_bad_perk_array = JSON.parse(player.storeddata.get("collected_bad_perk_array"))
    var starting_x_position = 60
    available_perks = []
    if (npc.storeddata.get("perk1ID") != "" && collected_perk_array.indexOf(perk1_id) == -1 && collected_bad_perk_array.indexOf(perk1_id) == -1) available_perks.push(perk1_id);
    if (npc.storeddata.get("perk2ID") != "" && collected_perk_array.indexOf(perk2_id) == -1 && collected_bad_perk_array.indexOf(perk2_id) == -1) { available_perks.push(perk2_id); }
    if (npc.storeddata.get("perk3ID") != "" && collected_perk_array.indexOf(perk3_id) == -1 && collected_bad_perk_array.indexOf(perk3_id) == -1) { available_perks.push(perk3_id); }
    switch (available_perks.length) {
        case 0:
            player.message(color + "You have exhausted this Remnant")
            player.playSound("minecraft:entity.elder_guardian.hurt", 1, 1)
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
    for (var i = 0; i < available_perks.length; i++) {
        AQUA_GUI.addTexturedButton(i, "", starting_x_position + (i * 140), 10, 125, 128, "iob:textures/customgui/perks/" + type + "/cards/" + available_perks[i] + ".png", 0, 0)
            .setHoverText(color + eval(type + "_perks." + available_perks[i] + ".name") + "§r | " + eval(type + "_perks." + available_perks[i] + ".description"))
            .setEnabled(player.getInventory().count(player.world.createItem("aquamirae:esca", 1), true, true))
    }

    player.playSound("minecraft:block.enchantment_table.use", 1, .4)
    player.playSound("minecraft:item.trident.return", 1, .4)
    AQUA_GUI.addTexturedRect(5, "aquamirae:textures/item/esca.png", 250, 185, 256, 256).setScale(.15)
    AQUA_GUI.addLabel(6, "x" + player.getInventory().count(player.world.createItem("aquamirae:esca", 1), true, true), 230, 180, 1, 1, 16777215).setScale(1.2)
    AQUA_GUI.addButton(4, "Cancel", 20, 200, 200, 20).setOnPress(function (gui, t) { player.closeGui() })
    player.showCustomGui(AQUA_GUI)

}





function addRemnantToRespawnArray(e) {
    var respawnArray = []
    if (e.player.storeddata.has("respawnArray")) {
        respawnArray = JSON.parse(e.player.storeddata.get("respawnArray"))
    }
    var location = {
        x: parseInt(nX),
        y: parseInt(nY),
        z: parseInt(nZ)
    }
    if (respawnArray.indexOf(location) == -1) {
        respawnArray.push(location)
        respawnArray = JSON.stringify(respawnArray)
        e.player.storeddata.put("respawnArray", respawnArray)
    }
}
