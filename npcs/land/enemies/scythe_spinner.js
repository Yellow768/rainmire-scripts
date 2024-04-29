
//Main Script

var Thread = Java.type("java.lang.Thread");
var NpcAPI = Java.type("noppes.npcs.api.NpcAPI").Instance();
/////////

var grabbingItem = false
var targetItem, spinning

var ATTACK_TIMER = 1
var ATTACK_DAMAGE_TIMER = 2
var ATTACK_FINISHED_TIMER = 3
var COBMAT_MOVEMENT_TIMER = 4
var THROW_ITEM_TIMER = 5
var SPINNING_TIMER = 6
var SPIN_SOUND_TIMER = 7

var min_attack_time = 7
var max_attack_time = 8
var animation_duration = 20
var hitbox_time = 4
var min_movement_time = 20
var max_movement_time = 25
var combat_movement_speed = .45
var hitbox_size = 2
var hitbox_range = 3

var attack_range = 7
var base_respawn = 150

var blocking = false
var npc
var wasBurning = false

var horizontal_swing = { default: { time: 0.2, head: { id: 0, a: [0, 0, 0], end: [180, 180, 180] }, left_arm: { id: 1, a: [0, 0, 0], end: [180, 180, 180] }, right_arm: { id: 2, a: [0, 0, 0], end: [180, 180, 180] }, body: { id: 3, a: [0, 0, 0], end: [180, 180, 180] } }, raise: { time: 0.2, head: { id: 0, a: [0, 0, 0], end: [180, 184, 180] }, left_arm: { id: 1, a: [0, 0, 0], end: [128, 180, 180] }, right_arm: { id: 2, a: [0, 0, 0], end: [178, 175, 82] }, body: { id: 3, a: [0, 0, 0], end: [180, 177, 180] } }, swing: { time: 0.1, head: { id: 0, a: [0, 0, 0], end: [187, 180, 180] }, left_arm: { id: 1, a: [0, 0, 0], end: [206, 198, 157] }, right_arm: { id: 2, a: [0, 0, 0], end: [47, 210, 82] }, body: { id: 3, a: [0, 0, 0], end: [180, 201, 180] } }, swing_revel: { time: 0.5, head: { id: 0, a: [0, 0, 0], end: [187, 180, 180] }, left_arm: { id: 1, a: [0, 0, 0], end: [206, 198, 157] }, right_arm: { id: 2, a: [0, 0, 0], end: [47, 212, 82] }, body: { id: 3, a: [0, 0, 0], end: [180, 194, 180] } }, return: { time: 0.4, head: { id: 0, a: [0, 0, 0], end: [180, 180, 180] }, left_arm: { id: 1, a: [0, 0, 0], end: [180, 180, 180] }, right_arm: { id: 2, a: [0, 0, 0], end: [180, 180, 180] }, body: { id: 3, a: [0, 0, 0], end: [180, 180, 180] } } }
var spin = { default: { time: 0.2, head: { id: 0, a: [0, 0, 0], end: [180, 180, 180] }, left_arm: { id: 1, a: [0, 0, 0], end: [180, 180, 180] }, right_arm: { id: 2, a: [0, 0, 0], end: [180, 180, 180] }, body: { id: 3, a: [0, 0, 0], end: [180, 180, 180] } }, raise: { time: 0.2, head: { id: 0, a: [0, 0, 0], end: [180, 184, 180] }, left_arm: { id: 1, a: [0, 0, 0], end: [128, 180, 180] }, right_arm: { id: 2, a: [0, 0, 0], end: [178, 175, 82] }, body: { id: 3, a: [0, 0, 0], end: [180, 177, 180] } }, swing: { time: 0.1, head: { id: 0, a: [0, 0, 0], end: [187, 180, 180] }, left_arm: { id: 1, a: [0, 0, 0], end: [206, 198, 157] }, right_arm: { id: 2, a: [0, 0, 0], end: [47, 210, 82] }, body: { id: 3, a: [0, 0, 0], end: [180, 201, 180] } }, swing_revel: { time: 0.8, head: { id: 0, a: [0, 0, 0], end: [187, 180, 180] }, left_arm: { id: 1, a: [0, 0, 0], end: [206, 198, 157] }, right_arm: { id: 2, a: [0, 0, 0], end: [47, 212, 82] }, body: { id: 3, a: [0, 0, 0], end: [180, 194, 180] } }, return: { time: 0.4, head: { id: 0, a: [0, 0, 0], end: [180, 180, 180] }, left_arm: { id: 1, a: [0, 0, 0], end: [180, 180, 180] }, right_arm: { id: 2, a: [0, 0, 0], end: [180, 180, 180] }, body: { id: 3, a: [0, 0, 0], end: [180, 180, 180] } } }



