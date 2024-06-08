function canSeeEntity(source, entity, cone) {
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

var evading = false

function init(e) {
    e.npc.timers.forceStart(1, 1, true)
}

function timer(e) {

    if (e.npc.getAttackTarget() != null && canSeeEntity(e, e.npc.getAttackTarget(), e.npc, 90)) {
        e.npc.ai.setWalkingSpeed(5)
        //e.npc.jump()
        e.npc.setMoveForward(1)
        e.npc.knockback(1, e.npc.rotation)
        evading = true
    }
    if (evading && e.npc.getAttackTarget() != null && !canSeeEntity(e, e.npc.getAttackTarget(), e.npc, 180)) {
        evading = false
        e.npc.setMoveStrafing(0)
        e.npc.setMoveForward(0)
        e.npc.ai.setWalkingSpeed(2)
    }
}