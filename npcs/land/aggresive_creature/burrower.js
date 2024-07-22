var npc
var burrowing = false
var stunned = false

/**
 * @param {NpcEvent.InitEvent} e
 */
function init(e) {
    npc = e.npc

}

function target(e) {
    if (stunned || npc.storeddata.get("hasStatusEffect")) return
    e.npc.timers.forceStart(id("beginBurrow"), getRandomInt(40, 120), false)
}

function died(e) {
    revealBurrower()
    disableAttacks()
}

function targetLost(e) {
    if (npc.storeddata.has("panicked")) return
    revealBurrower()
    disableAttacks()
}

function revealBurrower() {
    npc.display.setVisible(0)
    npc.display.setHitboxState(0)
    npc.ai.setWalkingSpeed(7)
    npc.stats.melee.setStrength(2)
    npc.stats.melee.setDelay(20)
    npc.updateClient()

    burrowing = false
}

function disableAttacks() {
    npc.timers.stop(id("beginBurrow"))
    npc.timers.stop(id("launchOutOfGround"))
    npc.timers.stop(id("burrowParticle"))
}

function beginBurrow() {
    if (npc.inWater()) {
        npc.timers.forceStart(id("beginBurrow"), getRandomInt(40, 120), false)
        return
    }
    npc.display.setVisible(1)
    npc.display.setHitboxState(1)
    npc.ai.setWalkingSpeed(10)
    npc.stats.melee.setStrength(0)
    npc.stats.melee.setDelay(72000)
    npc.timers.forceStart(id("launchOutOfGround"), 50, false)
    npc.timers.forceStart(id("burrowParticle"), 1, true)
    npc.updateClient()
    npc.executeCommand("particle block " + npc.getWorld().getBlock(npc.pos.down(1)).getName() + " ~ ~-.5 ~ .3 1 .3 0 400 force")
    npc.executeCommand("particle block " + npc.getWorld().getBlock(npc.pos.down(1)).getName() + " ~ ~ ~ .2 .2 .2 0 1000 force")
    npc.world.playSoundAt(npc.pos, "block.sand.break", 1, 1)
    npc.world.playSoundAt(npc.pos, "minecraft:block.shroomlight.break", 1, 1)
    burrowing = true
}

function timer(e) {
    if (e.id == id("beginBurrow")) {
        beginBurrow()
    }
    if (e.id == id("launchOutOfGround")) {
        e.npc.setMotionY(.6)
        revealBurrower()
        e.npc.stats.melee.setStrength(2)
        e.npc.stats.melee.setDelay(20)
        e.npc.timers.stop(id("burrowParticle"))
        e.npc.updateClient()
        e.npc.executeCommand("particle block " + e.npc.getWorld().getBlock(e.npc.pos.down(1)).getName() + " ~ ~-.5 ~ .8 2 .8 0 1000 force")
        e.npc.executeCommand("particle block " + e.npc.getWorld().getBlock(e.npc.pos.down(1)).getName() + " ~ ~ ~ .2 .2 .2 0 1000 force")
        e.npc.world.playSoundAt(e.npc.pos, "block.sand.break", 1, 1)
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.wither.break_block", .2, .2)
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:block.shroomlight.break", 1, 1)
        e.npc.timers.forceStart(id("beginBurrow"), getRandomInt(40, 80), false)
        var entities = e.npc.world.getNearbyEntities(e.npc.pos, 2, 5)
        for (var i = 0; i < entities.length; i++) {
            if (entities[i] != e.npc) {
                entities[i].damage(5)
                entities[i].addPotionEffect(2, 4, 2, false)
                entities[i].setMotionY(.8)
            }
        }
        spawnCircularParticles(e.npc.world, "crit", 3, 0, 0, e.npc.x, e.npc.y, e.npc.z)


    }
    if (e.id == id("burrowParticle")) {
        e.npc.executeCommand("particle block " + e.npc.getWorld().getBlock(e.npc.pos.down(1)).getName() + " ~ ~-.5 ~ .2 .2 .2 0 30 force")

        e.npc.world.playSoundAt(e.npc.pos, "block.gravel.break", .3, .2)
        e.npc.world.playSoundAt(e.npc.pos, "block.sand.break", .5, .2)
        if (npc.storeddata.has("panicked")) {
            e.npc.executeCommand("particle dust .8 0 .8 1 ~ ~-.5 ~ .2 .2 .2 0 30 force")

        }
    }
    if (e.id == id("revertPanickedState")) {
        npc.ai.setWalkingSpeed(5)
        npc.ai.setRetaliateType(0)
        npc.setAttackTarget(null)
        stunned = false
    }
}

function trigger(e) {
    if (e.id == 1 && burrowing) {
        revealBurrower()
        disableAttacks()
        npc.timers.forceStart(id("revertPanickedState"), 60, false)
        npc.setMotionY(.8)
        npc.ai.setWalkingSpeed(3)
        npc.ai.setRetaliateType(1)
        stunned = true
        npc.executeCommand("particle block " + npc.getWorld().getBlock(npc.pos.down(1)).getName() + " ~ ~ ~ .2 .2 .2 0 1000 force")
        npc.world.playSoundAt(npc.pos, "minecraft:block.shroomlight.break", 1, 1)
        npc.addPotionEffect(2, 3, 1, true)
    }
    if (e.id == 123405) {
        disableAttacks()
        if (npc.storeddata.has("panicked")) {
            npc.ai.setRetaliateType(1)
            beginBurrow()
        }
    }
    if (e.id == 123406) {
        disableAttacks()
        npc.ai.setRetaliateType(0)
        npc.setAttackTarget(null)
    }
}

