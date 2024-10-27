function dialog(e) {
    e.player.timers.stop(767005)
}

function dialogOption(e) {
    if (e.option.getType() != 0) return
    reset_npc_in_dialog(e)
}

function reset_npc_in_dialog(e) {
    if (e.player.tempdata.has("npc_in_dialog")) {
        var npc = e.player.tempdata.get("npc_in_dialog")
        if (npc.storeddata.has("moving_type")) {
            npc.ai.setMovingType(npc.storeddata.get("moving_type"))
            npc.storeddata.remove("moving_type")
            npc.setHome(npc.storeddata.get("hx"), npc.storeddata.get("hy"), npc.storeddata.get("hz"))
            npc.ai.setStandingType(npc.storeddata.get("rot_type"))
            npc.storeddata.remove("in_dialog")
            e.player.message("ended")
        }
    }
}

function timer(e) {
    if (e.di == 767005) {
        reset_npc_in_dialog(e)
    }
}

function dialogClose(e) {
    e.player.timers.forceStart(767005, 10, false)
}