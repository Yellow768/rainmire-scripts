var API = Java.type('noppes.npcs.api.NpcAPI').Instance();

function executeCommand(command) {
    return API.executeCommand(API.getIWorld("overworld"), command)
}

function doesStringContainPhrase(string, phrase) {
    if (string.indexOf(phrase) == -1) { return false }
    else { return true }
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor((Math.random() * (max - min + 1) + min));
}

function getRandomFloat(min, max) {
    return Math.random() * (max - min + 1) + min;
}

function getRandomElement(array) {
    return array[getRandomInt(0, array.length - 1)]
}

function FrontVectors(entity, dr, dp, distance, mode) {
    if (!mode) mode = 0
    if (mode == 1) { var angle = dr + entity.getRotation(); var pitch = (-entity.getPitch() + dp) * Math.PI / 180; if (dp == 0) pitch = 0; }
    if (mode == 0) { var angle = dr; var pitch = (dp) * Math.PI / 180 }
    var dx = -Math.sin(angle * Math.PI / 180) * (distance * Math.cos(pitch))
    var dy = Math.sin(pitch) * distance
    var dz = Math.cos(angle * Math.PI / 180) * (distance * Math.cos(pitch))
    return [dx, dy, dz]
}

function dataGet(entity, key) {
    return entity.storeddata.get(key)
}

function dataPut(entity, key, value) {
    entity.storeddata.put(key, value)
}

function tempGet(entity, key) {
    return entity.tempdata.get(key)
}

function tempPut(entity, key, value) {
    entity.tempdata.put(key, value)
}



function DoKnockback(npc, targ, kb, kbVert) {
    targ.setMotionY(kbVert)
    if (kb < 1) {
        var d = FrontVectors(npc, GetAngleTowardsEntity(npc, targ), 0, kb, 0)
        targ.setMotionX(d[0])
        targ.setMotionZ(d[2])
        return;
    }
    targ.knockback(kb, GetAngleTowardsEntity(npc, targ))
}


function TrueDistanceCoord(x1, y1, z1, x2, y2, z2) {

    var dx = x1 - x2

    var dy = y1 - y2

    var dz = z1 - z2

    var R = Math.pow((dx * dx + dy * dy + dz * dz), 0.5)

    return R;
}

function TrueDistanceEntities(entity, target) {

    return TrueDistanceCoord(entity.x, entity.y, entity.z, target.x, target.y, target.z)
}

function GetAngleTowardsEntity(source, target) {

    var dx = source.getX() - target.getX();

    var dz = target.getZ() - source.getZ();

    if (dz >= 0) {

        var angle = (Math.atan(dx / dz) * 180 / Math.PI);

        if (angle < 0) {

            angle = 360 + angle;
        }
    }

    if (dz < 0) {

        dz = -dz;

        var angle = 180 - (Math.atan(dx / dz) * 180 / Math.PI);
    }

    return angle;
}

function GetAngleTowardsPosition(position1, position2) {

    var dx = position1.getX() - position2.getX();

    var dz = position1.getZ() - position2.getZ();

    if (dz >= 0) {

        var angle = (Math.atan(dx / dz) * 180 / Math.PI);

        if (angle < 0) {

            angle = 360 + angle;
        }
    }

    if (dz < 0) {

        dz = -dz;

        var angle = 180 - (Math.atan(dx / dz) * 180 / Math.PI);
    }

    return angle;
}

function clamp(val, min, max) {
    return val > max ? max : val < min ? min : val;
}


function pp(e, message) {
    e.player.message(message)
}

function isOnGround(entity) {
    return entity.getMCEntity().m_20096_()
}

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


function louderPlaySoundAt(pos, max_distance, sound, volume, pitch) {
    var sound_world = API.getIWorld("minecraft:overworld")
    var nP = sound_world.getNearbyEntities(pos, max_distance, 1)
    for (var i = 0; i < nP.length; i++) {
        var percentage = (max_distance - pos.distanceTo(nP[i].pos)) / max_distance
        var artificial_distance = Math.round(16 - (16 * percentage))
        var angle = GetAngleTowardsPosition(pos, nP[i].pos)
        var vector = FrontVectors(nP[i], angle, 0, artificial_distance, 0)
        var new_pos = nP[i].pos.add(Math.round(vector[0]), Math.round(vector[1]), Math.round(vector[2]))
        sound_world.playSoundAt(new_pos, sound, percentage, pitch)
    }
}