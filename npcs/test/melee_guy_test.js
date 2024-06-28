var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(API.getLevelDir() + "/scripts/ecmascript/npcs/boiler/animated_attacker_functions.js");
load(API.getLevelDir() + "/scripts/ecmascript/boiler/proper_damage.js");
load(API.getLevelDir() + "/scripts/ecmascript/boiler/commonFunctions.js");
load(API.getLevelDir() + "/scripts/ecmascript/boiler/id_generator.js");
var npc
var EntityType = Java.type("noppes.npcs.api.constants.EntitiesType");
var isSpinAttacking = false


var upslash = new Attack()
upslash.animation = "animation.scythe_upslash"
upslash.damage = 2
upslash.range = 2
upslash.cone = 120
upslash.duration = 20
upslash.min_range = 2
upslash.chance = 30
upslash.hitbox_delay = 8
upslash.hitbox_func = function () { npc.getAttackTarget().setMotionY(.7) }

var slash = new Attack()
slash.animation = "animation.scythe.slash"
slash.damage = 2
slash.range = 1.5
slash.cone = 120
slash.duration = 15
slash.min_range = 2
slash.chance = 60
slash.func = function () { npc.timers.forceStart(id("slash_attack")) }
slash.hitbox_func = function () { npc.getAttackTarget().knockback(1, GetAngleTowardsEntity(npc, npc.getAttackTarget())) }


var spin = new Attack()
spin.animation = "animation.scythe.spin"
spin.damage = 2
spin.range = 1
spin.duration = 60
spin.min_range = 10
spin.chance = 10
spin.start_func = function (e) { attackSpin(e) }


var leap = new Attack()
leap.animation = "animation.scyhte.leap_attack"
leap.damage = 4
leap.range = 2
leap.duration = 40
leap.min_range = 10
leap.chance = 20
leap.start_func = function () { npc.timers.forceStart(id("leap_attack_launch"), 8, false) }



function timer(e) {
    switch (e.id) {
        case id("decide_attack"):
            decideAttack(e)
            break;
        case id("hitbox"):
            activateHitbox(current_attack)
            break;
        case id("attack_end"):
            isAttacking = false
            e.npc.ai.setWalkingSpeed(7)
            break;
        case id("movementDecision"):
            makeMovementDecision(e)
            break;
        case id("spin_attack_loop"):
            spinAttackMotion(e)
            break;
        case id("checkForOnGround"):
            if (e.npc.getMCEntity().m_20096_()) {
                e.npc.timers.stop(id("checkForOnGround"))
                e.npc.timers.start(id("stunned"), 120, false)
            }
            break;
        case id("stunned"):
            endStun(e)
            break;
        case id("spin_end"):
            e.npc.timers.stop(id("spin_attack_loop"))
            e.npc.ai.setWalkingSpeed(7)
            e.npc.storeddata.remove("spin_angle")
            isSpinAttacking = false
            break;
        case id("leap_attack_launch"):
            var d = FrontVectors(e.npc, GetAngleTowardsEntity(e.npc, e.npc.getAttackTarget()), 0, getDistanceToTarget() / 4, 0)
            e.npc.setMotionY(.3)
            e.npc.setMotionX(d[0])
            e.npc.setMotionZ(d[2])
            e.npc.setMoveStrafing(0)
            e.npc.timers.stop(id("movementDecision"))
            e.npc.world.playSoundAt(e.npc.pos, "quark:entity.pickarang.clank", .2, .2)
            e.npc.world.playSoundAt(e.npc.pos, "customnpcs:misc.swosh", .7, .7)
            break;
    }
}



var attacks = [leap, slash, upslash]

function activateBasicHitbox(attack) {
    if (!npc.getAttackTarget()) return
    if (isTargetInHitbox(target, attack)) {
        var damage = calculateDamage(attack.damage, npc.getAttackTarget(), npc)
        npc.getAttackTarget().damage(damage)
        if (damage) { attack.hitbox_func() }
    }
}



function isTargetInHitbox(target, attack) {
    return (TrueDistanceEntities(npc, target) < attack.range && canSeeEntity(npc, target, attack.fov))
}

var isAttacking = false

function init(e) {
    npc = e.npc
    e.npc.timers.stop(id("spin_attack_chance"))
    e.npc.timers.stop(id("spin_attack_loop"))
    e.npc.timers.stop(id("slash_hitbox"))
    e.npc.timers.stop(id("upslash_hitbox"))
    if (e.npc.storeddata.has("spin_angle")) {
        e.npc.tempdata.put("spin_angle", JSON.parse(e.npc.storeddata.get("spin_angle")))
    }
}

function target(e) {
    e.npc.timers.forceStart(id("decide_attack"), getRandomInt(20, 40), false)
    e.npc.timers.forceStart(id("movementDecision"), getRandomInt(20, 60), false)
}

function targetLost(e) {
    e.npc.timers.stop(id("decide_attack"))
    e.npc.timers.stop(id("movementDecision"))
    e.npc.setMoveStrafing(0)
}

/**
 * @param {NpcEvent.DamagedEvent} e
 */
function damaged(e) {
    if (isSpinAttacking) {
        e.setCanceled(true)
        return

    }
    if (e.source && getRandomInt(0, 100) < 50 && canSeeEntity(e, e.npc, e.source, 180) && !isAttacking) {
        e.npc.syncAnimationsForAll(e.API.createAnimBuilder().playOnce("animation.block"))
        e.setCanceled(true)
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:item.shield.block", .7, 1)
        e.npc.world.playSoundAt(e.npc.pos, "quark:entity.pickarang.clank", .7, .7)
        e.npc.timers.forceStart(id("decide_attack"), 15, false)
    }
}


