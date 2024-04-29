var defaultSize = 6
function init(e) {
    e.npc.timers.stop(1)
    e.npc.timers.stop(2)
    e.npc.timers.stop(3)
    e.npc.timers.stop(4)
    e.npc.timers.stop(5)
    e.npc.timers.stop(6)
    e.npc.display.setSize(defaultSize)
    e.npc.ai.setWalkingSpeed(6)
    e.npc.updateClient()
    e.npc.timers.forceStart(1, 5, true)
    e.npc.timers.forceStart(2, 0, true)
    e.npc.timers.forceStart(7, getRandomInt(20, 40), false)
}

function undoStatusEffects(e) {
    e.npc.display.setSize(defaultSize)
    e.npc.ai.setWalkingSpeed(6)
    e.npc.updateClient()
    e.npc.timers.forceStart(1, 5, true)
    e.npc.timers.forceStart(2, 0, true)
    e.npc.timers.forceStart(7, getRandomInt(20, 40), false)
}

function timer(e) {
    if (e.npc.storeddata.get("hasStatusEffect") == 1) return
    var d = FrontVectors(e.npc, e.npc.rotation, 0, 1, 0)
    var block_pos = e.npc.pos.subtract(d[0], -d[1], d[2])
    if (e.id == 1) {
        e.npc.executeCommand('/summon area_effect_cloud ' + block_pos.x + ' ' + block_pos.y + ' ' + block_pos.z + ' {Particle:"dust 0.5 0.78 0.12 1",Potion:awkward,Radius:.6,Duration:100,Effects:[{Id:2,Duration:60,Amplifier:4,ShowParticles:0b}],HasVisualFire:1b}')

    }
    if (e.id == 2) {
        e.npc.world.spawnParticle("upgrade_aquatic:green_jelly_blob", block_pos.x + .5, block_pos.y, block_pos.z + .5, .1, .1, .1, 0, 1)
    }
    if (e.id == 3) {
        if (e.npc.getAttackTarget() == null) return
        e.npc.ai.setWalkingSpeed(0)
        e.npc.ai.setRetaliateType(3)
        e.npc.timers.start(4, 20, true)
        e.npc.timers.start(5, 60, false)
        e.npc.timers.start(6, 0, true)
        e.npc.timers.stop(7)
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.silverfish.death", 1, .5)
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.spider.death", 1, .2)
    }
    if (e.id == 4) {
        e.npc.display.setSize(e.npc.display.getSize() + 2)
        e.npc.updateClient()
        e.npc.timers.start(10, 1, false)
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.puffer_fish.blow_out", 1, .5)
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:item.honey_bottle.drink", 1, .5)

        e.npc.updateClient()
    }
    if (e.id == 10) {
        e.npc.display.setSize(e.npc.display.getSize() - 1)
        e.npc.updateClient()
        e.npc.timers.start(11, 1, false)
    }
    if (e.id == 11) {
        e.npc.display.setSize(e.npc.display.getSize() + 1)
        e.npc.updateClient()
        e.npc.timers.start(12, 0, false)
    }
    if (e.id == 12) {
        e.npc.display.setSize(e.npc.display.getSize() - 1)
        e.npc.updateClient()
        e.npc.timers.start(13, 0, false)
    }
    if (e.id == 13) {

        e.npc.display.setSize(e.npc.display.getSize() + 1)
        e.npc.updateClient()
    }
    if (e.id == 5) {
        e.npc.ai.setRetaliateType(0)
        e.npc.timers.stop(4)
        e.npc.timers.stop(6)
        e.npc.timers.forceStart(7, getRandomInt(20, 60), false)
        e.npc.executeCommand('/summon area_effect_cloud ~ ~ ~ {Particle:"dust 0.5 0.78 0.12 1",Potion:empty,Radius:4,RadiusPerTick:0,Duration:100,Effects:[{Id:2,Duration:20,Amplifier:4,ShowParticles:0b}],Rotation:[0f,12f]}')
        e.npc.world.spawnParticle("upgrade_aquatic:green_jelly_blob", block_pos.x + .5, block_pos.y, block_pos.z + .5, 3, .1, 3, 0, 40)
        e.npc.display.setSize(defaultSize)
        e.npc.updateClient()
        e.npc.ai.setWalkingSpeed(6)
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.puffer_fish.sting", 1, .8)
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:block.honey_block.fall", 1, .8)
        e.npc.world.spawnParticle("upgrade_aquatic:green_jelly_blob", block_pos.x + .5, block_pos.y, block_pos.z + .5, .2, .1, .2, .6, 100)
        e.npc.world.spawnParticle("cloud", block_pos.x + .5, block_pos.y, block_pos.z + .5, 3, .1, 3, 0, 4)
        e.npc.timers.forceStart(3, getRandomInt(60, 300), false)
        var nE = e.npc.world.getNearbyEntities(e.npc.pos, 4, 5)
        for (var i = 0; i < nE.length; i++) {
            DoKnockback(e.npc, nE[i], 1, .3)
        }
    }
    if (e.id == 6) {
        e.npc.world.spawnParticle("cloud", block_pos.x + .5, block_pos.y, block_pos.z + .5, 0, .1, 0, 0, 4)
    }
    if (e.id == 7) {
        e.npc.ai.setRetaliateType(getRandomInt(0, 2))
        e.npc.timers.start(7, getRandomInt(20, 60), false)
    }
    e.npc.clearPotionEffects()
}

function FrontVectors(entity, dr, dp, distance, mode) {

    if (mode == 1) { var angle = dr + entity.getRotation(); var pitch = (-entity.getPitch() + dp) * Math.PI / 180 }

    if (mode == 0) { var angle = dr; var pitch = (dp) * Math.PI / 180 }

    var dx = -Math.sin(angle * Math.PI / 180) * (distance * Math.cos(pitch))

    var dy = Math.sin(pitch) * distance

    var dz = Math.cos(angle * Math.PI / 180) * (distance * Math.cos(pitch))

    return [dx, dy, dz]
}

function died(e) {
    e.npc.timers.stop(1)
    e.npc.timers.stop(2)
    e.npc.timers.stop(3)
    e.npc.timers.stop(4)
    e.npc.timers.stop(5)
    e.npc.timers.stop(6)
    e.npc.executeCommand('/summon area_effect_cloud ~ ~ ~ {Particle:"dust 0.5 0.78 0.12 1",Potion:empty,Radius:3,RadiusPerTick:0,Duration:100,Effects:[{Id:2,Duration:20,Amplifier:4,ShowParticles:0b}],Rotation:[0f,12f]}')
    e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.puffer_fish.sting", 1, .8)
    e.npc.world.playSoundAt(e.npc.pos, "minecraft:block.honey_block.fall", 1, .8)
}

function damaged(e) {
    e.npc.world.playSoundAt(e.npc.pos, "minecraft:block.honey_block.fall", 1, .8)
}

function meleeAttack(e) {
    e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.silverfish.ambient", 1, 2)
    e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.spider.death", 1, 2)
}

function target(e) {
    e.npc.timers.forceStart(3, getRandomInt(60, 180), false)
}

function targetLost(e) {
    e.npc.timers.stop(3)
}