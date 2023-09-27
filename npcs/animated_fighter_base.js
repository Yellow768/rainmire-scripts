//Main Script

var Thread = Java.type("java.lang.Thread");
var NpcAPI = Java.type("noppes.npcs.api.NpcAPI").Instance();
/////////

var ATTACK_TIMER = 1
var ATTACK_DAMAGE_TIMER = 2
var ATTACK_FINISHED_TIMER = 3
var COBMAT_MOVEMENT_TIMER = 4


var min_attack_time = 20
var max_attack_time = 40
var animation_duration = 20
var hitbox_time = 15
var min_movement_time = 20
var max_movement_time = 25
var combat_movement_speed = 1
var hitbox_size

var attack_range = 5

var blocking = false
var npc



function init(e) {
    e.npc.getStoreddata().put("notRunning", 1);
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
    if (e.npc.getAttackTarget() != null && e.npc.getAttackTarget().pos.distanceTo(e.npc.pos) < 3 && !e.npc.storeddata.has("paralyzed")) {
        e.npc.knockback(-1, e.npc.rotation)
        e.npc.setMoveForward(-1)
    }
}

function chooseCombatMovement(e) {
    if (e.npc.getAttackTarget() == null) {
        e.npc.timers.stop(4)
        return
    }
    if (e.npc.getAttackTarget().pos.distanceTo(e.npc.pos) < 5 && !e.npc.storeddata.has("paralyzed")) {
        if (Math.random() < .3) {
            e.npc.setMoveForward(-combat_movement_speed)
        }

        if (Math.random() < .4) {
            e.npc.setMoveStrafing(combat_movement_speed)
            e.npc.setMoveForward(0)

        }
        else if (Math.random() < .4) {
            e.npc.setMoveStrafing(-combat_movement_speed)
            e.npc.setMoveForward(0)

        }
        if (Math.random() < .4) {
            e.npc.setMoveStrafing(0)
        }

    }
    e.npc.timers.forceStart(COBMAT_MOVEMENT_TIMER, getRandomInt(min_movement_time, max_movement_time), false)
}

function timer(e) {
    if (e.id == ATTACK_TIMER) {
        attemptAttack(e)
    }

    if (e.id == ATTACK_DAMAGE_TIMER) {
        //doAttack
    }

    if (e.id == ATTACK_FINISHED_TIMER) {
        finishAttack(e)
    }
    if (e.id == COBMAT_MOVEMENT_TIMER) {
        chooseCombatMovement(e)
    }
}
function attemptAttack(e) {
    if (e.npc.getAttackTarget() == null) {
        return
    }
    if (e.npc.pos.distanceTo(e.npc.getAttackTarget().pos) < attack_range && !e.npc.storeddata.has("paralyzed")) {
        blocking = false
        e.npc.getStoreddata().put("notRunning", 0);
        setPuppetForAttack(e, true)
        var partsList = [
            true,
            true,
            true,
            false,
            false,
            false
        ]
        setPartsEnabled(e, partsList)
        runAnimation(spit, e.npc, 50);
        e.npc.timers.forceStart(ATTACK_DAMAGE_TIMER, 2, false)
        e.npc.timers.forceStart(ATTACK_FINISHED_TIMER, 20, false)
    }
    else {
        e.npc.timers.start(ATTACK_TIMER, 20, false)
    }


}

function activateDamageHitbox(e) {
    var nE = e.npc.world.getNearbyEntities(e.npc.pos, hitbox_size, -1)
    for (var entity in nE) {
        var validTarget = true
        if (nE[entity] == e.npc) {
            validTarget = false
        }
        if (nE[entity].type == 2 && nE[entity].getFaction() == e.npc.getFaction()) {
            validTarget = false
        }
        if (!canSeeEntity(e, e.npc, nE[entity], 120)) {
            validTarget = false
        }
        if (nE[entity].getMCEntity().m_21254_() && canSeeEntity(e, nE[entity], e.npc, 150)) {
            e.npc.world.playSoundAt(e.npc.pos, "minecraft:item.shield.block", 1, Math.random() + .4)
            nE[entity].getOffhandItem().setDamage(nE[entity].getOffhandItem().getDamage() + 2)
            e.npc.knockback(1, nE[entity].rotation)
            validTarget = false
        }
        if (validTarget) {
            nE[entity].display.setDisplayName("test")
            //nE[entity].damage(e.npc.stats.melee.getStrength())
            nE[entity].knockback(e.npc.stats.melee.getKnockback(), e.npc.rotation)
            return

        }
    }
}


function finishAttack(e) {
    setPuppetForAttack(e, false)
    e.npc.timers.forceStart(ATTACK_TIMER, getRandomInt(min_attack_time, max_attack_time), false)
    e.npc.getStoreddata().put("notRunning", 1);
    e.npc.ai.setWalkingSpeed(4)
}

function setPuppetForAttack(e, enabled) {
    var pnbt = e.npc.getEntityNbt()
    pnbt.setByte("PuppetStanding", Number(enabled))
    pnbt.setByte("PuppetMoving", Number(enabled))
    pnbt.setByte("PuppetAttacking", Number(enabled))
    e.npc.setEntityNbt(pnbt)
    e.npc.updateClient()
}



function target(e) {
    setPuppetForAttack(e, false)
    e.npc.timers.forceStart(ATTACK_TIMER, getRandomInt(min_attack_time, max_attack_time), false)
    e.npc.timers.forceStart(COBMAT_MOVEMENT_TIMER, getRandomInt(min_movement_time, max_movement_time), false)


}

function targetLoss(e) {
    e.npc.timers.stop(ATTACK_FINISHED_TIMER)
    e.npc.setMoveForward(0)
    e.npc.setMoveStrafing(0)
    e.npc.timers.stop(COBMAT_MOVEMENT_TIMER)
}


function died(e) {
    e.npc.timers.stop(ATTACK_FINISHED_TIMER)
    e.npc.timers.stop(ATTACK_DAMAGE_TIMER)
    e.npc.timers.stop(COBMAT_MOVEMENT_TIMER)
    e.npc.setAttackTarget(null)
}


function interact(e) {
    if (!e.player.gamemode == 1 || !e.player.isSneaking()) {
        return
    }
    var partList = {
        head: true,
        larm: true,
        rarm: true,
        lleg: false,
        rleg: false,
        body: false
    }
    setPartEnabled(e, partList)
    setPuppetAttacking(true)
    setPuppetStanding(true)
    runAnimation(spit, npc, 50);
    e.npc.say("displaying animation")
    // runAnimation(actionList, npc, 30);
}

function setPartsEnabled(e, partsList) {
    var pnbt = e.npc.getEntityNbt()
    var compounds = ["PuppetHead", "PuppetLArm", "PuppetRArm", "PuppetLLeg", "PuppetRLeg", "PuppetBody"]
    for (var i = 0; i < partsList.length; i++) {
        pnbt.getCompound(compounds[i]).setByte("Disabled", Number(!partsList[i]))
    }
    e.npc.setEntityNbt(pnbt)
    e.npc.updateClient()
}

function setPuppetStanding(e, enabled) {
    var pnbt = e.npc.getEntityNbt()
    pnbt.setByte("PuppetStanding", Number(enabled))
    e.npc.setEntityNbt(pnbt)
}
function setPuppetAttacking(e, enabled) {
    var pnbt = e.npc.getEntityNbt()
    pnbt.setByte("PuppetAttacking", Number(enabled))
    e.npc.setEntityNbt(pnbt)
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