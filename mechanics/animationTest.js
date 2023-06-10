//Main Script
function canSeeEntity(event, source, entity, cone) {
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
    /*var vtg = [event.player.x-event.npc.x,event.player.z-event.npc.z]; /* this was used with interact event for testing*/
    var angle = Math.acos(dot(vnpc, vtg) / (magn(vnpc) * magn(vtg))); /*angle between vectors*/
    angle = angle * (180 / Math.PI); /*angle to degrees*/
    angle = angle | 0;
    var seen = angle <= coneangle / 2 ? true : false;

    //event.npc.say(seen)
    return seen
}

var i = 5
var Thread = Java.type("java.lang.Thread");
var NpcAPI = Java.type("noppes.npcs.api.NpcAPI").Instance();
/////////
var npc
function init(event) {
    event.npc.getStoreddata().put("notRunning", 1);
    event.npc.getTempdata().remove("target")

    event.npc.timers.stop(2)

}

function tick(e) {
    if (e.npc.getAttackTarget() != null && e.npc.getAttackTarget().pos.distanceTo(e.npc.pos) < 2) {
        if (Math.random() < .7) {
            e.npc.knockback(-1, e.npc.rotation)
        }
    }
}

function timer(e) {
    if (e.id == 4) {
        if (e.npc.getAttackTarget() == null) {
            e.npc.timers.stop(4)
            return
        }
        if (e.npc.getAttackTarget().pos.distanceTo(e.npc.pos) < 5) {

            if (Math.random() < .3) {
                e.npc.setMoveForward(0)
            }

            if (Math.random() < .4) {
                e.npc.setMoveStrafing(.3)
                e.npc.setMoveForward(0)
            }
            if (Math.random() < .4) {
                e.npc.setMoveStrafing(-0.3)
                e.npc.setMoveForward(0)
            }
            if (Math.random() < .4) {
                e.npc.setMoveStrafing(0)
            }

            if (Math.random() < .4) {
                e.npc.jump()
            }

        }
        e.npc.timers.forceStart(4, Math.random() * 25, false)
    }
    if (e.id == 1) {
        var pnbt = e.npc.getEntityNbt()
        var Larm = pnbt.getCompound("PuppetLArm")
        var Head = pnbt.getCompound("PuppetHead")
        Larm.setByte("Disabled", 1)
        pnbt.setByte("PuppetStanding", 0)
        pnbt.setByte("PuppetMoving", 0)
        pnbt.setByte("PuppetAttacking", 0)
        Head.setByte("Disabled", 1)
        e.npc.setEntityNbt(pnbt)
        e.npc.updateClient()
    }
    if (e.id == 2) {
        var nE = e.npc.world.getNearbyEntities(e.npc.pos, 2, 5)
        e.npc.world.playSoundAt(e.npc.pos, "variedcommodities:misc.swosh", 1, 1)
        for (var entity in nE) {
            if (nE[entity] != e.npc) {
                if (canSeeEntity(e, e.npc, nE[entity], 120)) {
                    if (nE[entity].getMCEntity().func_184585_cz() && canSeeEntity(e, nE[entity], e.npc, 150)) {
                        e.npc.world.playSoundAt(e.npc.pos, "minecraft:item.shield.block", 1, Math.random() + .4)
                        nE[entity].getOffhandItem().setDamage(nE[entity].getOffhandItem().getDamage() + 2)
                        e.npc.knockback(1, nE[entity].rotation)


                    }
                    else {
                        nE[entity].damage(2)
                        nE[entity].knockback(2, e.npc.rotation)
                        return

                    }
                }
            }
        }
    }
    if (e.id == 3) {
        if (e.npc.getAttackTarget()) {
            if (e.npc.pos.distanceTo(e.npc.getAttackTarget().pos) < 4) {

                npc = e.npc;
                var pnbt = npc.getEntityNbt()
                pnbt.setByte("PuppetStanding", 1)
                pnbt.setByte("PuppetAttacking", 1)
                var Rleg = pnbt.getCompound("PuppetRLeg")
                var Lleg = pnbt.getCompound("PuppetLLeg")
                Rleg.setByte("Disabled", 1)
                Lleg.setByte("Disabled", 1)
                var Rarm = pnbt.getCompound("PuppetRArm")
                Rarm.setByte("Disabled", 1)
                var Larm = pnbt.getCompound("PuppetLArm")
                var Head = pnbt.getCompound("PuppetHead")
                Larm.setByte("Disabled", 0)
                Head.setByte("Disabled", 1)
                npc.setEntityNbt(pnbt)
                npc.updateClient()
                DoActs(actionList, npc, 50);
                e.npc.timers.forceStart(2, 5, false)
                e.npc.timers.forceStart(1, 15, false)

            }
        }
        e.npc.timers.forceStart(3, (Math.random() * 30) + 10, false)
    }
}

function died(e) {
    e.npc.timers.stop(3)
    e.npc.timers.stop(2)
    e.npc.timers.stop(4)
    e.npc.setAttackTarget(null)
}

function target(e) {
    var pnbt = e.npc.getEntityNbt()
    pnbt.setByte("PuppetStanding", 0)
    pnbt.setByte("PuppetAttacking", 0)
    pnbt.setByte("PuppetMoving", 0)
    var Rleg = pnbt.getCompound("PuppetRLeg")
    var Lleg = pnbt.getCompound("PuppetLLeg")
    var Rarm = pnbt.getCompound("PuppetRArm")
    var Larm = pnbt.getCompound("PuppetLArm")
    var Head = pnbt.getCompound("PuppetHead")
    Rleg.setByte("Disabled", 1)
    Lleg.setByte("Disabled", 1)
    Head.setByte("Disabled", 1)
    Rarm.setByte("Disabled", 1)

    Larm.setByte("Disabled", 0)
    e.npc.setEntityNbt(pnbt)
    e.npc.updateClient()
    e.npc.timers.forceStart(3, 20, false)
    e.npc.timers.forceStart(4, Math.random() * 40, false)

}

