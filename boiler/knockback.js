//much credit to hank. should be working for 1.16. is not completely finished.

var detectRange = 1

var Speed = 120 //How fast the wave goes out. Higher is slower

var MaxDistance = 1
var Damage = 5
var Knockback = .5

//change dimensions of the circle
var y_circle_mult = 1
var x_circle_mult = 1
var z_circle_mult = 1

//make into a cyinder instead of a sphere. not so much of a point in having high x_spacing/detail
var cylinder = false

var Particle = "instant_effect" // You can edit specifics at ~line 24

//particles spacing: best if factor of 360 (e.x. 36, 18, etc)
var inverse = false //make is cone outwards instead of curve inwards to make sphere (inverse sphere thing)

var x_spacing = 3//how detailed particles are on x axis (more is more detail)

var y_spacing = 3 //how detailed particles are on y axis

var y_additive = 2//how much to add in height to y particles's emmision
//--config done


/**

* @param {NpcEvent.UpdateEvent} event

*/
//I think I copied this without reading it.
/*
function tick(event) {

    var nearbies = event.npc.world.getNearbyEntities(event.npc.getPos(), detectRange, 1)

    if (nearbies.length > 0) {

        SphereParticles(event.npc)

    }

}
*/


//adapted from circle particle AOE atk scr, credit to Hank

function SphereParticles(npc) {

    var Thread = Java.type("java.lang.Thread"); var HankThread = Java.extend(Thread, {
        run: function () {

            // npc.world.playSoundAt(npc.getPos(),"minecraft:entity.blaze.shoot",1,1)

            var x_angel_change = 360 / x_spacing

            var y_angel_change = 360 / y_spacing

            for (var k = 1; k < MaxDistance * 2; ++k) {

                for (var i = 0; i < x_spacing; ++i) {

                    var d = FrontVectors(npc, i * x_angel_change, 0, k / 2, 0) //i x anggel change must equal 360

                    //do dmg and kb
                    var vics = npc.world.getNearbyEntities(npc.x + d[0], npc.y, npc.z + d[2], 2, 5)
                    for (var j = 0; j < vics.length; ++j) {
                        if (vics[j] != npc && TrueDistanceCoord(npc.x + d[0], npc.y, npc.z + d[2], vics[j].x, vics[j].y, vics[j].z) <= 1.5) {
                            if (vics[j].getType() == 1) {
/*for(var e = 0; e < Effects.length; ++e){
npc.executeCommand("/effect give "+vics[j].getDisplayName()+" "+Effects[e]) //EDIT FOR 1.16.5 PORT
}*/}
                            DoKnockback(npc, vics[j], Knockback, 0.2)
                            vics[j].damage(Damage)
                        }
                    }

                    //y coord spacing and particle placement
                    for (var h = 0; h < y_spacing; ++h) {

                        var x_new = 0
                        var z_new = 0

                        if (!inverse) {
                            var y_new = npc.y + Math.sin(h * y_angel_change) * y_circle_mult + y_additive
                        } else { var y_new = npc.y + Math.cos(h * y_angel_change) + y_additive }

                        if (cylinder) {
                            x_new = npc.x + d[0] * Math.atan(h * y_angel_change) * x_circle_mult
                            z_new = npc.z + d[2] * Math.atan(h * y_angel_change) * z_circle_mult
                        }
                        else {
                            x_new = npc.x + d[0] * Math.cos(h * y_angel_change) * 2 * x_circle_mult
                            z_new = npc.z + d[2] * Math.cos(h * y_angel_change) * 2 * z_circle_mult
                        }

                        npc.world.spawnParticle(Particle, x_new, y_new, z_new, 0, 0, 0, 0, 1)

                    }

                }

                Thread.sleep(Speed)
            }

        }
    }); var H = new HankThread(); H.start();
}

function TrueDistanceCoord(x1, y1, z1, x2, y2, z2) {

    var dx = x1 - x2

    var dy = y1 - y2

    var dz = z1 - z2

    var R = Math.pow((dx * dx + dy * dy + dz * dz), 0.5)

    return R;
}

function GetAngleTowardsEntity(npc, player) {

    var dx = npc.getX() - player.getX();

    var dz = player.getZ() - npc.getZ();

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

function FrontVectors(entity, dr, dp, distance, mode) {

    if (mode == 1) { var angle = dr + entity.getRotation(); var pitch = (-entity.getPitch() + dp) * Math.PI / 180 }

    if (mode == 0) { var angle = dr; var pitch = (dp) * Math.PI / 180 }

    var dx = -Math.sin(angle * Math.PI / 180) * (distance * Math.cos(pitch))

    var dy = Math.sin(pitch) * distance

    var dz = Math.cos(angle * Math.PI / 180) * (distance * Math.cos(pitch))

    return [dx, dy, dz]
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