function init(e) {
    if (e.npc.hasTag("spinning")) {
        return
    }
    var pnbt = e.npc.getEntityNbt()
    pnbt.setByte("PuppetStanding", 0)
    pnbt.setByte("PuppetAttacking", 0)
    pnbt.setByte("PuppetMoving", 0)
    e.npc.setEntityNbt(pnbt)
    e.npc.updateClient()
    base_respawn = 150
    e.npc.getStoreddata().put("notRunning", 1);
    e.npc.ai.setWalkingSpeed(5)
    e.npc.storeddata.put("damage", e.npc.stats.melee.getStrength())
    disableRegularAttacks(e)
    e.npc.timers.stop(6)
    e.npc.removeTag("spinning")


}



function interact(e) {
    e.npc.setAttackTarget(null)
    e.npc.ai.setWalkingSpeed(0)
    e.npc.reset()
    var pnbt = e.npc.getEntityNbt()
    pnbt.setByte("PuppetStanding", 1)
    pnbt.setByte("PuppetAttacking", 1)
    pnbt.setByte("PuppetMoving", 1)
    e.npc.setEntityNbt(pnbt)
    e.npc.storeddata.put("notRunning", 1)
    runAnimation(spin, e.npc, 50)
    e.npc.updateClient()
    e.npc.tempdata.put("spinDirection", frontVectors(e.npc, e.npc.rotation, 0, .2))
    e.npc.timers.forceStart(SPINNING_TIMER, 0, true)
    e.npc.timers.start(ATTACK_FINISHED_TIMER, 26, false)


}

function disableRegularAttacks(e) {
    e.npc.stats.getMelee().setDelay(72000)
    e.npc.stats.ranged.setDelay(72000, 72000)
    e.npc.stats.ranged.setAccuracy(0)
    e.npc.stats.ranged.setRange(0)
    e.npc.inventory.setProjectile(e.npc.world.createItem("minecraft:scute", 1))
}

function tick(e) {
    if (e.npc.getAttackTarget() != null && e.npc.getAttackTarget().pos.distanceTo(e.npc.pos) < 1 && getRandomInt(0, 10) < 5) {
        e.npc.knockback(-1, e.npc.rotation)
        e.npc.setMoveForward(-1)
    }
    if (e.npc.getAttackTarget() != null && e.npc.getAttackTarget().pos.distanceTo(e.npc.pos) < 2) {
        e.npc.ai.setWalkingSpeed(1)
    }
    else if (!e.npc.hasTag("spinning")) {
        e.npc.ai.setWalkingSpeed(5)
    }
}

var delay = 1
var r = 0.6 // bare minimum for the npc to rotate

function frontVectors(entity, dr, dp, distance, mode) {
    if (!mode) mode = 0
    if (mode == 1) { var angle = dr + entity.getRotation(); var pitch = (-entity.getPitch() + dp) * Math.PI / 180; if (dp == 0) pitch = 0; }
    if (mode == 0) { var angle = dr; var pitch = (dp) * Math.PI / 180 }
    var dx = -Math.sin(angle * Math.PI / 180) * (distance * Math.cos(pitch))
    var dy = Math.sin(pitch) * distance
    var dz = Math.cos(angle * Math.PI / 180) * (distance * Math.cos(pitch))
    return [dx, dy, dz]
}

function chooseCombatMovement(e) {
    if (e.npc.hasTag("spinning")) {
        e.npc.timers.forceStart(COBMAT_MOVEMENT_TIMER, getRandomInt(min_movement_time, max_movement_time), false)
        return
    }
    if (e.npc.getAttackTarget() == null) {
        e.npc.timers.stop(4)
        return
    }
    if (e.npc.getAttackTarget().pos.distanceTo(e.npc.pos) < 3 && !e.npc.storeddata.has("paralyzed")) {
        var move_chance = getRandomInt(0, 100)
        if (move_chance < 25) {
            e.npc.setMoveForward(-combat_movement_speed)
        }

        if (move_chance > 25 && move_chance <= 50) {
            e.npc.setMoveStrafing(combat_movement_speed)
            e.npc.setMoveForward(0)

        }
        if (move_chance > 50 && move_chance <= 75) {
            var d = frontVectors(e.npc, e.npc.rotation, 0, .02)
            e.npc.setMotionX(d[0])
            e.npc.setMotionZ(d[2])
        }
        else {
            var d = frontVectors(e.npc, e.npc.rotation, 0, .02)
            e.npc.setMotionX(-d[0])
            e.npc.setMotionZ(-d[2])
        }

    }
    e.npc.timers.forceStart(COBMAT_MOVEMENT_TIMER, getRandomInt(e.npc.storeddata.get("min_movement_time"), e.npc.storeddata.get("max_movement_time")), false)
}

