var rad, theta, d

function interact(e) {
    rad = Math.PI / 180
    theta = -e.npc.getRotation() * rad


    if (e.npc.timers.has(1)) {
        e.npc.timers.stop(1)
    }
    else {
        e.npc.timers.start(2, 2, false)
    }


}

var i = 0
function timer(e) {
    if (e.id == 2) {
        e.npc.reset()
        e.npc.timers.start(1, 0, true)
        d = frontVectors(e.npc, e.npc.rotation, 0, .02, 0);
        return
    }
    i += 40
    e.npc.setAttackTarget(null)
    e.npc.rotation = i
    e.npc.setMotionX(d[0])
    e.npc.setMotionZ(d[2])

}




function frontVectors(entity, dr, dp, distance, mode) {
    if (!mode) mode = 0
    if (mode == 1) { var angle = dr + entity.getRotation(); var pitch = (-entity.getPitch() + dp) * Math.PI / 180; if (dp == 0) pitch = 0; }
    if (mode == 0) { var angle = dr; var pitch = (dp) * Math.PI / 180 }
    var dx = -Math.sin(angle * Math.PI / 180) * (distance * Math.cos(pitch))
    var dy = Math.sin(pitch) * distance
    var dz = Math.cos(angle * Math.PI / 180) * (distance * Math.cos(pitch))
    return [dx, dy, dz]
}

