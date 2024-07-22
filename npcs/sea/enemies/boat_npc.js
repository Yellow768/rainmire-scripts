var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(API.getLevelDir() + "/scripts/ecmascript/boiler/commonFunctions.js");
load(API.getLevelDir() + "/scripts/ecmascript/boiler/id_generator.js");
load(API.getLevelDir() + "/scripts/ecmascript/boiler/proper_damage.js");


var boat, direction, rot, current_target

function init(e) {
    e.npc.timers.forceStart(id("apply_motion_to_boat"), 0, true)
    if (e.npc.inWater()) {
        for (var i = 0; i < 96; i++) {
            if (e.npc.world.getBlock(e.npc.pos.up(i)).name == "minecraft:air") {
                e.npc.setPos(e.npc.pos.up(i))
                i = 97
            }
        }
    }
    if (!e.npc.getMount()) {
        boat = e.npc.world.createEntity("boat")
        boat.pos = e.npc.pos
        boat.spawn()
        boat.addRider(e.npc)
        var nbt = boat.getEntityNbt()
        nbt.setByte("Invulnerable", 1)
        boat.setEntityNbt(nbt)
    }
}


function died(e) {
    if (e.npc.getMount()) e.npc.getMount().despawn()
}

function tick(e) {
    boat = e.npc.getMount()
    if (current_target != null && boat != null && TrueDistanceEntities(e.npc, current_target) > 2.5) {

        var angle = GetAngleTowardsEntity(boat, current_target)
        var d = FrontVectors(boat, angle, 0, e.npc.getAi().getWalkingSpeed() / 10, 0)
        boat.setMotionX(d[0])
        boat.setMotionZ(d[2])
        boat.rotation = angle

    }
    if (current_target == null && boat != null && direction != null) {
        boat.setMotionX(direction[0])
        boat.setMotionZ(direction[2])
        boat.rotation = rot
    }
    if (!current_target) {
        var nE = e.npc.world.getNearbyEntities(e.npc.pos, e.npc.getStats().getAggroRange(), 5)
        for (var i = 0; i < nE.length; i++) {
            if (nE[i].type == 2 && nE[i] != e.npc) {
                if (e.API.getFactions().get(2).hostileToNpc(nE[i])) {
                    current_target = nE[i]
                    e.npc.timers.forceStart(id("attempt_to_melee_attack"), 0, false)
                    return
                }
            }
            if (nE[i].type == 1 && nE[i].gamemode == 2) {
                if (e.API.getFactions().get(2).playerStatus(nE[i]) == -1) {
                    current_target = nE[i]
                    e.npc.timers.forceStart(id("attempt_to_melee_attack"), 0, false)
                    return
                }
            }
        }
    }
    if (current_target) {
        if (current_target.pos.distanceTo(e.npc.pos) > 20) {
            current_target = null
        }
        else if (current_target.type == 1 && current_target.gamemode == 1) {
            current_target = null
        }
        else if (!current_target.isAlive()) {
            current_target = null
        }

        if (!current_target) {
            e.npc.timers.stop(id("attempt_to_melee_attack"))
        }
    }
    if (!e.npc.getMount()) {
        e.npc.kill()
    }
}

function timer(e) {
    if (e.id == id("apply_motion_to_boat")) {
        if (current_target && e.npc.getMount()) {
            var angle = GetAngleTowardsEntity(e.npc, current_target)
            e.npc.getMount().rotation = angle
            e.npc.rotation = angle

        }
    }
    if (e.id == id("attempt_to_melee_attack") && e.npc.getMount()) {
        if (!current_target) {
            e.npc.timers.stop(id("attempt_to_melee_attack"))
            return
        }
        if (TrueDistanceEntities(e.npc.getMount(), current_target) < 2.7) {
            e.npc.playAnimation(0)

            if (canSeeEntity(e.npc.getMount(), current_target, 180) && TrueDistanceEntities(e.npc, current_target) <= 2.3) {
                current_target.damage(calculateDamage(e.npc.getStats().getMelee().getStrength(), current_target, e.npc, e.npc.getStats().getMelee().getKnockback() + 1))
            }
            e.npc.timers.forceStart(id("attempt_to_melee_attack"), e.npc.getStats().getMelee().getDelay(), false)
            return
        }
        e.npc.timers.forceStart(id("attempt_to_melee_attack"), 0, false)
    }
}

function projectileTick(e) {
    e.projectile.despawn()
}