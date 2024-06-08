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
    switch (e.option.slot) {
        case 0:
            player = e.player
            e.npc.timers.start(1, 1, false)
            break;
        case 1:
            e.player.trigger(5, [e])
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