//Main Script

var Thread = Java.type("java.lang.Thread");
var NpcAPI = Java.type("noppes.npcs.api.NpcAPI").Instance();
/////////

var grabbingItem = false
var targetItem

var ATTACK_TIMER = 1
var ATTACK_DAMAGE_TIMER = 2
var ATTACK_FINISHED_TIMER = 3
var COBMAT_MOVEMENT_TIMER = 4
var THROW_ITEM_TIMER = 5

var min_attack_time = 7
var max_attack_time = 8
var animation_duration = 20
var hitbox_time = 4
var min_movement_time = 20
var max_movement_time = 25
var combat_movement_speed = .45
var hitbox_size = 2
var hitbox_range = 3

var attack_range = 3
var base_respawn = 150

var blocking = false
var npc
var wasBurning = false

var both_arms = {
    action_raise: { head: { id: 0, time: .2, a: [0, 0, 0], end: [187, 180, 180], }, left_arm: { id: 1, time: .2, a: [0, 0, 0], end: [146, 158, 43], }, right_arm: { id: 2, time: .2, a: [0, 0, 0], end: [135, 259, 273], } },
    action_swing: { head: { id: 0, time: .1, a: [0, 0, 0], end: [166, 177, 180], }, left_arm: { id: 1, time: .1, a: [0, 0, 0], end: [92, 193, 76], }, right_arm: { id: 2, time: .1, a: [0, 0, 0], end: [94, 171, 174], } },
    action_normal: { head: { id: 0, time: .8, a: [0, 0, 0], end: [185, 181, 180], }, left_arm: { id: 1, time: .8, a: [0, 0, 0], end: [184, 176, 180], }, right_arm: { id: 2, time: .8, a: [0, 0, 0], end: [182, 181, 182], }, }

}

var swing_left = {

    action_raise_left: { head: { id: 0, time: .2, a: [0, 0, 0], end: [134, 150, 185], }, left_arm: { id: 1, time: .2, a: [0, 0, 0], end: [0, 160, 231], }, right_arm: { id: 2, time: .2, a: [0, 0, 0], end: [196, 160, 201], }, },
    action_swing1: { head: { id: 0, time: .13, a: [0, 0, 0], end: [189, 186, 178], }, left_arm: { id: 1, time: .13, a: [0, 0, 0], end: [169, 184, 226], }, right_arm: { id: 2, time: .13, a: [0, 0, 0], end: [198, 180, 180], }, },

    action_normal: { head: { id: 0, time: .2, a: [0, 0, 0], end: [180, 180, 180], }, left_arm: { id: 1, time: .2, a: [0, 0, 0], end: [180, 180, 180], }, right_arm: { id: 2, time: .2, a: [0, 0, 0], end: [180, 180, 180], }, }
}

var swing_right = {
    action_raise: { head: { id: 0, time: .2, a: [0, 0, 0], end: [132, 221, 154], }, left_arm: { id: 1, time: .2, a: [0, 0, 0], end: [185, 167, 160], }, right_arm: { id: 2, time: .2, a: [0, 0, 0], end: [7, 182, 147], }, },
    action_swing: { head: { id: 0, time: .13, a: [0, 0, 0], end: [191, 188, 185], }, left_arm: { id: 1, time: .13, a: [0, 0, 0], end: [180, 180, 180], }, right_arm: { id: 2, time: .13, a: [0, 0, 0], end: [154, 179, 141], }, },

    action_normal: { head: { id: 0, time: .2, a: [0, 0, 0], end: [180, 180, 180], }, left_arm: { id: 1, time: .4, a: [0, 0, 0], end: [180, 180, 180], }, right_arm: { id: 2, time: .2, a: [0, 0, 0], end: [180, 180, 180], }, }
}

var throw_right = {
    action_raise: { head: { id: 0, time: .3, a: [0, 0, 0], end: [157, 199, 180], }, left_arm: { id: 1, time: .3, a: [0, 0, 0], end: [180, 180, 180], }, right_arm: { id: 2, time: .3, a: [0, 0, 0], end: [138, 301, 263], }, },
    action_throw: { head: { id: 0, time: .2, a: [0, 0, 0], end: [185, 159, 187], }, left_arm: { id: 1, time: .2, a: [0, 0, 0], end: [195, 188, 178], }, right_arm: { id: 2, time: .2, a: [0, 0, 0], end: [81, 144, 245], }, },
    action_normal: { head: { id: 0, time: .3, a: [0, 0, 0], end: [180, 180, 180], }, left_arm: { id: 1, time: .3, a: [0, 0, 0], end: [180, 178, 181], }, right_arm: { id: 2, time: .3, a: [0, 0, 0], end: [180, 180, 180], }, }
}

