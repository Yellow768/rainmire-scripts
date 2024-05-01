/**
 * @param {NpcEvent.InitEvent} event
 */
function init(event) {
    event.npc.getTimers().forceStart(1, 0, true)
    event.npc.getTimers().forceStart(2, getRandomInt(20, 120), false)
}


var new_target
/**
 * @param {NpcEvent.TimerEvent} event
 */
function timer(event) {
    if (event.id == 1) {
        event.npc.setMotionY(0)
    }
    if (event.id == 2) {
        event.npc.setRotation(event.npc.getRotation() + getRandomFloat(-90, 90))
        event.npc.setPitch(event.npc.getPitch() + getRandomFloat(-45, 45))
        if (!event.npc.world.getBlock(event.npc.pos.up()).isAir()) {
            event.npc.setPitch(event.npc.getPitch() + getRandomFloat(45, 90))
        }
        if (!event.npc.world.getBlock(event.npc.pos.down()).isAir()) {
            event.npc.setPitch(event.npc.getPitch() - getRandomFloat(45, 90))
        }
        new_target = event.npc.rayTraceBlock(10, true, true)
        if (new_target != null) {
            event.npc.getTimers().start(4, 5, false)
            ParticleLine(event.npc, event.npc.x, event.npc.y, event.npc.z, new_target.getPos().x, new_target.getPos().y, new_target.getPos().z, 10, 1, "alexsmobs:smelly", 1, 0, 0, 0, 0, 0)
        }
        else {
            event.npc.getTimers().forceStart(2, getRandomInt(20, 120), false)
        }
    }
    if (event.id == 4) {
        event.npc.setPos(new_target.getPos().offset(new_target.getSideHit()))
        event.npc.setRotation(event.npc.getRotation() - 180)
        event.npc.getTimers().forceStart(2, getRandomInt(20, 120), false)
    }

}


function ParticleLine(entity, x1, y1, z1, x2, y2, z2, Resolution, Speed, Particle, Count, dx, dy, dz, dv, Dmg, Range, Sound, ID, mode) {
    var NpcAPI = Java.type("noppes.npcs.api.NpcAPI").Instance();
    var Thread = Java.type("java.lang.Thread");
    var HankThread = Java.extend(Thread, {
        run: function () {
            if (!dx) { dx = 0; } if (!dy) { dy = 0; } if (!dz) { dz = 0; } if (!dv) { dv = 0; } if (!Sound) { Sound = ""; }
            if (!ID) { ID = 0; } if (!Dmg) { Dmg = 0; } if (!Range) { Range = 0; }; var vars = {}
            var Blockable = false
            if (Range < 0) { Blockable = true; Range = Range * -1 }
            var ParticleTotal = Math.round(TrueDistanceCoord(x1, y1, z1, x2, y2, z2) * Resolution)
            for (var i = 0; i < ParticleTotal; i++) {
                var x = (x1 + (x2 - x1) * (i / ParticleTotal)).toFixed(9);
                var y = (y1 + 1 + (y2 - y1) * (i / ParticleTotal)).toFixed(9);
                var z = (z1 + (z2 - z1) * (i / ParticleTotal)).toFixed(9);
                if (mode) NpcAPI.executeCommand(entity.world, "/particle " + Particle + " " + x + " " + y + " " + z + " " + dx + " " + dy + " " + dz + " " + dv + " " + Count);
                else entity.world.spawnParticle(Particle, x, y, z, dx, dy, dz, dv, Count)
                Thread.sleep(Speed);
            }
        }
    });
    var H = new HankThread();
    H.start();
}

/*
Force rotation to not face the wall behind them.
Either use raytrace block or use FrontVectors to try and detect a random wall somewhere in view of the npc.
Once it finds it, do some kind of interpolation to get over there, probably with like a particle line of slime.
If on a wall and hasn't been damaged, continuously set its y motion to 0.
If damaged, stop the y motion timer, and have it set to panic mode for a little.


*/