var i = 0


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
    if (e.id == SPINNING_TIMER) {
        if (!e.npc.tempdata.has("spinDirection")) {
            e.npc.timers.stop(SPINNING_TIMER)
            e.npc.timers.stop(SPIN_SOUND_TIMER)
            e.npc.removeTag("spinning")
            e.npc.ai.setRetaliateType(0)

            return
        }
        i -= 35
        e.npc.setAttackTarget(null)
        e.npc.setRotation(i)
        var spin_direction = e.npc.tempdata.get("spinDirection")
        e.npc.setMotionX(spin_direction[0])
        e.npc.setMotionZ(spin_direction[2])
        activateDamageHitbox(e)


    }
    if (e.id == SPIN_SOUND_TIMER) {
        e.npc.world.playSoundAt(e.npc.pos, "customnpcs:misc.swosh", 1, getRandomFloat(0.8, 1.2))
        e.npc.world.playSoundAt(e.npc.pos, "aquamirae:item.terrible_sword", 1, getRandomFloat(0.8, 1.2))
    }
}
var attemptsToAttack = 0

function attemptAttack(e) {
    if (e.npc.hasTag("spinning")) {
        e.npc.timers.forceStart(ATTACK_TIMER, 30, false)
        //e.npc.say("or is this the culprit")
        return
    }
    if (e.npc.getAttackTarget() == null) {
        attemptsToAttack++
        if (attemptsToAttack > 3) {
            attemptsToAttack = 0
            return
        }
        e.npc.timers.forceStart(ATTACK_TIMER, getRandomInt(min_attack_time, max_attack_time), false)
        return
    }
    attemptsToAttack = 0
    var animation
    // e.npc.say(chance)
    if (getRandomInt(0, 100) > 85) {
        e.npc.timers.forceStart(ATTACK_TIMER, 30, false)
        return
    }
    e.npc.updateClient()
    if (e.npc.storeddata.has("paralyzed") || !e.npc.storeddata.get("notRunning")) {
        e.npc.timers.forceStart(ATTACK_TIMER, 5, false)
        return
    }

    var damage = e.npc.stats.melee.getStrength()
    if (e.npc.pos.distanceTo(e.npc.getAttackTarget().pos) >= attack_range) {
        if (canSeeEntity(e, e.npc, e.npc.getAttackTarget(), 90)) {
            doSpinAttack(e)
        }
        else {
            e.npc.timers.forceStart(ATTACK_TIMER, 20, false)
            return
        }

    }
    else if (e.npc.pos.distanceTo(e.npc.getAttackTarget().pos) < attack_range) {
        var chance = getRandomInt(0, 100)
        if (chance > 75) {
            doSpinAttack(e)
        }
        else {
            doSwingAttack(e)
        }
    }
}

function doSpinAttack(e) {
    e.npc.ai.setRetaliateType(3)
    e.npc.ai.setWalkingSpeed(0)
    e.npc.setAttackTarget(null)
    e.npc.updateClient()
    e.npc.addTag("spinning")
    e.npc.reset()
    var pnbt = e.npc.getEntityNbt()
    pnbt.setByte("PuppetStanding", 1)
    pnbt.setByte("PuppetAttacking", 1)
    pnbt.setByte("PuppetMoving", 1)
    pnbt.getCompound("PuppetRLeg").setByte("Disabled", 1)
    pnbt.getCompound("PuppetLLeg").setByte("Disabled", 1)
    pnbt.getCompound("PuppetLArm").setByte("Disabled", 0)
    pnbt.getCompound("PuppetRArm").setByte("Disabled", 0)
    pnbt.getCompound("PuppetHead").setByte("Disabled", 0)
    e.npc.setEntityNbt(pnbt)
    e.npc.updateClient()

    e.npc.tempdata.put("spinDirection", frontVectors(e.npc, e.npc.rotation, 0, .45))
    runAnimation(spin, e.npc, 50);
    e.npc.timers.start(SPINNING_TIMER, 0, true)
    e.npc.timers.forceStart(SPIN_SOUND_TIMER, 5, true)
    e.npc.timers.forceStart(ATTACK_FINISHED_TIMER, 30, false)
}

