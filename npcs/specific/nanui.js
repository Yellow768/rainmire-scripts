function dialog(e) {
    if (e.dialog.id == 634 || e.dialog.id == 637 || e.dialog.id == 638) {
        e.npc.storeddata.put("hx", 854)
        e.npc.storeddata.put("hy", 81)
        e.npc.storeddata.put("hz", 1249)
        e.npc.storeddata.put("moving_type", 1)
        e.npc.storeddata.put("rot_type", 0)
        e.npc.navigateTo(854, 81, 1249, 1)
        e.npc.setHome(854, 81, 1249)
    }
}

function interact(e) {
    if (e.player.gamemode == 1 && e.player.isSneaking()) {
        e.setCanceled(true)
        e.npc.setHome(831, 76, 1218)
        e.npc.ai.setStandingType(1)
        e.npc.rotation = 180
        e.npc.ai.setMovingType(0)
    }
}

