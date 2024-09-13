var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/npcs/boiler/base_npc_script.js')
load(api.getLevelDir() + '/scripts/ecmascript/boiler/commonFunctions.js')
load(api.getLevelDir() + '/scripts/ecmascript/boiler/proper_damage.js')

var state_aggro = new State("state_aggro")

StateMachine.addState(state_aggro)



state_idle.target = function (e) {
    StateMachine.transitionToState(state_aggro, e)
}

state_aggro.enter = function (e) {
    e.npc.timers.forceStart(1, getRandomInt(20, 90), false)
}


var projectile_array = []
state_aggro.timer = function (e) {
    if (e.id == 1) {
        //Initiate attack
        var animBuilder = e.API.createAnimBuilder()
        animBuilder.thenPlay("animation.prongfish.attack").thenPlay("animation.prongfish.idle")
        e.npc.syncAnimationsForAll(animBuilder)
        e.npc.timers.start(2, 10, false)
        e.npc.timers.start(11, 20, false)
    }
    if (e.id == 11) {
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.puffer_fish.blow_up", 1, getRandomInt(.2, .9))
    }
    if (e.id == 2) {
        //Launch projectiles
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.puffer_fish.blow_out", 1, getRandomInt(.2, .9))
        var nE = e.npc.world.getNearbyEntities(e.npc.pos, 5, 2)
        for (var i = 0; i < nE.length; i++) {
            if (nE[i] == e.npc) continue
            if (StateMachine.current_state != state_panicking) {
                if (nE[i].type == 2 && !nE[i].getFaction().hostileToNpc(e.npc)) continue
            }
            damageFrom(nE[i], e.npc, 3)
            DoKnockback(e.npc, nE[i], 4, 0)
        }
        for (var i = 0; i <= 8; i++) {
            for (var h = -1; h <= 1; h++) {
                var d = FrontVectors(e.npc, 45 * i, 45 * h, 2, true)
                var proj = e.npc.shootItem(e.npc.x + d[0], e.npc.y + (1.1 * d[1]) + .5, e.npc.z + d[2], e.npc.getInventory().getProjectile(), 95)
                projectile_array.push(proj)
            }
        }
        e.npc.timers.forceStart(1, getRandomInt(30, 60), false)
        e.npc.timers.forceStart(3, 10, false)
    }
    if (e.id == 3) {
        for (var i = 0; i < projectile_array.length; i++) {
            projectile_array[i].despawn()
        }
        projectile_array = []
    }
    if (e.id == 4) {
        if (e.npc.getAttackTarget()) return
        StateMachine.transitionToState(state_idle, e)
    }
}


state_aggro.targetLost = function (e) {
    e.npc.timers.forceStart(4, 40, false)
}

state_aggro.exit = function (e) {
    npc.timers.stop(1)
    npc.timers.stop(2)
}

state_panicking.enter = function (e) {
    state_panicking.applyPanickingEffects(e)
    npc.timers.forceStart(1, getRandomInt(20, 40), false)
}

state_panicking.timer = function (e) {
    state_panicking.defaultPanickingTimer(e)
    state_aggro.timer(e)
}

state_panicking.exit = function (e) {
    state_panicking.revertToDefault(e)
    npc.setAttackTarget(null)
}
