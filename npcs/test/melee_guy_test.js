var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(API.getLevelDir() + "/scripts/ecmascript/npcs/boiler/animated_attacker_functions.js");
load(API.getLevelDir() + "/scripts/ecmascript/boiler/proper_damage.js");
load(API.getLevelDir() + "/scripts/ecmascript/boiler/commonFunctions.js");
load(API.getLevelDir() + "/scripts/ecmascript/boiler/id_generator.js");
var npc
var EntityType = Java.type("noppes.npcs.api.constants.EntitiesType");
var isSpinAttacking = false
var attacks = {

}

attack.upslash = {
    animation: "animation.scythe_upslash",
    damage: 2,
    range: 2,
    cone: 120,
    duration: 20
}

attack.slash = {
    animation: "animation.scythe.slash",
    damage: 2,
    range: 1.5,
    cone: 120,
    duration: 15
}

attack.spin = {
    animation: "animation.scythe.spin",
    damage: 2,
    range: 1,
    duration: 60
}


var isAttacking = false

function init(e) {
    npc = e.npc
    e.npc.timers.stop(id("spin_attack_chance"))
    e.npc.timers.stop(id("spin_attack_loop"))
    if (e.npc.storeddata.has("spin_angle")) {
        e.npc.tempdata.put("spin_angle", JSON.parse(e.npc.storeddata.get("spin_angle")))
    }
}
/**
 * @param {NpcEvent.DamagedEvent} e
 */
function damaged(e) {
    if (isSpinAttacking) {
        e.setCanceled(true)
        return
    }
    if (getRandomInt(0, 100) < 50 && canSeeEntity(e, e.npc, e.source, 180) && !isAttacking) {
        e.npc.syncAnimationsForAll(e.API.createAnimBuilder().playOnce("animation.block"))
        e.setCanceled(true)
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:item.shield.block", .7, 1)
        e.npc.world.playSoundAt(e.npc.pos, "quark:entity.pickarang.clank", .7, .7)
    }
}




function target(e) {
    e.npc.timers.forceStart(id("checkDistanceToTarget"), 20, true)
    e.npc.timers.forceStart(id("spin_attack_chance"), getRandomInt(20, 140), false)
    e.npc.timers.forceStart(id("movementDecision"), getRandomInt(20, 60), false)
}

function targetLost(e) {
    e.npc.timers.stop(id("checkDistanceToTarget"))
    e.npc.timers.stop(id("spin_attack_chance"))
    e.npc.timers.stop(id("movementDecision"))
    e.npc.setMoveStrafing(0)
}

function startAttackDuration(e, duration) {
    e.npc.timers.forceStart(id("attack_end"), duration, false)
}


/**
 * @param {NpcEvent.TimerEvent} e
 */

