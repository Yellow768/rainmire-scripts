var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
var world = API.getIWorld("minecraft:overworld")
var current_attack



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

function playAnim(anim) {
    var animBuilder = API.createAnimBuilder()
    animBuilder.playOnce(anim)
    npc.syncAnimationsForAll(animBuilder)
}


function getDistanceToTarget() {
    if (!npc.getAttackTarget()) return -1
    return TrueDistanceCoord(npc.x, npc.y, npc.z, npc.getAttackTarget().x, npc.getAttackTarget().y, npc.getAttackTarget().z)
}


function Attack(animation, damage, range, fov, duration, hitbox_delay, min_distance, max_distance, chance, start_func, hitbox_func, sound) {
    this.animation = animation || ""
    this.damage = damage || 0
    this.range = range || 1
    this.fov = fov || 180
    this.duration = duration || 20
    this.min_distance = min_distance || 0
    this.max_distance = max_distance || 2
    this.chance = chance || 100
    this.start_func = start_func || function () { }
    this.hitbox_func = hitbox_func || function () { }
    this.hitbox_delay = hitbox_delay || 20
    this.sound = sound
}

function sortAttacksByWeightedChance() {
    var array = []
    for (var i = 0; i < attacks.length; i++) {
        if (getDistanceToTarget() > attacks[i].min_distance && getDistanceToTarget() < attacks[i].max_distance) {
            for (var j = 0; j < Math.round(attacks[i].chance / 10); j++) {
                array.push(attacks[i])
            }
        }
    }
    return array
}