var throw_left = {
    action_raise: { head: { id: 0, time: .2, a: [0, 0, 0], end: [143, 159, 187], }, left_arm: { id: 1, time: .2, a: [0, 0, 0], end: [13, 129, 193], }, right_arm: { id: 2, time: .2, a: [0, 0, 0], end: [180, 180, 180], }, },
    action_throw: { head: { id: 0, time: .2, a: [0, 0, 0], end: [193, 195, 187], }, left_arm: { id: 1, time: .2, a: [0, 0, 0], end: [78, 200, 107], }, right_arm: { id: 2, time: .2, a: [0, 0, 0], end: [180, 180, 180], }, },
    action_normal: { head: { id: 0, time: .3, a: [0, 0, 0], end: [180, 180, 180], }, left_arm: { id: 1, time: .3, a: [0, 0, 0], end: [180, 178, 181], }, right_arm: { id: 2, time: .3, a: [0, 0, 0], end: [180, 180, 180], }, }
}


function init(e) {
    var pnbt = e.npc.getEntityNbt()
    pnbt.setByte("PuppetStanding", 0)
    pnbt.setByte("PuppetAttacking", 0)
    pnbt.setByte("PuppetMoving", 0)
    e.npc.setEntityNbt(pnbt)
    e.npc.updateClient()
    base_respawn = 150
    e.npc.getStoreddata().put("notRunning", 1);
    e.npc.ai.setWalkingSpeed(5)

    if (!e.npc.storeddata.has("immolated_chance")) {
        e.npc.storeddata.put("immolated_chance", 0)
        e.npc.storeddata.put("isImmolated", 0)
    }
    if (e.npc.storeddata.get("isImmolated") == 1) {
        min_attack_time = 6
        max_attack_time = 10
        min_movement_time = 2
        max_movement_time = 8
        combat_movement_speed = .7
        base_respawn = 70
        e.npc.ai.setWalkingSpeed(6)
        e.npc.setMaxHealth(40)
    }
    e.npc.storeddata.put("min_attack_time", min_attack_time)
    e.npc.storeddata.put("max_attack_time", max_attack_time)
    e.npc.storeddata.put("min_movement_time", min_movement_time)
    e.npc.storeddata.put("max_movement_time", max_movement_time)
    e.npc.storeddata.put("combat_movement_speed", combat_movement_speed)
    e.npc.storeddata.put("respawn_time", base_respawn)
    e.npc.storeddata.put("damage", e.npc.stats.melee.getStrength())
    disableRegularAttacks(e)
    e.npc.timers.stop(ATTACK_DAMAGE_TIMER)


}

function disableRegularAttacks(e) {
    e.npc.stats.getMelee().setDelay(72000)
    e.npc.stats.ranged.setDelay(72000, 72000)
    e.npc.stats.ranged.setAccuracy(0)
    e.npc.stats.ranged.setRange(0)
    e.npc.inventory.setProjectile(e.npc.world.createItem("minecraft:scute", 1))
}

