function init(e) {
    e.npc.timers.stop(10)
    e.npc.timers.stop(11)
    e.npc.timers.stop(20)
    e.npc.timers.forceStart(30, getRandomInt(20, 180), false)
}


var attack_target

function target(e) {
    if (e.entity == null) return
    e.npc.timers.forceStart(9, 0, true)
    attack_target = e.entity
    e.npc.timers.forceStart(10, getRandomInt(20, 80), false)
}

function targetLost(e) {

    stopAttacking(e)

}
function died(e) {
    stopAttacking(e)
}

function stopAttacking(e) {
    e.npc.timers.stop(10)
    e.npc.timers.stop(11)
    e.npc.timers.stop(20)
    e.npc.timers.stop(30)
    attack_target = null
    e.npc.removeTag("charging")
}

var forward
var y_position = 0

var forward_rotation



function damaged(e) {
    e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.hoglin.hurt", 1, getRandomFloat(.2, .5))
    e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.drowned.hurt", 1, getRandomFloat(.1, .3))

}

function timer(e) {
    if (e.npc.storeddata.get("hasStatusEffect") == 1) return
    if (e.id == 30) {
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.hoglin.ambient", 1, getRandomFloat(.1, .2))
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.drowned.ambient_water", 1, getRandomFloat(.1, .3))
        e.npc.timers.forceStart(30, getRandomInt(20, 180), false)
    }
    if (e.id == 9) {
        if (attack_target == null) {
            e.npc.timers.stop(9)
            return
        }
        forward_rotation = e.npc.getPos().subtract(attack_target.getPos()).normalize();
        e.npc.getMCEntity().m_5616_((Math.atan2(forward_rotation[2], forward_rotation[0]) * 180 / Math.PI) + 90);
        e.npc.updateClient()
    }
    if (e.id == 10) {
        e.npc.timers.stop(9)
        e.npc.ai.setStandingType(1)
        e.npc.timers.forceStart(20, 15, false)
        e.npc.timers.forceStart(11, 0, true)

        forward_rotation = e.npc.getPos().subtract(attack_target.getPos()).normalize();
        e.npc.getMCEntity().m_5616_((Math.atan2(forward_rotation[2], forward_rotation[0]) * 180 / Math.PI) + 90)
        forward = FrontVectors(e.npc, e.npc.rotation, e.npc.pitch, 1, 0)
        e.npc.updateClient()
        if (attack_target.y > e.npc.y) {
            y_position = .1
        }
        if (attack_target.y < e.npc.y) {
            y_position = -.1
        }

        e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.hoglin.attack", 1, .5)
        e.npc.world.playSoundAt(e.npc.pos, "customnpcs:magic.shot", 1, .2)
        e.npc.addTag("charging")
        e.npc.stats.melee.setStrength(6)

    }
    if (e.id == 11) {
        if (e.npc.world.getBlock(e.npc.pos.subtract(forward_rotation[0] + 1, .2, forward_rotation[2] + 1)).name.indexOf("water") != -1
            && e.npc.world.getBlock(e.npc.pos.subtract(forward_rotation[0], .2, forward_rotation[2])).name.indexOf("water") != -1) {
            e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.hostile.swim", .2, .2)
            e.npc.x += forward[0]
            e.npc.z += forward[2]
            if (e.npc.world.getBlock(e.npc.pos.add(0, -1, 0)).name.indexOf("water") != -1 && e.npc.world.getBlock(e.npc.pos.add(0, (y_position * 5), 0)).name.indexOf("water") != -1 && e.npc.world.getBlock(e.npc.pos.add(0, 1 + (y_position * 5), 0)).name.indexOf("water") != -1) {
                e.npc.y += y_position * 2
            }
            var particle_behind = FrontVectors(e.npc, e.npc.rotation, e.npc.pitch, -4, 0)
            e.npc.getMCEntity().m_5616_((Math.atan2(forward_rotation[2], forward_rotation[0]) * 180 / Math.PI) + 90)
            e.npc.updateClient()
            e.npc.world.spawnParticle("poof", e.npc.x + particle_behind[0], e.npc.y - particle_behind[1] / 2, e.npc.z + particle_behind[2], .2, .2, .2, 0, 40)
        }
    }
    if (e.id == 20) {
        e.npc.timers.forceStart(9, 0, true)
        e.npc.removeTag("charging")
        e.npc.ai.setStandingType(1)
        e.npc.timers.forceStart(10, getRandomInt(30, 80), false)
        e.npc.timers.stop(11)
        var directionVector = e.npc.getPos().subtract(attack_target.getPos()).normalize();
        e.npc.setRotation(Math.atan2((directionVector[2], directionVector[0]) * 180 / Math.PI) + 90);
        e.npc.updateClient()
        e.npc.stats.melee.setStrength(0)
    }
}