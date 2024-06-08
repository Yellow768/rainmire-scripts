function init(e) {
    e.npc.timers.forceStart(1, 30, false)
    e.npc.display.setVisible(0)
    e.npc.updateClient()
}

function timer(e) {
    e.npc.display.setVisible(1)
    e.npc.updateClient()
    e.npc.despawn()
}

function tick(e) {
    if (!e.npc.inWater()) {
        e.npc.despawn()
    }
}

function collide(e) {
    if (e.entity.name != "Prongfish" && e.entity.name != "Prong Projectile") {
        e.entity.damage(1)
        e.npc.despawn()
    }
}

function interact(e) {
    var d = FrontVectors(e.npc, e.npc.rotation, 0, .2, 0)
    e.npc.setMotionX(d[0])
    e.npc.setMotionZ(d[2])
}



