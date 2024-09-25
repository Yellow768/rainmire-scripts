var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/boiler/commonFunctions.js')
load(api.getLevelDir() + '/scripts/ecmascript/player/attributes/perks/perks.js')
load(api.getLevelDir() + '/scripts/ecmascript/npcs/functional/remnant/perk_purchasing_functions.js')
load(api.getLevelDir() + '/scripts/ecmascript/npcs/functional/remnant/respawn_point_functions.js')
load(api.getLevelDir() + '/scripts/ecmascript/boiler/id_generator.js')

var npc, player, API
function init(e) {
    initializeRespawnPointData(e)
    initalizePerksData(e)

    npc = e.npc
    API = e.API
}


function interact(e) {
    player = e.player
    if (e.player.gamemode == 1 && e.player.isSneaking()) {
        e.setCanceled(true)
        openPerkEditorGUI()
        return
    }


}

function timer(e) {
    if (e.id == 1) {
        openPerkPurchasingGUI(true)
    }
    if (e.id == 2) {
        openRespawnPointEditorGUI()
    }
    if (e.id == 3) {
        openPerkEditorGUI()
    }

}

function damaged(e) {
    e.setCanceled(true)
}

function dialog(e) {
    addRemnantToRespawnArray(e.player)
}

function dialogOption(e) {
    if (!(e.dialog.id == 12 || e.dialog.id == 174)) return
    switch (e.option.slot) {
        case 0:
            player = e.player
            e.npc.timers.start(1, 1, false)
            break;
        case 1:
            e.player.trigger(id("force_open_stats_screen"), [e])
            break;
        case 2:
            toggleRespawnAnchor(e)
            break;

    }
}

function customGuiClosed(e) {
    if (e.player.getCustomGui() == perkEditorGUI) { savePerkData() }
}

function customGuiButton(e) {
    if (e.buttonId == 180) {

        if (e.player.getCustomGui().getID() == 2) { e.player.closeGui(); npc.timers.start(2, 1, false); return }
        else if (e.player.getCustomGui().getID() == 3) { e.player.closeGui(); e.player.message("oi"); npc.timers.start(3, 1, false); return }

        return
    }
    switch (e.player.getCustomGui()) {
        case respawnPointEditorGUI:
            respawnPointEditorGuiButton(e)
            break;
        case perkEditorGUI:
            perkEditorGuiButton(e)
            break;
        case aquaticUpgradePurchasingGUI:
            perkPurchasingGuiButton(e)
            break;
    }

}