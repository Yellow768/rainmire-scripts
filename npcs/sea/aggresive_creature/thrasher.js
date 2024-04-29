function meleeAttack(e) {
    e.npc.ai.setWalkingSpeed(0)
    e.npc.timers.start(5, 5, false)
}

function timer(e) {
    e.npc.ai.setWalkingSpeed(7)
}