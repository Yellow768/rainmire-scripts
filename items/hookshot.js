var hookTarget
var usingHookshot = false

function interact(e) {
    if (e.player.getMainhandItem().getDisplayName() == "Hookshot") {
        usingHookshot = true
        e.player.timers.forceStart(900, 1, false)
    }
}



function damagedEntity(e) {
    if (e.damageSource.isProjectile() && usingHookshot == true) {
        e.setCanceled(true)
        e.target.knockback(1, e.target.rotation)
        e.target.x += 1.2
        e.target.z += 1.2
        e.player.timers.start(12345, 10, false)
        e.player.timers.start(12346, 12, false)
        hookTarget = e.target
        usingHookshot = false

    }
}

function timer(e) {
    if (e.id == 12345) {
        var distance = Math.abs((Math.abs(hookTarget.x) - Math.abs(e.player.x)) + (Math.abs(hookTarget.z) - Math.abs(e.player.z))) - 7
        var vertical_distance = .5 + (e.player.y - hookTarget.y)
        if (vertical_distance > 1.2) {
            vertical_distance = 1.2
        }
        if (distance > 15) {
            distance = 15
        }
        if (distance < 5) {
            distance = 5
        }
        if (hookTarget.inWater()) {
            vertical_distance /= 2
            distance += 2
        }
        distance -= vertical_distance
        DoKnockback(e.player, hookTarget, -distance / 3, vertical_distance)

        //hookTarget.setMotionY(vertical_distance)

        //(world, source, resolution, particleName, sourcePos, targetPos)
    }
    if (e.id == 12346) {
        var s = hookTarget //particle from this target
        var t = e.player //particle to this target
        e.player.world.playSoundAt(e.player.pos, "variedcommodities:misc.swosh", 1, 1)
        e.player.world.playSoundAt(e.player.pos, "minecraft:entity.mooshroom.suspicious_milk", 1, 1)
        e.player.world.playSoundAt(e.player.pos, "create:fwoomp", .2, .5)

        particleLine(e.player.getWorld(), hookTarget, 20, "alexsmobs:smelly", s.x, s.y, s.z, t.x, t.y, t.z) //s.pos and t.pos can be replace by any position you want
    }
}

function particleLine(world, source, resolution, particle, sx, sy, sz, tx, ty, tz) {
    var ex = (sx - tx) / resolution
    var ey = (sy - ty) / resolution
    var ez = (sz - tz) / resolution
    for (var i = 0; i < resolution; i++) {
        source.world.spawnParticle("" + particle + "", source.x - (ex * i), 1.3 + source.y - (ey * i), source.z - (ez * i), 0, 0, 0, .01, 1)
    }
}

