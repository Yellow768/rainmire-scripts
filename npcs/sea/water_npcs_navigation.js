function tick(e) {
    if (e.npc.ai.getNavigationType() != 1) {
        if (e.npc.inWater()) {
            e.npc.ai.setNavigationType(2)
        }
        else {
            e.npc.ai.setNavigationType(0)
        }
    }
}