function tick(e) {
    if (e.npc.isBurning()) {
        wasBurning = true
    }
    else {
        wasBurning = false
    }
    if (e.npc.storeddata.get("isImmolated")) {
        e.npc.executeCommand("/particle minecraft:smoke ~ ~1 ~ .3 .5 .2 .01 10")
    }
    if (e.npc.tempdata.has("getItem")) {
        e.npc.ai.setRetaliateType(3)
        if (!e.npc.tempdata.get("getItem").isAlive()) {

            e.npc.timers.forceStart(ATTACK_TIMER, 20, false)
            e.npc.ai.setRetaliateType(0)
            e.npc.tempdata.remove("getItem")
            return
        }
        if (e.npc.pos.distanceTo(e.npc.tempdata.get("getItem").pos) < 2) {
            if (getRandomInt(0, 10) > 5) {
                e.npc.setMainhandItem(e.npc.tempdata.get("getItem").getItem())
            }
            else {
                e.npc.setOffhandItem(e.npc.tempdata.get("getItem").getItem())
            }
            e.npc.timers.forceStart(ATTACK_TIMER, 5, false)
            e.npc.timers.forceStart(COBMAT_MOVEMENT_TIMER, 5, false)
            e.npc.ai.setRetaliateType(0)
            e.npc.tempdata.get("getItem").despawn()
            e.npc.tempdata.remove("getItem")
            return
        }
        e.npc.navigateTo(e.npc.tempdata.get("getItem").x, e.npc.tempdata.get("getItem").y, e.npc.tempdata.get("getItem").z, 2)


    }
    if (e.npc.getAttackTarget() != null && e.npc.getAttackTarget().pos.distanceTo(e.npc.pos) < 1 && getRandomInt(0, 10) < 5) {
        e.npc.knockback(-1, e.npc.rotation)
        e.npc.setMoveForward(-1)
    }
}

function chooseCombatMovement(e) {
    if (e.npc.getAttackTarget() == null) {
        e.npc.timers.stop(4)
        return
    }
    if (e.npc.getAttackTarget().pos.distanceTo(e.npc.pos) < 3 || grabbingItem == false && !e.npc.storeddata.has("paralyzed")) {
        if (Math.random() < .3) {
            e.npc.setMoveForward(-e.npc.storeddata.get("combat_movement_speed"))
        }

        if (Math.random() < .4) {
            e.npc.setMoveStrafing(e.npc.storeddata.get("combat_movement_speed"))
            e.npc.setMoveForward(0)

        }
        else if (Math.random() < .4) {
            e.npc.setMoveStrafing(-e.npc.storeddata.get("combat_movement_speed"))
            e.npc.setMoveForward(0)

        }
        if (Math.random() < .4) {
            e.npc.setMoveStrafing(0)
        }

    }
    e.npc.timers.forceStart(COBMAT_MOVEMENT_TIMER, getRandomInt(e.npc.storeddata.get("min_movement_time"), e.npc.storeddata.get("max_movement_time")), false)
}

function timer(e) {
    if (e.id == ATTACK_TIMER) {
        attemptAttack(e)
    }

    if (e.id == ATTACK_DAMAGE_TIMER) {
        activateDamageHitbox(e)
    }

    if (e.id == ATTACK_FINISHED_TIMER) {
        finishAttack(e)
    }
    if (e.id == COBMAT_MOVEMENT_TIMER) {
        chooseCombatMovement(e)
    }
    if (e.id == THROW_ITEM_TIMER) {
        throwItem(e)

    }
}

function throwItem(e) {
    var thrownItem
    if (e.npc.getMainhandItem().name != "minecraft:air") {
        thrownItem = e.npc.getMainhandItem()
        e.npc.setMainhandItem(e.npc.world.createItem("minecraft:air", 1))
    }
    if (e.npc.getOffhandItem().name != "minecraft:air") {
        thrownItem = e.npc.getOffhandItem()
        e.npc.setOffhandItem(e.npc.world.createItem("minecraft:air", 1))
    }
    e.npc.stats.ranged.setStrength(thrownItem.getAttackDamage() + 2)
    e.npc.shootItem(e.npc.getAttackTarget(), thrownItem, 50).enableEvents()
    e.npc.world.playSoundAt(e.npc.pos, "customnpcs:misc.swosh", 1, getRandomFloat(0.3, 1.2))

}

function projectileImpact(e) {
    e.projectile.dropItem(e.projectile.item)
}

