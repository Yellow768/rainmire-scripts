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
upslash.range = 3
upslash.cone = 190
upslash.duration = 20
upslash.max_distance = 4
upslash.chance = 30
upslash.hitbox_delay = 8
upslash.start_func = function () { npc.timers.start(id("upslash_attack"), 8, false) }
upslash.hitbox_func = function () { npc.getAttackTarget().setMotionY(.7) }

var slash = new Attack()
slash.animation = "animation.scythe.slash"
slash.damage = 2
slash.range = 2
slash.cone = 190
slash.duration = 15
slash.max_distance = 4
slash.chance = 60
slash.start_func = function () { npc.timers.forceStart(id("slash_attack"), 6, false) }
slash.hitbox_func = function () { npc.getAttackTarget().knockback(1, GetAngleTowardsEntity(npc, npc.getAttackTarget())) }


var spin = new Attack()
spin.animation = "animation.scythe.spin"
spin.damage = 2
spin.range = 1
spin.duration = 60
spin.max_distance = 10
spin.chance = 20
spin.start_func = function (e) { attackSpin(e) }


var leap = new Attack()
leap.animation = "animation.scythe.leap_attack"
leap.damage = 4
leap.max_distance = 15
leap.min_distance = 2
leap.range = 2
leap.duration = 40
leap.max_range = 20
leap.chance = 20
leap.start_func = function () { npc.timers.forceStart(id("leap_attack_launch"), 8, false) }



function timer(e) {
    switch (e.id) {
        case id("decrease_block_counter"):
            block_counter -= 1
            if (block_counter < 1) block_counter = 1
            break;
        case id("decide_attack"):
            decideAttack(e)
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
                e.npc.timers.start(id("stunned"), 90, false)
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
        case id("slash_attack"):
            activateBasicHitbox(slash)
            break;
        case id("upslash_attack"):
            activateBasicHitbox(upslash)
            break;
        case id("leap_attack_launch"):
            if (!e.npc.getAttackTarget()) return
            var d = FrontVectors(e.npc, GetAngleTowardsEntity(e.npc, e.npc.getAttackTarget()), 0, getDistanceToTarget() / 6, 0)
            e.npc.setMotionY(.3)
            e.npc.setMotionX(d[0])
            e.npc.setMotionZ(d[2])
            e.npc.setMoveStrafing(0)
            e.npc.timers.stop(id("movementDecision"))
            e.npc.world.playSoundAt(e.npc.pos, "quark:entity.pickarang.clank", .2, .2)
            e.npc.world.playSoundAt(e.npc.pos, "customnpcs:misc.swosh", .7, .7)
            activateBasicHitbox(leap)
            break;
    }
}



var attacks = [leap, slash, upslash, spin]



var isAttacking = false

function init(e) {
    npc = e.npc
    e.npc.timers.stop(id("spin_attack_chance"))
    e.npc.timers.stop(id("spin_attack_loop"))
    e.npc.timers.stop(id("slash_hitbox"))
    e.npc.timers.stop(id("upslash_hitbox"))
    e.npc.timers.forceStart(id("decrease_block_counter"), 20, true)
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

var block_counter = 0
function damaged(e) {
    if (isSpinAttacking) {
        e.setCanceled(true)
        return

    }

    var chance_to_block = 80 + (10 * block_counter)

    if (chance_to_block > 90) chance_to_block = 90
    block_counter++
    if (e.source && getRandomInt(0, 100) < chance_to_block && canSeeEntity(e.npc, e.source, 200) && !isAttacking) {
        e.npc.syncAnimationsForAll(e.API.createAnimBuilder().playOnce("animation.block"))
        e.setCanceled(true)
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:item.shield.block", .7, 1)
        e.npc.world.playSoundAt(e.npc.pos, "quark:entity.pickarang.clank", .7, .7)
        e.npc.timers.forceStart(id("decide_attack"), 15, false)
    }
}




function attackSpin(e) {
    isAttacking = true
    startAttackDuration(e, spin.duration)
    playAnim("animation.scythe.spin")
    var d = FrontVectors(e.npc, GetAngleTowardsEntity(e.npc, e.npc.getAttackTarget()), 0, .7, 0)
    e.npc.tempdata.put("spin_angle", d)
    e.npc.storeddata.put("spin_angle", JSON.stringify(d))
    e.npc.timers.forceStart(id("spin_attack_loop"), 3, true)
    e.npc.timers.forceStart(id("spin_end"), spin.duration, false)
    e.npc.ai.setWalkingSpeed(0)
    isAttacking = true
    isSpinAttacking = true
}

function attackLeap(e) {
    playAnim("animation.scythe.leap_attack")
    e.npc.timers.start(id("leap_attack_launch"), 2, false)
}

function spinAttackMotion(e) {
    if (getRandomInt(0, 100) < 50 && e.npc.getAttackTarget()) {
        var d = FrontVectors(e.npc, GetAngleTowardsEntity(e.npc, e.npc.getAttackTarget()), 0, 1, 0)
        e.npc.tempdata.put("spin_angle", d)
    }
    e.npc.setMotionX(e.npc.tempdata.get("spin_angle")[0])
    e.npc.setMotionZ(e.npc.tempdata.get("spin_angle")[2])
    var nE = e.npc.world.getNearbyEntities(e.npc.pos, spin.range, EntityType.LIVING)
    for (var i = 0; i < nE.length; i++) {
        if (nE[i] == e.npc) continue
        var damage = calculateDamage(spin.damage, nE[i], e.npc)
        if (damage) {
            nE[i].damage(damage)
            nE[i].knockback(1, GetAngleTowardsEntity(e.npc, nE[i]))
            nE[i].setMotionY(.5)
        }
    }
    e.npc.world.playSoundAt(e.npc.pos, "customnpcs:misc.swosh", 1, .2)
    if (e.npc.getMotionY() > 0.4) {
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
    e.npc.timers.stop(id("decide_attack"))
    e.npc.timers.stop(id("attack_end"))
    e.npc.timers.forceStart(id("checkForOnGround"), 0, true)
    e.npc.timers.stop(id("movementDecision"))
    e.npc.tempdata.put("anim", e.API.createAnimBuilder())
    e.npc.syncAnimationsForAll(e.npc.tempdata.get("anim").playOnce("animation.scythe_fall").playAndHold("animation.scythe_stunned"))
    isSpinAttacking = false

}


function endStun(e) {
    isAttacking = false
    if (npc.isAlive()) {
        e.npc.timers.forceStart(id("decide_attack"), 20, false)
        e.npc.timers.forceStart(id("movementDecision"), getRandomInt(20, 60), false)
    }
    e.npc.ai.setWalkingSpeed(7)
    e.npc.syncAnimationsForAll(e.API.createAnimBuilder().clearAnimations().playOnce("animation.walk"))
    e.npc.getModelData().setWidth(.7)
    e.npc.getModelData().setHeight(2)
    e.npc.updateClient()

}









function died(e) {
    e.npc.timers.stop(id("decide_attack"))
    e.npc.timers.stop(id("movementDecision"))
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