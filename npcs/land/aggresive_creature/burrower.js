var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/npcs/boiler/base_npc_script.js')
load(api.getLevelDir() + '/scripts/ecmascript/boiler/proper_damage.js')
load(api.getLevelDir() + '/scripts/ecmascript/boiler/spawnCircularParticles.js')
/*what does burrower do


follows player and does normal melee
burrows into ground and roots around
launches out of ground to do large aoe damage

*/

var state_burrowed = new State("state_burrowed")

state_idle.enter = function (e) {
    npc.display.setHitboxState(0)
    npc.timers.stop(1)
    npc.timers.stop(2)
    npc.timers.stop(3)
    npc.timers.has(1)
    npc.display.setVisible(0)
    npc.ai.setWalkingSpeed(5)
    npc.stats.getMelee().setStrength(5)
    npc.updateClient()
    if (npc.getAttackTarget()) {
        e.npc.timers.forceStart(1, getRandomInt(60, 120), false)

    }
}

state_idle.target = function (e) {
    e.npc.timers.forceStart(1, getRandomInt(60, 120), false)
}

state_idle.targetLost = function (e) {

    npc.timers.stop(1)
    npc.timers.stop(2)
    npc.timers.stop(4)
}

state_idle.exit = function (e) {
    npc.timers.stop(1)
    npc.timers.stop(2)
    npc.timers.stop(4)
}

state_idle.timer = function (e) {
    if (e.id == 1) {
        e.npc.setMotionY(.3)
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.goat.long_jump", 1, getRandomFloat(0.2, 1))
        e.npc.timers.forceStart(2, 0, true)
        e.npc.timers.forceStart(4, 10, false)
    }
    if (e.id == 2) {
        if (isOnGround(e.npc)) {
            StateMachine.transitionToState(state_burrowed, e)
        }
    }
    if (e.id == 4) {
        e.npc.setMotionY(-.5)
    }
}

state_burrowed.enter = function (e) {
    npc.executeCommand("particle block " + npc.getWorld().getBlock(npc.pos.down(1)).getName() + " ~ ~-.5 ~ .3 1 .3 0 400 force")
    npc.executeCommand("particle block " + npc.getWorld().getBlock(npc.pos.down(1)).getName() + " ~ ~ ~ .2 .2 .2 0 1000 force")
    npc.world.playSoundAt(npc.pos, "block.sand.break", 1, 1)
    npc.world.playSoundAt(npc.pos, "minecraft:block.shroomlight.break", 1, 1)
    npc.display.setHitboxState(1)
    npc.display.setVisible(1)
    npc.timers.start(1, 80, false)
    npc.timers.forceStart(3, 0, true)
    npc.ai.setWalkingSpeed(8)
    npc.stats.getMelee().setStrength(0)
    npc.updateClient()
}

state_burrowed.timer = function (e) {
    if (e.id == 1) {
        e.npc.timers.stop(2)
        state_burrowed.launchOutOfGround(e)
        StateMachine.transitionToState(state_idle, e)
    }
    if (e.id == 3) {
        e.npc.executeCommand("particle block " + e.npc.getWorld().getBlock(e.npc.pos.down(1)).getName() + " ~ ~-.5 ~ .2 .2 .2 0 30 force")
        e.npc.world.playSoundAt(e.npc.pos, "block.gravel.break", .3, .2)
        e.npc.world.playSoundAt(e.npc.pos, "block.sand.break", .5, .2)
    }
}

state_burrowed.tick = function (e) {
    if (e.npc.inWater()) {
        transitionToState(state_idle, e)
    }
}

state_burrowed.launchOutOfGround = function (e) {
    e.npc.setMotionY(.6)
    e.npc.executeCommand("particle block " + e.npc.getWorld().getBlock(e.npc.pos.down(1)).getName() + " ~ ~-.5 ~ .8 2 .8 0 1000 force")
    e.npc.executeCommand("particle block " + e.npc.getWorld().getBlock(e.npc.pos.down(1)).getName() + " ~ ~ ~ .2 .2 .2 0 1000 force")
    e.npc.world.playSoundAt(e.npc.pos, "block.sand.break", 1, 1)
    e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.wither.break_block", .2, .2)
    e.npc.world.playSoundAt(e.npc.pos, "minecraft:block.shroomlight.break", 1, 1)
    var entities = e.npc.world.getNearbyEntities(e.npc.pos, 1, 5)
    for (var i = 0; i < entities.length; i++) {
        if (entities[i] != e.npc && entities[i].name != "Burrower") {
            entities[i].damage(5)
            entities[i].addPotionEffect(2, 4, 2, false)
            entities[i].setMotionY(.8)
        }
    }
    spawnCircularParticles(e.npc.world, "crit", 3, 0, 0, e.npc.x, e.npc.y, e.npc.z)
}

state_burrowed.exit = function (e) {
    e.npc.timers.stop(1)
    e.npc.timers.stop(2)
    e.npc.timers.stop(3)
}

state_panicking.enter = function (e) {
    state_panicking.applyPanickingEffects(e)
    state_burrowed.enter(e)

}

state_panicking.timer = function (e) {
    state_panicking.defaultPanickingTimer(e)
    state_burrowed.timer(e)
}