function doSwingAttack(e) {
    e.npc.world.playSoundAt(e.npc.pos, "customnpcs:misc.swosh", 1, getRandomFloat(0.8, 1.2))
    e.npc.world.playSoundAt(e.npc.pos, "aquamirae:item.terrible_sword", 1, getRandomFloat(0.8, 1.2))

    var pnbt = e.npc.getEntityNbt()
    pnbt.setByte("PuppetStanding", 1)
    pnbt.setByte("PuppetAttacking", 1)
    pnbt.setByte("PuppetMoving", 1)
    pnbt.getCompound("PuppetRLeg").setByte("Disabled", 1)
    pnbt.getCompound("PuppetLLeg").setByte("Disabled", 1)
    pnbt.getCompound("PuppetLArm").setByte("Disabled", 0)
    pnbt.getCompound("PuppetRArm").setByte("Disabled", 0)
    pnbt.getCompound("PuppetHead").setByte("Disabled", 0)
    e.npc.setEntityNbt(pnbt)
    runAnimation(horizontal_swing, e.npc, 50);
    e.npc.timers.forceStart(ATTACK_DAMAGE_TIMER, hitbox_time, false)
    e.npc.timers.forceStart(ATTACK_FINISHED_TIMER, 30, false)
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
            nE[entity].getOffhandItem().setDamage(nE[entity].getOffhandItem().getDamage() + e.npc.stats.melee.strength / 2)
            e.npc.knockback(1, nE[entity].rotation)
            if (e.npc.hasTag("spinning")) {
                nE[entity].knockback(1, e.npc.rotation)
            }
            validTarget = false
        }

        if (validTarget) {
            if (e.npc.hasTag("crit")) {
                e.npc.removeTag("crit")
                e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.player.big_fall", .7, .8)
                e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.goat.ram_impact", .7, .8)

            }
            //nE[entity].addPotionEffect(7, 1, 0, false)
            nE[entity].damage(e.npc.stats.melee.strength)
            if (e.npc.hasTag("spinning")) {
                nE[entity].knockback(2, e.npc.rotation)
            }
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
    e.npc.timers.forceStart(COBMAT_MOVEMENT_TIMER, getRandomInt(min_movement_time, max_movement_time), false)


    e.npc.getStoreddata().put("notRunning", 1);
    e.npc.ai.setWalkingSpeed(5)
    e.npc.ai.setRetaliateType(0)
    e.npc.timers.stop(SPINNING_TIMER)
    e.npc.timers.stop(SPIN_SOUND_TIMER)
    e.npc.removeTag("spinning")
}


function npc(e) {
    if (e.npc.hasTag("spinning")) {
        return
    }
    e.npc.timers.forceStart(ATTACK_TIMER, getRandomInt(min_attack_time, max_attack_time), false)
    e.npc.timers.forceStart(COBMAT_MOVEMENT_TIMER, getRandomInt(min_movement_time, max_movement_time), false)
    // e.npc.say("found target")

}

function targetLost(e) {
    if (e.npc.hasTag("spinning")) {
        return
    }
    e.npc.setMoveForward(0)
    e.npc.setMoveStrafing(0)
    e.npc.timers.stop(COBMAT_MOVEMENT_TIMER)
}


function died(e) {
    e.npc.timers.stop(ATTACK_FINISHED_TIMER)
    e.npc.timers.stop(SPINNING_TIMER)
    e.npc.timers.stop(ATTACK_DAMAGE_TIMER)
    e.npc.timers.stop(ATTACK_TIMER)
    e.npc.timers.stop(COBMAT_MOVEMENT_TIMER)
    e.npc.setAttackTarget(null)

}



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
                    var time = acts[i].time
                    var act = acts[i];
                    //         log(act["head"].end[0]);
                    var start = {}; //store the action info
                    var act_count = 0;
                    //store action inital rotations
                    for (var j in act) {
                        if (j != "time") {


                            var part = job.getPart(act[j].id);
                            start[j] = {};
                            if (last_rotation[j])
                                start[j].rotation = last_rotation[j].slice();
                            else if (init_rotation[j])
                                start[j].rotation = init_rotation[j].slice();
                            else
                                start[j].rotation = [part.getRotationX(), part.getRotationY(), part.getRotationZ()];

                            start[j].piece = [
                                (act[j].end[0] - start[j].rotation[0]) / rate / time,
                                (act[j].end[1] - start[j].rotation[1]) / rate / time,
                                (act[j].end[2] - start[j].rotation[2]) / rate / time
                            ];
                            act_count++;

                        }
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