function attemptAttack(e) {
    if (e.npc.getAttackTarget() == null) {
        return
    }
    var canThrowItem = false
    var canPickupItem = false
    var possibleTargets = []
    var animation
    if (e.npc.getAttackTarget().pos.distanceTo(e.npc.pos) > 5 && (e.npc.getMainhandItem().name != "minecraft:air" || e.npc.getOffhandItem().name != "minecraft:air")) { canThrowItem = true }
    if (!canThrowItem) {
        var items = e.npc.world.getNearbyEntities(e.npc.pos, 12, 6)
        if (items.length > 0) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].getItem().getAttackDamage() >= 2 && items[i].getPickupDelay() > 0) { possibleTargets.push(items[i]) }
            }
            canPickupItem = true
        }

    }
    var chance = getRandomFloat(0, 100)
    // e.npc.say(chance)

    e.npc.updateClient()
    if (e.npc.storeddata.has("paralyzed")) {
        e.npc.timers.forceStart(ATTACK_TIMER, 5, false)
        return
    }
    if (chance < 25 && (canPickupItem || canThrowItem)) {
        if (canPickupItem) {
            var pnbt = e.npc.getEntityNbt()
            e.npc.tempdata.put("getItem", items[0])
            return
        }
        if (canThrowItem) {
            var pnbt = e.npc.getEntityNbt()
            pnbt.setByte("PuppetStanding", 1)
            pnbt.setByte("PuppetAttacking", 1)
            pnbt.setByte("PuppetMoving", 1)
            e.npc.setEntityNbt(pnbt)
            e.npc.updateClient()
            if (e.npc.getMainhandItem().name != "minecraft:air") { animation = throw_right }
            if (e.npc.getOffhandItem().name != "minecraft:air") { animation = throw_left }
            runAnimation(animation, e.npc, 50);
            e.npc.timers.start(THROW_ITEM_TIMER, 6, false)
            e.npc.timers.forceStart(ATTACK_TIMER, getRandomInt(e.npc.storeddata.get("min_attack_time"), e.npc.storeddata.get("max_attack_time")), false)
            e.npc.timers.forceStart(ATTACK_FINISHED_TIMER, 13, false)
        }

    }
    else if (e.npc.pos.distanceTo(e.npc.getAttackTarget().pos) < attack_range && e.npc.storeddata.get("notRunning")) {
        var pnbt = e.npc.getEntityNbt()
        pnbt.setByte("PuppetStanding", 1)
        pnbt.setByte("PuppetAttacking", 1)
        pnbt.setByte("PuppetMoving", 1)
        e.npc.setEntityNbt(pnbt)
        e.npc.updateClient()
        var damage = e.npc.stats.melee.getStrength()

        if (chance <= 33) {
            e.npc.addTag("crit")
            animation = both_arms
            damage *= 2
            damage += e.npc.getMainhandItem().getAttackDamage()
            damage += e.npc.getOffhandItem().getAttackDamage()
            e.npc.world.playSoundAt(e.npc.pos, "customnpcs:misc.swosh", 1, 0.01)

        }
        if (chance > 33 && chance <= 66) {
            animation = swing_right
            damage += e.npc.getMainhandItem().getAttackDamage()
            e.npc.world.playSoundAt(e.npc.pos, "customnpcs:misc.swosh", 1, getRandomFloat(0.8, 1.2))
        }
        if (chance > 66) {
            animation = swing_left
            damage += e.npc.getOffhandItem().getAttackDamage()
            e.npc.world.playSoundAt(e.npc.pos, "customnpcs:misc.swosh", 1, getRandomFloat(0.8, 1.2))
        }
        if (e.npc.storeddata.get("isImmolated")) {
            damage += 5
        }

        blocking = false
        e.npc.getStoreddata().put("notRunning", 0);
        e.npc.storeddata.put("damage", damage)


        runAnimation(animation, e.npc, 50);
        e.npc.timers.forceStart(ATTACK_DAMAGE_TIMER, hitbox_time, false)
        e.npc.timers.forceStart(ATTACK_FINISHED_TIMER, 20, false)
        e.npc.ai.setWalkingSpeed(2)
    }
    else {
        e.npc.timers.start(ATTACK_TIMER, 3, false)
    }


}