function meleeAttack(e) {
    e.setCanceled(true)
}



function decideAttack(e) {
    if (!e.npc.getAttackTarget()) return
    e.npc.timers.forceStart(id("decide_attack"), getRandomInt(20, 40), false)
    if (isAttacking) return
    var attacks_by_chance = sortAttacksByWeightedChance()

    if (attacks_by_chance.length == 0) return
    e.npc.say("a")
    var chance = getRandomInt(0, attacks_by_chance.length - 1)
    current_attack = attacks_by_chance[chance]
    current_attack.start_func(e)
    playAnim(current_attack.animation)
    isAttacking = true
    startAttackDuration(e, current_attack.duration)
    e.npc.timers.forceStart(id("hitbox"), current_attack.hitbox_delay, false)

}


function attackSpin(e) {
    isAttacking = true
    startAttackDuration(e, attacks.spin.duration)
    playAnim("animation.scythe.spin")
    var d = FrontVectors(e.npc, GetAngleTowardsEntity(e.npc, e.npc.getAttackTarget()), 0, .7, 0)
    e.npc.tempdata.put("spin_angle", d)
    e.npc.storeddata.put("spin_angle", JSON.stringify(d))
    e.npc.timers.forceStart(id("spin_attack_loop"), 3, true)
    e.npc.timers.forceStart(id("spin_end"), attacks.spin.duration, false)
    e.npc.ai.setWalkingSpeed(0)
    isAttacking = true
    isSpinAttacking = true
}

function attackLeap(e) {
    playAnim("animation.scythe.leap_attack")
    e.npc.timers.start(id("leap_attack_launch"), 2, false)
}

//Instead of a universal hitbox function, instead have a hitbox_func in each attack, and when the hitbox is activated
//run that function. Extract *some* of the repeated logic into util functions, like idk.

function spinAttackMotion(e) {
    if (getRandomInt(0, 100) < 20 && e.npc.getAttackTarget()) {
        var d = FrontVectors(e.npc, GetAngleTowardsEntity(e.npc, e.npc.getAttackTarget()), 0, 1, 0)
        e.npc.tempdata.put("spin_angle", d)
    }
    e.npc.setMotionX(e.npc.tempdata.get("spin_angle")[0])
    e.npc.setMotionZ(e.npc.tempdata.get("spin_angle")[2])
    var nE = e.npc.world.getNearbyEntities(e.npc.pos, attacks.spin.range, EntityType.LIVING)
    for (var i = 0; i < nE.length; i++) {
        if (nE[i] == e.npc) continue
        var damage = calculateDamage(attacks.spin.damage, nE[i], e.npc)
        if (damage) {
            nE[i].damage(damage)
            nE[i].knockback(1, GetAngleTowardsEntity(e.npc, nE[i]))
            nE[i].setMotionY(.5)
        }
    }
    e.npc.world.playSoundAt(e.npc.pos, "customnpcs:misc.swosh", 1, .2)
    if (e.npc.getMotionY() > 0.3) {
        doSpinAttackStun(e)
    }
}


function doSpinAttackStun(e) {
    e.npc.getModelData().setWidth(2)
    e.npc.getModelData().setHeight(1)
    e.npc.updateClient()
    e.npc.timers.stop(id("spin_attack_loop"))
    e.npc.timers.stop(id("spin_end"))
    e.npc.timers.stop(id("spin_attack_chance"))
    e.npc.timers.stop(id("checkDistanceToTarget"))
    e.npc.timers.start(id("checkForOnGround"), 0, true)
    e.npc.timers.stop(id("movementDecision"))
    e.npc.tempdata.put("anim", e.API.createAnimBuilder())
    e.npc.syncAnimationsForAll(e.npc.tempdata.get("anim").playOnce("animation.scythe_fall").playAndHold("animation.scythe_stunned"))
    isSpinAttacking = false

}


function endStun(e) {
    e.npc.timers.forceStart(id("decide_attack"), 20, false)
    e.npc.ai.setWalkingSpeed(7)
    e.npc.syncAnimationsForAll(e.API.createAnimBuilder().clearAnimations().playOnce("animation.walk"))
    e.npc.getModelData().setWidth(.7)
    e.npc.getModelData().setHeight(2)
    e.npc.updateClient()
    e.npc.timers.forceStart(id("movementDecision"), getRandomInt(20, 60), false)
}

function startAttackDuration(e, duration) {
    e.npc.timers.forceStart(id("attack_end"), duration, false)
}











function makeMovementDecision(e) {
    if (!e.npc.getAttackTarget()) return
    if (isSpinAttacking) return
    e.npc.timers.forceStart(id("movementDecision"), getRandomInt(20, 60), false)
    var distanceToTarget = e.npc.getAttackTarget().pos.distanceTo(e.npc.pos)
    if (distanceToTarget < 3) {
        var chance = getRandomInt(0, 100)
        if (chance > 60 / distanceToTarget && !isAttacking) {
            e.npc.knockback(1, e.npc.rotation - 180)
        }
        return
    }
    else {
        e.npc.ai.setWalkingSpeed(7)
    }
    var movement_chance = getRandomFloat(-0.5, 0.5)
    e.npc.setMoveStrafing(movement_chance)

}