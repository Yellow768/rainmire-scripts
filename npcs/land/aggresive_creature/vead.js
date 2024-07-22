function meleeAttack(e) {
    e.npc.updateClient()
    e.npc.executeCommand("/particle minecraft:campfire_signal_smoke ~ ~.2 ~ .7 .7 .7 0.1 200")
    e.npc.world.explode(e.npc.x, e.npc.y, e.npc.z, 2, false, false)
    e.npc.kill()
}