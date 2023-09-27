var ATTACK_TIMER = 1
var ACTIVATE_HITBOX_TIMER = 2
var ATTACK_FINISHED_TIMER = 3
var ANIMATION_FINISHED_TIMER = 5
var COBMAT_MOVEMENT_TIMER = 4

function timer(e) {
    switch (e.id) {
        case ATTACK_TIMER:
            attack(e)
            break;
        case ACTIVATE_HITBOX_TIMER:
            activateDamageHitbox(e)
            break;
        case ATTACK_FINISHED_TIMER:
            finishAttack(e)
            break;
        case COBMAT_MOVEMENT_TIMER:
            chooseCombatMovement(e)
            break;
        default:
            additionalTimer(e)
    }
}


function disableRegularAttacks(e) {
    e.npc.stats.getMelee().setDelay(72000)
    e.npc.stats.ranged.setDelay(72000, 72000)
    e.npc.stats.ranged.setAccuracy(0)
    e.npc.stats.ranged.setRange(0)
    e.npc.inventory.setProjectile(e.npc.world.createItem("minecraft:scute", 1))
}

function registerAttacks(attacks) {
    for (var attack in attacks) {
        for (var i = 0; i < attacks[attack].weighted_chance; i++) {
            attacks_by_weight.push(attacks[attack])

        }
    }
}

function chooseAttack(e) {
    if (attacks_by_weight.length = []) {
        registerAttacks(attacks_to_register)
    }
    return attacks_by_weight[getRandomInt(0, attacks_by_weight.length)]
}

function canAttack(e) {
    if (!e.npc.storeddata.get("notRunning")) { return false }
    if (hasInvalidTag(e)) { return false }
    if (e.npc.storeddata.has("paralyzed")) { return false }

    return true
}

function hasInvalidTag(e) {
    for (var tag in no_attack_tags) {
        if (e.npc.hasTag(no_attack_tags[tag])) { return true }
    }
}

function isTargetValid(e, entity, current_attack) {
    if (entity.type == 7 || entity.type == 6 || entity.type == 10 || entity.type == 11 || entity.type == 0 || entity.type == 4) {
        return false
    }
    if (entity == e.npc) {
        return false
    }
    if (entity.type == 2 && entity.getFaction() == e.npc.getFaction()) {
        return false
    }
    if (!canSeeEntity(e, e.npc, entity, current_attack.hitbox_cone)) {
        return false
    }
    if (entity.pos.distanceTo(e.npc.pos) > current_attack.hitbox_size) {
        return false
    }
    return true
}

function target(e) {
    if (hasInvalidTag(e)) { return }
    e.npc.timers.forceStart(ATTACK_TIMER, getRandomInt(min_attack_time, max_attack_time), false)
    e.npc.timers.forceStart(COBMAT_MOVEMENT_TIMER, getRandomInt(min_movement_time, max_movement_time), false)
    additionalTargetFunctions(e)

}

function targetLost(e) {
    if (hasInvalidTag(e)) { return }
    e.npc.setMoveStrafing(0)
    e.npc.timers.stop(COBMAT_MOVEMENT_TIMER)
    additionalTargetLostFunctions(e)
}



function activateDamageHitbox(e) {
    var current_attack = JSON.parse(e.npc.storeddata.get("current_attack"))
    var nE = e.npc.world.getNearbyEntities(e.npc.pos, current_attack.attack_range, -1)
    var damage = current_attack.additional_damage += e.npc.stats.melee.strength
    if (getRandomFloat(0, 100) < current_attack.crit_chance) {
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.player.big_fall", .7, .8)
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.goat.ram_impact", .7, .8)
        damage *= 2
    }
    for (var entity in nE) {
        if (isTargetValid(e, nE[entity], current_attack)) {
            if (nE[entity].getMCEntity().m_21254_() && canSeeEntity(e, nE[entity], e.npc, 150)) {
                e.npc.world.playSoundAt(e.npc.pos, "minecraft:item.shield.block", 1, Math.random() + .4)
                nE[entity].getOffhandItem().setDamage(nE[entity].getOffhandItem().getDamage() + e.npc.stats.melee.strength / 2)
                e.npc.knockback(1, nE[entity].rotation)
                nE[entity].knockback(1, e.npc.rotation)

                continue

            }

            nE[entity].damage(damage)
            var knockback_motion = frontVectors(nE[entity], current_attack.horizontal_knockback_direction, current_attack.vertical_knockback_direction, current_attack.knockback_power)
            nE[entity].setMotionX(knockback_motion[0])
            nE[entity].setMotionZ(knockback_motion[2])
            if (nE[entity].getAttackTarget() == null) {
                nE[entity].setAttackTarget(e.npc)
            }

        }
    }
}

function attack(e) {
    var attack = chooseAttack(e)
    if (e.npc.getAttackTarget() == null) {
        return
    }
    if (attack.attack_range < e.npc.pos.distanceTo(e.npc.getAttackTarget().pos) || !canAttack(e)) {
        e.npc.timers.forceStart(ATTACK_TIMER, getRandomInt(min_attack_time, max_attack_time), false)
        return
    }
    e.npc.storeddata.put("current_attack", JSON.stringify(attack))
    setNBTPuppetMode(e.npc, true)
    e.npc.timers.forceStart(ACTIVATE_HITBOX_TIMER, attack.hitbox_time, false)
    e.npc.timers.forceStart(ANIMATION_FINISHED_TIMER, attack.animation_time, false)
    e.npc.timers.forceStart(ATTACK_FINISHED_TIMER, attack.attack_time, false)
    for (var timers in attack.additional_timers) {
        e.npc.timers.forceStart(attack.additional_timers[timers].id, attack.additional_timers[timers].time, attack.additional_timers[timers].repeat)
    }
    for (var tag in attack.tags) {
        e.npc.addTag(attack.tags[tag])
    }
    runAnimation(attack.animation, e.npc, 50)
}

function finishAttack(e) {
    setNBTPuppetMode(e.npc, false)
    e.npc.timers.forceStart(ATTACK_TIMER, getRandomInt(min_attack_time, max_attack_time), false)
    e.npc.timers.forceStart(COBMAT_MOVEMENT_TIMER, getRandomInt(min_movement_time, max_movement_time), false)
    e.npc.getStoreddata().put("notRunning", 1);
    e.npc.ai.setWalkingSpeed(5)
    e.npc.ai.setRetaliateType(0)
    e.npc.timers.stop(SPINNING_TIMER)
    e.npc.timers.stop(SPIN_SOUND_TIMER)
    additionalFinishAttackFunctions(e)
}




function died(e) {
    e.npc.timers.stop(ATTACK_FINISHED_TIMER)
    e.npc.timers.stop(SPINNING_TIMER)
    e.npc.timers.stop(ACTIVATE_HITBOX_TIMER)
    e.npc.timers.stop(ATTACK_TIMER)
    e.npc.timers.stop(COBMAT_MOVEMENT_TIMER)
    e.npc.setAttackTarget(null)
    additionalDiedFunctions(e)
}