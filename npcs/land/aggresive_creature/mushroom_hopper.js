var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/npcs/boiler/base_npc_script.js')
load(api.getLevelDir() + '/scripts/ecmascript/boiler/proper_damage.js')



var state_aggro = new State("state_aggro")
var state_preparing_jump = new State("preparing_jump")
var state_jumping = new State("state_jumping")
global_functions.init = function (e) {
    e.npc.stats.getMelee().setDelay(20)
}

global_functions.meleeAttack = function (e) {
    e.setCanceled(true)
}
global_functions.damaged = function (e) {
    e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.bat.hurt", .2, .2)
    e.npc.executeCommand("/particle dust 1 .2 .2 1 ~ ~ ~ 0.15 0.15 0.15 2 20 force")
}

function animateWalking(e) {
    if (!e.npc.tempdata.has("walking") && Math.abs(e.npc.getMotionX()) + Math.abs(e.npc.getMotionZ()) > 0) {
        var animBuilder = e.API.createAnimBuilder()
        animBuilder.thenLoop("animation.mushroom_hopper.walk")
        e.npc.syncAnimationsForAll(animBuilder)
        e.npc.tempdata.put("walking", 1)
        e.npc.timers.forceStart(11, 10, true)
    }
    if (e.npc.tempdata.has("walking") && Math.abs(e.npc.getMotionX()) + Math.abs(e.npc.getMotionZ()) == 0) {
        var animBuilder = e.API.createAnimBuilder()
        animBuilder.thenLoop("animation.mushroom_hopper.idle")
        e.npc.syncAnimationsForAll(animBuilder)
        e.npc.tempdata.remove("walking")

        e.npc.timers.stop(11)
    }
}

state_idle.enter = function (e) {
    e.npc.ai.setWalkingSpeed(3)
    e.npc.timers.forceStart(10, 0, true)
}

state_idle.timer = function (e) {
    if (e.id == 10) {
        animateWalking(e)
    }
    if (e.id == 11) {
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:block.fungus.step", .1, getRandomFloat(.2, .6))
    }
}

state_idle.target = function (e) {
    StateMachine.transitionToState(state_aggro, e)
}

state_aggro.enter = function (e) {
    e.npc.timers.forceStart(10, 0, true)
}

state_aggro.meleeAttack = function (e) {
    StateMachine.transitionToState(state_preparing_jump, e)
}

state_aggro.timer = function (e) {
    if (e.id == 10) {
        animateWalking(e)
    }
    if (e.id == 11) {
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:block.fungus.step", .1, getRandomFloat(.2, .6))
    }
}

state_preparing_jump.enter = function (e) {
    var animBuilder = e.API.createAnimBuilder()
    animBuilder.thenPlay("animation.mushroom_hopper.attack")
    e.npc.ai.setWalkingSpeed(0)
    e.npc.syncAnimationsForAll(animBuilder)
    e.npc.timers.forceStart(1, 15, false)

}

state_preparing_jump.timer = function (e) {
    if (e.id == 1) {
        if (!e.npc.getAttackTarget()) return
        var pitch = 10
        if (e.npc.y < e.npc.getAttackTarget().y) pitch = 15
        var direction = FrontVectors(e.npc, GetAngleTowardsEntity(e.npc, e.npc.getAttackTarget()), pitch, 2, false)
        e.npc.setMotionX(direction[0])
        e.npc.setMotionY(direction[1])
        e.npc.setMotionZ(direction[2])
        StateMachine.transitionToState(state_jumping, e)
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.goat.long_jump", 1, getRandomFloat(0.2, 0.9))
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:block.beehive.exit", 1, getRandomFloat(0.2, 0.9))
        e.npc.executeCommand("/particle block " + e.npc.world.getBlock(e.npc.pos.down(1)).getName() + " ~ ~-.5 ~ .2 .2 .2 0 4 force")
    }
}

state_preparing_jump.targetLost = function (e) {
    StateMachine.transitionToState(state_idle, e)
}

state_jumping.enter = function (e) {
    e.npc.timers.forceStart(1, 0, true)
    e.npc.timers.forceStart(2, 0, true)
}

state_jumping.timer = function (e) {
    if (e.id == 1) {
        if (isOnGround(e.npc)) {
            StateMachine.transitionToState(state_idle, e)
            e.npc.world.playSoundAt(e.npc.pos, "upgrade_aquatic:entity.perch.hurt", 1, getRandomFloat(0.2, 0.9))
            e.npc.executeCommand("/particle block " + e.npc.world.getBlock(e.npc.pos.down(1)).getName() + " ~ ~-.5 ~ .2 .2 .2 0 10 force")
        }
    }
    if (e.id == 2) {
        if (!e.npc.getAttackTarget()) return
        if (TrueDistanceCoord(e.npc.x, e.npc.y, e.npc.z, e.npc.getAttackTarget().x, e.npc.getAttackTarget().y, e.npc.getAttackTarget().z) > 1) return
        damageFrom(e.npc.getAttackTarget(), e.npc, 2)
        DoKnockback(e.npc, e.npc.getAttackTarget(), 1, 0)
        e.npc.setMotionX(0)
        e.npc.setMotionZ(0)

    }
}

state_jumping.collide = function (e) {

}

state_jumping.exit = function (e) {
    e.npc.setAttackTarget(null)
}
