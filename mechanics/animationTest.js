//Main Script
function canSeeEntity(event, entity) {
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
    var coneangle = 90; /*angle of cone of sight in degrees, change this for your needs*/
    /**/
    var rot = event.npc.rotation | 0;
    if (rot < 0) {
        if (rot < -360) { rot = rot % 360 };
        rot = 360 + rot;
    } else { if (rot > 360) { rot = rot % 360 } } /*blame Noppes for broken rotations*/
    var vnpc = [0, 1]; /*base vector for rotation 0*/
    vnpc = rotateVector(vnpc, rot); /*rotate base vector by npcs rotation*/
    var vtg = [entity.x - event.npc.x, entity.z - event.npc.z] /*vector to target position*/
    /*var vtg = [event.player.x-event.npc.x,event.player.z-event.npc.z]; /* this was used with interact event for testing*/
    var angle = Math.acos(dot(vnpc, vtg) / (magn(vnpc) * magn(vtg))); /*angle between vectors*/
    angle = angle * (180 / Math.PI); /*angle to degrees*/
    angle = angle | 0;
    var seen = angle <= coneangle / 2 ? true : false;

    //event.npc.say(seen)
    return seen
}


var Thread = Java.type("java.lang.Thread");
var NpcAPI = Java.type("noppes.npcs.api.NpcAPI").Instance();
/////////
function init(event) {
    event.npc.getStoreddata().put("notRunning", 1);
    event.npc.getTempdata().remove("target")
    event.npc.timers.stop(2)

}

function timer(e) {
    if (e.id == 1) {
        var nE = e.npc.world.getNearbyEntities(e.npc.pos, 1, 1)
        if (nE.length != 0) {
            if (canSeeEntity(e, nE[0])) {
                nE[0].damage(1)
                nE[0].knockback(2, e.npc.getRotation())
            }
        }
    }
    if (e.id == 2 && e.npc.getStoreddata().get("notRunning")) {
        var currentTarget = e.npc.getTempdata().get("target")
        if (currentTarget == null || currentTarget.gamemode == 1) {
            e.npc.timers.stop(2)

        }
        if (e.npc.pos.distanceTo(currentTarget.pos) < 4 && e.npc.getStoreddata().get("notRunning")) {
            if (canSeeEntity(e, currentTarget)) {
                var pnbt = e.npc.getEntityNbt()
                pnbt.setByte("PuppetStanding", 1)
                pnbt.setByte("PuppetAttacking", 1)
                var Rleg = pnbt.getCompound("PuppetRLeg")
                var Lleg = pnbt.getCompound("PuppetLLeg")
                Rleg.setByte("Disabled", 1)
                Lleg.setByte("Disabled", 1)

                e.npc.setEntityNbt(pnbt)

                DoActs(actionList, e.npc, 30);
                e.npc.setRotation(90)
                e.npc.updateClient()
                e.npc.timers.forceStart(2, 40, false)
            }
            e.npc.timers.forceStart(2, 2, false)
        }
        else if (e.npc.pos.distanceTo(currentTarget.pos) < 10) {
            var anbt = e.npc.getEntityNbt()
            anbt.setByte("PuppetStanding", 0)
            anbt.setByte("PuppetAttacking", 0)
            //e.npc.navigateTo(currentTarget.x, currentTarget.y, currentTarget.z, 3)
            e.npc.timers.forceStart(2, 20, false)
        }
        else {
            e.npc.timers.stop(2)

        }
    }
    if (e.id == 3) {
        e.npc.timers.stop(2)
        var anbt = e.npc.getEntityNbt()
        anbt.setByte("PuppetStanding", 0)
        anbt.setByte("PuppetAttacking", 0)

        e.npc.setEntityNbt(anbt)
        e.npc.updateClient()
        e.npc.getStoreddata().put("notRunning", 1);
        e.npc.timers.start(2, 0, false)
    }
    if (e.id == 5) {
        var pnbt = e.npc.getEntityNbt()
        var Rarm = pnbt.getCompound("PuppetRArm")
        Rarm.setByte("Disabled", 1)
        e.npc.setEntityNbt(pnbt)
        e.npc.updateClient()
    }

}
var npc;


function target(e) {
    e.npc.getTempdata().put("target", e.entity)
    e.npc.timers.forceStart(2, 10, true)
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

    if (event.npc.getStoreddata().get("notRunning")) {
        event.player.message("test")
        DoActs(actionList, npc, 50);
    }
    // DoActs(actionList, npc, 30);
}

function damaged(e) {
    var rand_chance = Math.random()
    // e.setCanceled(true)
    e.npc.knockback(1, e.npc.rotation)
    DoActs(shieldActionList, e.npc, 50, "shield")

}

function DoActs(acts, npc, rate, type, init_rotation) {
    npc.getStoreddata().put("notRunning", 0);
    npc.say(type)
    if (type != "shield") {
        npc.timers.start(1, 15, false)

    }
    npc.timers.start(3, 30, false)
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
    action_default1: { head: { id: 0, time: .5, a: [0, 0, 0], end: [180, 180, 180], }, left_arm: { id: 1, time: .5, a: [0, 0, 0], end: [180, 180, 180], }, body: { id: 3, time: .5, a: [0, 0, 0], end: [180, 180, 180], }, },
    action_raiseArm: { head: { id: 0, time: .4, a: [0, 0, 0], end: [175, 163, 175], }, left_arm: { id: 1, time: .4, a: [0, 0, 0], end: [42, 139, 199], }, body: { id: 3, time: .4, a: [0, 0, 0], end: [180, 180, 180], }, },
    action_swingArm1: { head: { id: 0, time: .2, a: [0, 0, 0], end: [177, 188, 174], }, left_arm: { id: 1, time: .2, a: [0, 0, 0], end: [146, 212, 180], }, body: { id: 3, time: .2, a: [0, 0, 0], end: [180, 180, 180], }, },
    action_default2: { head: { id: 0, time: .5, a: [0, 0, 0], end: [180, 180, 180], }, left_arm: { id: 1, time: .5, a: [0, 0, 0], end: [180, 180, 180], }, body: { id: 3, time: .5, a: [0, 0, 0], end: [180, 180, 180], }, }
}

var shieldActionList = {
    action_Shield: { head: { id: 0, time: .5, a: [0, 0, 0], end: [190, 174, 179], }, left_arm: { id: 1, time: .5, a: [0, 0, 0], end: [180, 180, 180], }, right_arm: { id: 2, time: .5, a: [0, 0, 0], end: [108, 112, 180], }, body: { id: 3, time: .5, a: [0, 0, 0], end: [180, 180, 180], }, left_leg: { id: 4, time: .5, a: [0, 0, 0], end: [180, 180, 180], }, right_leg: { id: 5, time: .5, a: [0, 0, 0], end: [180, 180, 180], }, }
}