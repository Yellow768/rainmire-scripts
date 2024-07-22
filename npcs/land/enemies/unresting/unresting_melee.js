var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(API.getLevelDir() + "/scripts/ecmascript/npcs/boiler/animated_attacker_functions.js");
min_decide_attack_delay = 10
max_decide_attack_delay = 20

var left_melee = new Attack()
left_melee.animation = "unresting.melee_left"
left_melee.chance = 5
left_melee.cone = 180
left_melee.duration = 14
left_melee.start_func = function (e) { e.npc.timers.forceStart(id("unresting_swing"), 6, false) }
left_melee.min_distance = 0
left_melee.max_distance = 5
left_melee.range = 2

var right_melee = new Attack()
left_melee.animation = "unresting.melee_right"
left_melee.chance = 5
left_melee.cone = 180
left_melee.duration = 14
left_melee.start_func = function (e) { e.npc.timers.forceStart(id("unresting_swing"), 6, false) }
left_melee.min_distance = 0
left_melee.max_distance = 5
left_melee.range = 2

var attacks = [left_melee, right_melee]

function init(e) {
    npc = e.npc
}

function target(e) {
    e.npc.timers.forceStart(id("decide_attack"), getRandomInt(min_decide_attack_delay, max_decide_attack_delay), false)
    e.npc.timers.forceStart(id("decide_movement"), getRandomInt(20, 40), false)
}

function targetLost(e) {
    e.npc.say("wow")
    e.npc.timers.stop(id("decide_attack"))
    e.npc.timers.stop(id("decide_movement"))
}

function timer(e) {
    if (e.id == id("decide_attack")) {
        decideAttack(e)
    }
    if (e.id == id("unresting_swing")) {
        activateBasicHitbox(left_melee, true)
    }
    if (e.id == id("attack_end")) {
        isAttacking = false
    }
    if (e.id == id("decide_movement")) {
        decide_movement(e)
    }
}

function decide_movement(e) {
    if (TrueDistanceEntities(e.npc, e.npc.getAttackTarget()) < 4) {
        var directions = [-.4, .4]
        e.npc.setMoveStrafing(directions[getRandomInt(0, directions.length)])
        e.npc.timers.forceStart(id("decide_movement"), getRandomInt(20, 40), false)
    }
}