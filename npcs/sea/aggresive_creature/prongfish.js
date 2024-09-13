var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/npcs/boiler/base_npc_script.js')
load(api.getLevelDir() + '/scripts/ecmascript/boiler/commonFunctions.js')
load(api.getLevelDir() + '/scripts/ecmascript/boiler/entity_shoot.js')

var state_aggro = new State("state_aggro")

StateMachine.addState(state_aggro)



state_idle.target = function (e) {
    StateMachine.transitionToState(state_aggro, e)
}

state_aggro.enter = function (e) {
    e.npc.timers.start(1, getRandomInt(20, 90), false)
}


var projectile_array = []
state_aggro.timer = function (e) {
    if (e.id == 1) {
        //Initiate attack
        var animBuilder = e.API.createAnimBuilder()
        animBuilder.thenPlay("animation.prongfish.attack").thenPlay("animation.prongfish.idle")
        e.npc.syncAnimationsForAll(animBuilder)
        e.npc.timers.start(2, 20, false)
    }
    if (e.id == 2) {
        //Launch projectiles
        projectile_array = []
        for (var i = 0; i <= 8; i++) {
            for (var h = -1; h <= 1; h++) {
                var proj = entityShoot(e.npc.pos, {
                    itemid: "golden_carrot",
                    rotation: e.npc.rotation + (45 * i),
                    pitch: (45 * h),
                    speed: 2,
                    gravity: 0,
                    x: e.npc.x,
                    y: e.npc.y,
                    z: e.npc.z,
                    size: 20,
                    power: 3,
                    punch: 4,
                    accelerate: 1

                })
                projectile_array.push(proj)
            }
        }
        e.npc.timers.forceStart(1, getRandomInt(30, 90), false)
        e.npc.timers.forceStart(3, 40, false)
    }
    if (e.id == 3) {
        for (var i = 0; i < projectile_array.length; i++) {
            projectile_array[i].despawn()
        }
    }
    if (e.id == 4) {
        StateMachine.transitionToState(state_idle, e)
    }
}


state_aggro.targetLost = function (e) {
    e.npc.timers.start(4, 40, false)
}

state_aggro.exit = function (e) {
    e.npc.timers.stop(1)
    e.npc.timers.stop(2)
}