function activateDamageHitbox(e) {

    var nE = e.npc.world.getNearbyEntities(e.npc.pos, hitbox_size, -1)
    for (var entity in nE) {
        var validTarget = true
        if (nE[entity].type == 7 || nE[entity].type == 6 || nE[entity].type == 10) {
            validTarget = false
        }
        if (nE[entity] == e.npc) {
            validTarget = false

        }
        if (nE[entity].type == 2 && nE[entity].getFaction() == e.npc.getFaction()) {
            validTarget = false
        }
        if (!canSeeEntity(e, e.npc, nE[entity], 120)) {
            validTarget = false
        }
        if (nE[entity].pos.distanceTo(e.npc.pos) > hitbox_range) {
            validTarget = false
        }
        if (validTarget && nE[entity].getMCEntity().m_21254_() && canSeeEntity(e, nE[entity], e.npc, 150)) {
            e.npc.world.playSoundAt(e.npc.pos, "minecraft:item.shield.block", 1, Math.random() + .4)
            nE[entity].getOffhandItem().setDamage(nE[entity].getOffhandItem().getDamage() + e.npc.storeddata.get("damage") / 2)
            e.npc.knockback(1, nE[entity].rotation)
            validTarget = false
        }

        if (validTarget) {
            if (e.npc.hasTag("crit")) {
                e.npc.removeTag("crit")
                e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.player.big_fall", .7, .8)
                e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.goat.ram_impact", .7, .8)

            }
            //nE[entity].addPotionEffect(7, 1, 0, false)
            nE[entity].damage(e.npc.storeddata.get("damage"))
            if (nE[entity].getAttackTarget() == null) {
                nE[entity].setAttackTarget(e.npc)
            }
            nE[entity].knockback(e.npc.stats.melee.getKnockback() + 1, e.npc.rotation)
            if (e.npc.storeddata.get("isImmolated")) {
                nE[entity].setBurning(70)
            }
            return

        }
    }
}


function finishAttack(e) {
    var pnbt = e.npc.getEntityNbt()
    pnbt.setByte("PuppetStanding", 0)
    pnbt.setByte("PuppetMoving", 0)
    pnbt.setByte("PuppetAttacking", 0)
    e.npc.setEntityNbt(pnbt)
    e.npc.updateClient()
    e.npc.timers.forceStart(ATTACK_TIMER, getRandomInt(min_attack_time, max_attack_time), false)
    e.npc.getStoreddata().put("notRunning", 1);
    e.npc.ai.setWalkingSpeed(4)
}


function target(e) {
    e.npc.timers.forceStart(ATTACK_TIMER, getRandomInt(min_attack_time, max_attack_time), false)
    e.npc.timers.forceStart(COBMAT_MOVEMENT_TIMER, getRandomInt(min_movement_time, max_movement_time), false)


}

function targetLoss(e) {
    e.npc.timers.stop(ATTACK_FINISHED_TIMER)
    e.npc.setMoveForward(0)
    e.npc.setMoveStrafing(0)
    e.npc.timers.stop(COBMAT_MOVEMENT_TIMER)
}

function damaged(e) {
    if (getRandomFloat(0, 100) > 5 && e.npc.tempdata.has("getItem")) {
        e.npc.tempdata.remove("getItem")
        e.npc.ai.setRetaliateType(0)
        e.npc.timers.forceStart(ATTACK_TIMER, 10, false)
        e.npc.timers.forceStart(COBMAT_MOVEMENT_TIMER, 20, false)
    }

    if (e.damageSource.type.indexOf("Fire") == -1) {
        e.npc.storeddata.put("respawn_time", e.npc.storeddata.get("respawn_time") - 15)
    }

    if (e.damage > e.npc.getMaxHealth()) {
        e.npc.storeddata.put("respawn_time", e.npc.storeddata.get("respawn_time") + 10 + (e.npc.getMaxHealth() - e.damage))
    }
}

function died(e) {
    e.npc.timers.stop(ATTACK_FINISHED_TIMER)
    e.npc.timers.stop(ATTACK_DAMAGE_TIMER)
    e.npc.timers.stop(ATTACK_TIMER)
    e.npc.timers.stop(COBMAT_MOVEMENT_TIMER)
    e.npc.timers.stop(THROW_ITEM_TIMER)
    e.npc.setAttackTarget(null)
    if (e.npc.storeddata.get("respawn_time") < 0) {
        e.npc.storeddata.put("respawn_time", 60)
    }
    e.npc.stats.setRespawnTime(e.npc.storeddata.get("respawn_time"))

    if (e.npc.isBurning() || e.npc.inFire() || wasBurning) {
        if (e.npc.storeddata.get("isImmolated") == 0 && getRandomInt(0, 100) > e.npc.storeddata.get("immolated_chance")) {
            e.npc.storeddata.put("immolated_chance", e.npc.storeddata.get("immolated_chance") + 25)
            e.npc.stats.setRespawnTime(e.npc.storeddata.get("respawn_time") * 2)
        }
        else {
            e.npc.storeddata.put("isImmolated", 1)
            e.npc.display.setSkinTexture("customnpcs:textures/entity/monstermale/flesh.png")
            e.npc.display.setTint(16753920)
            e.npc.display.setName("Immolated")
            e.npc.executeCommand("/particle minecraft:smoke ~ ~ ~ .5 .5 .5 .01 500")
            e.npc.world.playSoundAt(e.npc.pos, "minecraft:item.firecharge.use", 1, .2)
            e.npc.updateClient()
        }
    }
}