function targetLoss(e) {
    e.npc.timers.stop(3)
    e.npc.setMoveForward(0)
    e.npc.setMoveStrafing(0)
    e.npc.timers.stop(4)
}

function interact(event) {
    npc = event.npc;
    var pnbt = npc.getEntityNbt()
    pnbt.setByte("PuppetStanding", 1)
    pnbt.setByte("PuppetAttacking", 1)
    var Rleg = pnbt.getCompound("PuppetRLeg")
    var Lleg = pnbt.getCompound("PuppetLLeg")
    Rleg.setByte("Disabled", 1)
    Lleg.setByte("Disabled", 1)
    npc.setEntityNbt(pnbt)
    npc.updateClient()
    event.player.message("test")
    DoActs(dumbActions, npc, 50);
    // DoActs(actionList, npc, 30);
}



function DoActs(acts, npc, rate, init_rotation) {
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
var actionList = {
    action_default1: { head: { id: 0, time: .1, a: [0, 0, 0], end: [180, 180, 180], }, left_arm: { id: 1, time: .5, a: [0, 0, 0], end: [180, 180, 180], }, body: { id: 3, time: .5, a: [0, 0, 0], end: [180, 180, 180], }, },
    action_raiseArm: { head: { id: 0, time: .01, a: [0, 0, 0], end: [175, 163, 175], }, left_arm: { id: 1, time: .2, a: [0, 0, 0], end: [42, 139, 199], }, body: { id: 3, time: .4, a: [0, 0, 0], end: [180, 180, 180], }, },
    action_swingArm1: { head: { id: 0, time: .05, a: [0, 0, 0], end: [177, 188, 174], }, left_arm: { id: 1, time: .1, a: [0, 0, 0], end: [146, 212, 180], }, body: { id: 3, time: .2, a: [0, 0, 0], end: [180, 180, 180], }, },
    action_default2: { head: { id: 0, time: .3, a: [0, 0, 0], end: [180, 180, 180], }, left_arm: { id: 1, time: .5, a: [0, 0, 0], end: [180, 180, 180], }, body: { id: 3, time: .5, a: [0, 0, 0], end: [180, 180, 180], }, }
}

var dumbActions = {
    action_swingOut: { head: { id: 0, time: .2, a: [0, 0, 0], end: [141, 174, 179], }, left_arm: { id: 1, time: .2, a: [0, 0, 0], end: [114, 93, 180], }, right_arm: { id: 2, time: .2, a: [0, 0, 0], end: [36, 238, 180], }, body: { id: 3, time: .2, a: [0, 0, 0], end: [180, 180, 180], }, left_leg: { id: 4, time: .2, a: [0, 0, 0], end: [180, 180, 180], }, right_leg: { id: 5, time: .2, a: [0, 0, 0], end: [180, 180, 180], }, },
    action_comeIn: { head: { id: 0, time: .4, a: [0, 0, 0], end: [239, 174, 179], }, left_arm: { id: 1, time: .4, a: [0, 0, 0], end: [250, 360, 271], }, right_arm: { id: 2, time: .4, a: [0, 0, 0], end: [76, 154, 266], }, body: { id: 3, time: .4, a: [0, 0, 0], end: [180, 180, 180], }, left_leg: { id: 4, time: .4, a: [0, 0, 0], end: [180, 180, 180], }, right_leg: { id: 5, time: .4, a: [0, 0, 0], end: [180, 180, 180], }, },
    action_pizazz: { head: { id: 0, time: .2, a: [0, 0, 0], end: [239, 86, 179], }, left_arm: { id: 1, time: .2, a: [0, 0, 0], end: [202, 360, 223], }, right_arm: { id: 2, time: .2, a: [0, 0, 0], end: [57, 207, 185], }, body: { id: 3, time: .2, a: [0, 0, 0], end: [180, 180, 180], }, left_leg: { id: 4, time: .2, a: [0, 0, 0], end: [180, 130, 111], }, right_leg: { id: 5, time: .2, a: [0, 0, 0], end: [180, 180, 180], }, },
    action_mostlyNormal: { head: { id: 0, time: 1, a: [0, 0, 0], end: [179, 180, 182], }, left_arm: { id: 1, time: 1, a: [0, 0, 0], end: [177, 175, 175], }, right_arm: { id: 2, time: 1, a: [0, 0, 0], end: [186, 180, 177], }, body: { id: 3, time: 1, a: [0, 0, 0], end: [180, 180, 180], }, left_leg: { id: 4, time: 1, a: [0, 0, 0], end: [180, 180, 174], }, right_leg: { id: 5, time: 1, a: [0, 0, 0], end: [180, 180, 180], }, }
}

var shieldActionList = {
    action_Shield: { head: { id: 0, time: .5, a: [0, 0, 0], end: [190, 174, 179], }, left_arm: { id: 1, time: .5, a: [0, 0, 0], end: [180, 180, 180], }, right_arm: { id: 2, time: .5, a: [0, 0, 0], end: [108, 112, 180], }, body: { id: 3, time: .5, a: [0, 0, 0], end: [180, 180, 180], }, left_leg: { id: 4, time: .5, a: [0, 0, 0], end: [180, 180, 180], }, right_leg: { id: 5, time: .5, a: [0, 0, 0], end: [180, 180, 180], }, }
}