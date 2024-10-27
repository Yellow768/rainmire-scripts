var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/npcs/boiler/base_npc_script.js')

var state_aggro = new State("state_aggro")

state_idle.target = function (e) {
    StateMachine.transitionToState(state_aggro)
}

state_aggro.enter = function (e) {
    npc.setMoveStrafing(0)
    npc.setMoveForward(0)
    npc.timers.start(1, getRandomInt(20, 40), false)
}

state_aggro.timer = function (e) {
    if (e.id == 1) {
        var directions = [-.3, 0, .3]
        e.npc.setMoveStrafing(getRandomElement(directions))
        e.npc.setMoveForward(.3)
        e.npc.timers.start(1, getRandomInt(20, 40), false)
    }
}

state_aggro.targetLost = function (e) {
    StateMachine.transitionToState(state_idle)
}

state_aggro.exit = function (e) {
    npc.setMoveForward(0)
    npc.setMoveStrafing(0)
    npc.timers.stop(1)
}

function rangedLaunched(e) {
    for (var projectile in e.projectiles) {
        e.projectiles[projectile].enableEvents()
    }
}


function projectileImpact(e) {
    e.projectile.world.playSoundAt(e.projectile.pos, "upgrade_aquatic:entity.pike.hurt", .4, 1)
    e.projectile.world.playSoundAt(e.projectile.pos, "minecraft:block.fire.extinguish", .4, 1)

    e.projectile.world.spawnParticle("minecraft:totem_of_undying", e.projectile.x, e.projectile.y, e.projectile.z, .3, .3, .3, .2, 15)
}