function makeMovementDecision(e) {
    if (!e.npc.getAttackTarget()) return
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





function timer(e) {
    switch (e.id) {
        case id("attack_end"):
            isAttacking = false
            e.npc.ai.setWalkingSpeed(7)
            break;
        case id("movementDecision"):
            makeMovementDecision(e)
            break;
        case id("spin_attack_chance"):
            e.npc.timers.forceStart(id("spin_attack_chance"), getRandomInt(20, 140), false)
            if (isAttacking) return
            if (!e.npc.getAttackTarget()) return
            if (getRandomFloat(0, 100) > 40) {
                isAttacking = true
                startAttackDuration(e, spin.duration)
                playAnim("animation.scythe.spin")
                e.npc.timers.forceStart(id("spin_attack_loop"), 3, true)
                e.npc.timers.forceStart(id("spin_end"), spin.duration, false)
                e.npc.ai.setWalkingSpeed(0)
                var d = FrontVectors(e.npc, GetAngleTowardsEntity(e.npc, e.npc.getAttackTarget()), 0, .7, 0)
                e.npc.tempdata.put("spin_angle", d)
                e.npc.storeddata.put("spin_angle", JSON.stringify(d))
                isAttacking = true
                isSpinAttacking = true
            }
            break;
        case id("spin_attack_loop"):
            if (getRandomInt(0, 100) < 20 && e.npc.getAttackTarget()) {
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
                    nE[i].knockback(2, GetAngleTowardsEntity(e.npc, nE[i]))
                    nE[i].setMotionY(.5)
                }
            }

            e.npc.world.playSoundAt(e.npc.pos, "customnpcs:misc.swosh", 1, .2)
            if (e.npc.getMotionY() > 0.2) {
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
            break;
        case id("checkForOnGround"):
            if (e.npc.getMCEntity().m_20096_()) {
                e.npc.timers.stop(id("checkForOnGround"))
                e.npc.timers.start(id("stunned"), 120, false)
            }
            break;
        case id("stunned"):
            e.npc.timers.forceStart(id("checkDistanceToTarget"), 20, true)
            e.npc.ai.setWalkingSpeed(7)
            e.npc.syncAnimationsForAll(e.npc.tempdata.get("anim").clearAnimations().playOnce("animation.walk"))
            e.npc.timers.forceStart(id("spin_attack_chance"), getRandomInt(20, 140), false)
            e.npc.getModelData().setWidth(.7)
            e.npc.getModelData().setHeight(2)
            e.npc.updateClient()
            e.npc.timers.forceStart(id("movementDecision"), getRandomInt(20, 60), false)
            break;
        case id("spin_end"):
            e.npc.timers.stop(id("spin_attack_loop"))
            e.npc.ai.setWalkingSpeed(7)
            if (e.npc.getAttackTarget()) {
                e.npc.timers.forceStart(id("spin_attack_chance"), getRandomInt(20, 140), false)
            }
            e.npc.storeddata.remove("spin_angle")
            isSpinAttacking = false
            break;
        case id("checkDistanceToTarget"):
            if (isAttacking) return
            var attack_chance = getRandomInt(0, 100)
            if (!e.npc.getAttackTarget() || e.npc.pos.distanceTo(e.npc.getAttackTarget().pos) > e.npc.getStats().getMelee().getRange()) return
            if (attack_chance < 30) {
                playAnim("animation.scythe_upslash")
                e.npc.timers.start(id("upslash_hitbox"), 8, false)
                startAttackDuration(e, upslash.duration)
            }
            if (attack_chance >= 30) {
                playAnim("animation.scythe.slash")
                e.npc.timers.start(id("slash_hitbox"), 3, false)
                startAttackDuration(e, slash.duration)
            }
            isAttacking = true
            break;
        case id("slash_hitbox"):
            if (!e.npc.getAttackTarget()) return
            var distance = TrueDistanceCoord(e.npc.x, e.npc.y, e.npc.z, e.npc.getAttackTarget().x, e.npc.getAttackTarget().y, e.npc.getAttackTarget().z)
            if (distance < slash.range && canSeeEntity(e, e.npc, e.npc.getAttackTarget(), slash.cone)) {

                var damage = calculateDamage(slash.damage, e.npc.getAttackTarget(), e.npc)

                if (damage) {
                    e.npc.getAttackTarget().damage(damage)
                    e.npc.getAttackTarget().knockback(1, GetAngleTowardsEntity(e.npc, e.npc.getAttackTarget()))
                }
            }
            break;
        case id("upslash_hitbox"):
            if (!e.npc.getAttackTarget()) return
            var distance = TrueDistanceCoord(e.npc.x, e.npc.y, e.npc.z, e.npc.getAttackTarget().x, e.npc.getAttackTarget().y, e.npc.getAttackTarget().z)
            if (distance < upslash.range && canSeeEntity(e, e.npc, e.npc.getAttackTarget(), upslash.cone)) {

                var damage = calculateDamage(upslash.damage, e.npc.getAttackTarget(), e.npc)

                if (damage) {
                    e.npc.getAttackTarget().damage(damage)
                    e.npc.getAttackTarget().setMotionY(.7)
                }
            }
    }
}


