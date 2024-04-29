function init(e) {
    e.npc.display.setTint(Math.floor(Math.random() * 16777215))
    e.npc.ai.setInteractWithNPCs(false)
    e.npc.setMaxHealth(4)
}

function target(e) {
    e.npc.ai.setWalkingSpeed(5)
}

function targetLost(e) {
    e.npc.ai.setWalkingSpeed(2)
}