function interact(e) {
    if (!e.player.gamemode == 1 || !e.player.isSneaking()) {
        return
    }
    runAnimation(throw_left, e.npc, 50);
    e.npc.say("displaying animation")
    e.npc.say(e.npc.storeddata.get("immolated_chance"))
    runAnimation(actionList, npc, 30);
}



function runAnimation(acts, npc, rate, init_rotation) {

    npc.getStoreddata().put("notRunning", 0);
    var job = npc.getJob();
    if (job && job.getType() == 9) //job == 9 ?puppet
    {
        var MyThread = Java.extend(Thread, {

            run: function () {
                var last_rotation = {}; //record last act rotations
                var sleep_time = 1000 / rate;
                if (!init_rotation)
                    init_rotation = {};
                //do each action
                for (var i in acts) {

                    var act = acts[i];
                    //         log(act["head"].end[0]);
                    var start = {}; //store the action info
                    var act_count = 0;
                    //store action inital rotations
                    for (var j in act) {
                        var part = job.getPart(act[j].id);
                        start[j] = {};
                        if (last_rotation[j])
                            start[j].rotation = last_rotation[j].slice();
                        else if (init_rotation[j])
                            start[j].rotation = init_rotation[j].slice();
                        else
                            start[j].rotation = [part.getRotationX(), part.getRotationY(), part.getRotationZ()];

                        start[j].piece = [
                            (act[j].end[0] - start[j].rotation[0]) / rate / act[j].time,
                            (act[j].end[1] - start[j].rotation[1]) / rate / act[j].time,
                            (act[j].end[2] - start[j].rotation[2]) / rate / act[j].time
                        ];
                        act_count++;
                    }
                    var round_count = 0;
                    //do actions until all action done
                    while (act_count != 0) {
                        //do unfinished actions
                        for (var j in act) {
                            var a = act[j];
                            if (start[j]) {
                                var s = start[j];
                                s.rotation[0] = Near(s.rotation[0], Accelerate(s.piece[0], a.a[0], round_count), a.end[0]);
                                s.rotation[1] = Near(s.rotation[1], Accelerate(s.piece[1], a.a[1], round_count), a.end[1]);
                                s.rotation[2] = Near(s.rotation[2], Accelerate(s.piece[2], a.a[2], round_count), a.end[2]);
                                var part = job.getPart(a.id);
                                part.setRotation(s.rotation[0], s.rotation[1], s.rotation[2]);
                                //when rotation get to destination don't do it anymore
                                if (s.rotation[0] == a.end[0] && s.rotation[1] == a.end[1] && s.rotation[2] == a.end[2]) {
                                    last_rotation[j] = s.rotation.slice();
                                    start[j] = undefined;
                                    act_count--;
                                }
                            }
                        }
                        npc.updateClient();
                        round_count++;
                        Thread.sleep(sleep_time);
                    }
                }

            }
        });
        var th = new MyThread();
        th.start();





    }
}
/**
 * use specific piece, source approach to destination
 * @param {*} src source number
 * @param {*} piece
 * @param {*} dest destination number
 */
function Near(src, piece, dest) {
    if (src != dest) {
        if (src < dest)
            src = src + piece >= dest ? dest : src + piece;
        else if (src > dest)
            src = src + piece <= dest ? dest : src + piece;
    }
    if (src > 360)
        src = src - 360;
    else if (src < 0)
        src = 360 - src;
    return src;
}
/**
 * it means what it means
 * @param {*} speed
 * @param {*} a
 * @param {*} count
 */
function Accelerate(speed, a, count) {
    speed += a * count;
    if (speed > 0 && speed < 0.1)
        speed = 0.1;
    else if (speed < 0 && speed > -0.1)
        speed = -0.1;
    return speed;
}
//
function canSeeEntity(e, source, entity, cone) {
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