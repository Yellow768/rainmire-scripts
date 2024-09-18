var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/npcs/boiler/base_npc_script.js')
load(api.getLevelDir() + '/scripts/ecmascript/boiler/spawnCircularParticles.js')
load(api.getLevelDir() + '/scripts/ecmascript/boiler/proper_damage.js')
var min_squelch_delay = 20
var max_squelch_delay = 40

var state_aggro = new State("state_agrro")
global_functions.init = function (e) {
    var p = e.npc.shootItem(e.npc, e.npc.world.createItem("oak_button", 1), 0)
    try { p.enableEvents() }
    catch (error) { }
    p.despawn()
}
global_functions.damaged = function (e) {
    e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.enderman.hurt", 1, 1.7)
}



state_idle.enter = function (e) {

}

state_idle.target = function (e) {
    StateMachine.transitionToState(state_aggro, e)
}


state_aggro.enter = function (e) {
    npc.timers.forceStart(1, 20, false)
    npc.timers.forceStart(2, getRandomInt(20, 40), false)
    npc.tempdata.put("target", e.entity)
}


state_aggro.targetLost = function (e) {
    StateMachine.transitionToState(state_idle, e)
}

state_aggro.timer = function (e) {
    if (e.id == 1) {
        var speed = Math.min(TrueDistanceEntities(e.npc, e.npc.tempdata.get("target")), 5)
        e.npc.stats.getRanged().setSpeed(speed)
        var d = FrontVectors(e.npc, GetAngleTowardsEntity(e.npc, e.npc.tempdata.get("target")), 45, speed, false)
        e.npc.shootItem(e.npc.x + d[0], e.npc.y + d[1], e.npc.z + d[2], e.npc.world.createItem("minecraft:orange_dye", 1), 100).enableEvents()
        npc.timers.forceStart(1, getRandomInt(20, 40), false)
        //effects
        e.npc.world.spawnParticle("falling_honey", e.npc.x, e.npc.y + 2, e.npc.z, .2, .2, .2, 0, 50)
        e.npc.world.playSoundAt(e.npc.pos, "create:fwoomp", 1, .6)
    }
    if (e.id == 2) {
        switch (e.npc.ai.getRetaliateType()) {
            case 0:
                e.npc.ai.setRetaliateType(1)
                break;
            case 1:
                e.npc.ai.setRetaliateType(0)
                break;
        }
        npc.timers.forceStart(2, getRandomInt(min_squelch_delay, max_squelch_delay), false)
    }
    if (e.id == 3) {
        if (!e.npc.getAttackTarget()) {
            StateMachine.transitionToState(state_idle, e)
        }
    }
}

state_panicking.enter = function (e) {
    state_panicking.applyPanickingEffects(e)
    npc.timers.forceStart(1, 5, false)
    npc.timers.forceStart(2, getRandomInt(20, 40), false)
    npc.timers.forceStart(6, 10, true)
    state_panicking.changeTargetBlock()
    min_squelch_delay = 5
    max_squelch_delay = 5
}

state_panicking.changeTargetBlock = function () {
    var randomDir = FrontVectors(npc, getRandomInt(0, 360), 0, getRandomInt(2, 6), false)
    npc.tempdata.put("target", {
        x: npc.x + randomDir[0], y: npc.y, z: npc.z + randomDir[2],
        getX: function () { return this.x }, getY: function () { return this.y }, getZ: function () { return this.z },
    })
}

state_panicking.timer = function (e) {
    state_panicking.defaultPanickingTimer(e)
    state_aggro.timer(e)
    if (e.id == 6) {
        state_panicking.changeTargetBlock()
    }
    min_squelch_delay = 20
    max_squelch_delay = 40
}

state_panicking.exit = function (e) {
    state_panicking.revertToDefault(e)
    e.npc.timers.stop(6)
}

state_aggro.exit = function (e) {
    npc.timers.stop(1)
    npc.timers.stop(2)
}


/**
* @param {ProjectileEvent.ImpactEvent} e
*/
function projectileImpact(e) {
    var nE = e.projectile.world.getNearbyEntities(e.projectile.pos, 4, 5)
    for (var i = 0; i < nE.length; i++) {
        if (nE[i] == npc) continue
        nE[i].knockback(3, GetAngleTowardsEntity(e.projectile, nE[i]))
        nE[i].setMotionY(.5)
        damageFrom(nE[i], npc, 3)
    }
    spawnCircularParticles(e.projectile.world, "falling_honey", 4, 1, 1, e.projectile.x, e.projectile.y - 1, e.projectile.z)
    spawnCircularParticles(e.projectile.world, "crit", 4, 1, 1, e.projectile.x, e.projectile.y - 1, e.projectile.z)
    spawnCircularParticles(e.projectile.world, "cloud", 1, 1, 1, e.projectile.x, e.projectile.y - 1, e.projectile.z)
    e.projectile.world.playSoundAt(e.projectile.pos, "minecraft:entity.puffer_fish.sting", 1, .6)
    e.projectile.world.playSoundAt(e.projectile.pos, "minecraft:entity.slime.jump", 1, .6)
}



