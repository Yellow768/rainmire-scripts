function toss(e) {
    if (e.player.tempdata.has("disableToss")) {
        e.setCanceled(true)
    }
    if (e.player.tempdata.has("remnantNPC")) {
        e.setCanceled(true)
        var npc = e.player.tempdata.get("remnantNPC")
        e.player.tempdata.remove("remnantNPC")
        npc.trigger(1, [e.item])
        e.player.tempdata.put("disableToss", true)
    }
}