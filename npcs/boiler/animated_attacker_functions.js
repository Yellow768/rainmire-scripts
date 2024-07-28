var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
var world = API.getIWorld("minecraft:overworld")
var current_attack
var isAttacking = false
var npc

//Boiler

load(API.getLevelDir() + "/scripts/ecmascript/boiler/id_generator.js");
load(API.getLevelDir() + "/scripts/ecmascript/boiler/commonFunctions.js");
load(API.getLevelDir() + "/scripts/ecmascript/boiler/scoreboard.js");
load(API.getLevelDir() + "/scripts/ecmascript/boiler/proper_damage.js");

var min_decide_attack_delay = 20
var max_decide_attack_delay = 40

function canSeeEntity(source, entity, cone) {
    /*vector math polyfills*/
    function dot(v1, v2) {
        return v1[0] * v2[0] + v1[1] * v2[1]
    }
    function magn(v) {
        return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
    }
    function rotateVector(vec, ang) {
        ang = ang * (Math.PI / 180);
        var cos = Math.cos(ang);
        var sin = Math.sin(ang);
        return new Array(Math.round(10000 * (vec[0] * cos - vec[1] * sin)) / 10000, Math.round(10000 * (vec[0] * sin + vec[1] * cos)) / 10000);
    };
    /**/
    var coneangle = cone; /*angle of cone of sight in degrees, change this for your needs*/
    /**/
    var rot = source.rotation | 0;
    if (rot < 0) {
        if (rot < -360) { rot = rot % 360 };
        rot = 360 + rot;
    } else { if (rot > 360) { rot = rot % 360 } } /*blame Noppes for broken rotations*/
    var vnpc = [0, 1]; /*base vector for rotation 0*/
    vnpc = rotateVector(vnpc, rot); /*rotate base vector by npcs rotation*/
    var vtg = [entity.x - source.x, entity.z - source.z] /*vector to target position*/
    /*var vtg = [e.player.x-e.npc.x,e.player.z-e.npc.z]; /* this was used with interact e for testing*/
    var angle = Math.acos(dot(vnpc, vtg) / (magn(vnpc) * magn(vtg))); /*angle between vectors*/
    angle = angle * (180 / Math.PI); /*angle to degrees*/
    angle = angle | 0;
    var seen = angle <= coneangle / 2 ? true : false;

    //e.npc.say(seen)
    return seen
}

function playAnim(anim) {
    var animBuilder = API.createAnimBuilder()
    animBuilder.playOnce(anim)
    npc.syncAnimationsForAll(animBuilder)
}


function getDistanceToTarget() {
    if (!npc.getAttackTarget()) return -1
    return TrueDistanceCoord(npc.x, npc.y, npc.z, npc.getAttackTarget().x, npc.getAttackTarget().y, npc.getAttackTarget().z)
}


function Attack(animation, damage, range, cone, duration, hitbox_delay, min_distance, max_distance, chance, func, hitbox_func) {
    this.animation = animation || ""
    this.damage = damage || 0
    this.range = range || 1
    this.cone = cone || 180
    this.duration = duration || 20
    this.min_distance = min_distance || 0
    this.max_distance = max_distance || 2
    this.chance = chance || 100
    this.start_func = func || function () { }
    this.hitbox_func = hitbox_func || function () { }
}

function sortAttacksByWeightedChance() {
    var array = []
    for (var i = 0; i < attacks.length; i++) {
        if (getDistanceToTarget() > attacks[i].min_distance && getDistanceToTarget() < attacks[i].max_distance) {
            for (var j = 0; j < Math.round(attacks[i].chance); j++) {
                array.push(attacks[i])
            }
        }
    }
    return array
}

function decideAttack(e) {
    if (!e.npc.getAttackTarget()) return
    e.npc.timers.forceStart(id("decide_attack"), getRandomInt(min_decide_attack_delay, max_decide_attack_delay), false)
    if (isAttacking) return
    var attacks_by_chance = sortAttacksByWeightedChance()
    if (attacks_by_chance.length == 0) return
    var chance = getRandomInt(0, attacks_by_chance.length - 1)
    current_attack = attacks_by_chance[chance]
    current_attack.start_func(e)
    playAnim(current_attack.animation)
    isAttacking = true
    startAttackDuration(e, current_attack.duration)
}

function meleeAttack(e) {
    e.setCanceled(true)
}

function activateBasicHitbox(attack, onlyTarget) {
    var nE = npc.world.getNearbyEntities(npc.pos, attack.range, 5)
    for (var i = 0; i < nE.length; i++) {
        if (nE[i] == npc) continue
        var current_target = nE[i]
        if (onlyTarget) current_attack = npc.getAttackTarget()
        if (isTargetInHitbox(current_attack, attack)) {
            var damage = calculateDamage(attack.damage, current_target, npc)
            current_target.damage(damage)
            if (damage) { attack.hitbox_func() }
        }
    }
}



function isTargetInHitbox(target, attack) {
    if (!target) return false
    return (TrueDistanceEntities(npc, target) < attack.range && canSeeEntity(npc, target, attack.cone))
}

function startAttackDuration(e, duration) {
    e.npc.timers.forceStart(id("attack_end"), duration, false)
}

function meleeAttack(e) {
    e.setCanceled(true)
}

function target(e) {
    e.npc.timers.forceStart(1, 0, true)
}

function targetLost(e) {
    e.npc.timers.stop(1)
}

function timer(e) {
    if (e.id == 1) {
        if (e.npc.getAttackTarget().pos.distanceTo(e.npc.pos) < 2) {
            e.npc.timers.stop(1)
            e.npc.timers.forceStart(2, 12, false)
            var animBuilder = API.createAnimBuilder()
            animBuilder.playOnce("attack")
            npc.syncAnimationsForAll(animBuilder)
        }
        if (e.id == 2) {
            if (e.npc.getAttackTarget().pos.distanceTo(e.npc.pos) < 2 && canSeeEntity(e.npc, e.npc.getAttackTarget(), 180)) {
                e.npc.getAttackTarget().damage(2)
            }
        }
    }
}