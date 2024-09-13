var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/npcs/boiler/base_npc_script.js')

var CHECK_IF_ENEMY_NEAR_TID = 1
var ATTACK_DELAY_TID = 2
var COOLDOWN_TID = 3
var LOST_TARGET_DELAY = 4

var state_aggro = new State("state_aggro")
var state_cooldown = new State("state_cooldown")
var state_attacking = new State("state_attacking")
state_idle.target = function (e) {
    StateMachine.transitionToState(state_aggro, e)
}

state_aggro.enter = function (e) {
    npc.timers.start(CHECK_IF_ENEMY_NEAR_TID, 0, true)
}

state_aggro.timer = function (e) {
    if (e.id == CHECK_IF_ENEMY_NEAR_TID) {
        if (!e.npc.getAttackTarget()) {
            var nE = e.npc.world.getNearbyEntities(e.npc.pos, 2, 5)
            for (var i = 0; i < nE.length; i++) {
                if ((nE[i].type == 2 && e.npc.getFaction().hostileToNpc(nE[i])) || (nE[i].type == 1 && e.npc.getFaction().playerStatus(nE[i]) == -1) || nE[i].type == 4) {
                    e.npc.setAttackTarget(nE[i])
                }
            }
        }
        if (e.npc.getAttackTarget() && e.npc.getAttackTarget().pos.distanceTo(e.npc.pos) < 2) {
            StateMachine.transitionToState(state_attacking, e)
        }
    }
}

state_aggro.exit = function (e) {
    npc.timers.stop(CHECK_IF_ENEMY_NEAR_TID)
}

state_attacking.enter = function (e) {
    e.npc.ai.setWalkingSpeed(0)
    e.npc.timers.start(ATTACK_DELAY_TID, 30, false)
    e.npc.world.spawnParticle("aquamirae:electric", e.npc.x, e.npc.y, e.npc.z, .4, .4, .4, .4, 95)
    e.npc.world.playSoundAt(e.npc.pos, "upgrade_aquatic:entity.jellyfish.ambient", 1, getRandomFloat(.09, 1.2))
}

state_attacking.timer = function (e) {
    if (e.id == ATTACK_DELAY_TID) {

        var nE = e.npc.world.getNearbyEntities(e.npc.pos, 2, 5)
        for (var i = 0; i < nE[i].length; i++) {
            if (nE[i] == e.npc) continue
            if (nE[i].type == 2) {
                applyStatusEffect(nE[i], 123401, 120)
            }
        }
        e.npc.world.playSoundAt(e.npc.pos, "upgrade_aquatic:entity.jellyfish.sting", 1, getRandomFloat(.09, 1.2))
        e.npc.world.playSoundAt(e.npc.pos, "upgrade_aquatic:entity.jellyfish.death", 1, 1)
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.turtle.egg_break", 1, 1)
        e.npc.world.spawnParticle("aquamirae:electric", e.npc.x, e.npc.y, e.npc.z, .4, .4, .4, .4, 95)
        e.npc.executeCommand("/particle dust 1 1 0 1 ~ ~ ~ 0.5 0.5 0.5 0 100")
        StateMachine.transitionToState(state_cooldown, e)

    }
}


function applyStatusEffect(target, type, length) {
    target.trigger(450, [target])
    target.trigger(type, [target, length])
}


state_cooldown.enter = function (e) {
    e.npc.ai.setWalkingSpeed(5)
    e.npc.ai.setRetaliateType(2)
    e.npc.timers.start(COOLDOWN_TID, 120, false)
}

state_cooldown.timer = function (e) {
    if (e.id == COOLDOWN_TID) {
        StateMachine.transitionToState(state_idle, e)
    }
}

state_cooldown.exit = function (e) {
    e.npc.ai.setWalkingSpeed(2)
    e.npc.ai.setRetaliateType(0)
}