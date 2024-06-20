var boat, direction, rot

function init(e) {
    e.npc.timers.forceStart(1, getRandomInt(20, 400), false)
}

function tick(e) {
    boat = e.npc.getMount()
    if (e.npc.getAttackTarget() != null && boat != null && e.npc.getAttackTarget().pos.distanceTo(e.npc.pos) > 2.3) {
        var angle = GetAngleTowardsEntity(boat, e.npc.getAttackTarget())
        var d = FrontVectors(boat, angle, 0, 1, 0)
        boat.setMotionX(d[0])
        boat.setMotionZ(d[2])
        boat.rotation = angle

    }
    if (e.npc.getAttackTarget() == null && boat != null && direction != null) {
        boat.setMotionX(direction[0])
        boat.setMotionZ(direction[2])
        boat.rotation = rot - 110
    }
}

function timer(e) {
    var chance = getRandomFloat(0, 100)
    if (chance > 50) {
        direction = null
    }
    else {
        rot = getRandomInt(0, 360)
        direction = FrontVectors(e.npc, rot, 0, .15, 0)
    }
    e.npc.timers.forceStart(1, getRandomInt(20, 180), false)
}

function GetAngleTowardsEntity(npc, player) {
    var dx = npc.getX() - player.getX();
    var dz = player.getZ() - npc.getZ();
    if (dz >= 0) {
        var angle = (Math.atan(dx / dz) * 180 / Math.PI);
        if (angle < 0) {
            angle = 360 + angle;
        }
    }
    if (dz < 0) {
        dz = -dz;
        var angle = 180 - (Math.atan(dx / dz) * 180 / Math.PI);
    }
    return angle;
}

function FrontVectors(entity, dr, dp, distance, mode) {
    if (!mode) mode = 0
    if (mode == 1) { var angle = dr + entity.getRotation(); var pitch = (-entity.getPitch() + dp) * Math.PI / 180 }
    if (mode == 0) { var angle = dr; var pitch = (dp) * Math.PI / 180 }
    var dx = -Math.sin(angle * Math.PI / 180) * (distance * Math.cos(pitch))
    var dy = Math.sin(pitch) * distance
    var dz = Math.cos(angle * Math.PI / 180) * (distance * Math.cos(pitch))
    return [dx, dy, dz]
}