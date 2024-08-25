function rangedLaunched(t) {
    var e = t.projectiles[0]
    e.despawn()
    DeadlyRain(t.npc)
}

function DeadlyRain(npc) {
    var Count = 4
    var Range = 10
    var StartingHeight = 8
    var targ = npc.getAttackTarget()
    if (targ == null) return;
    for (var i = 0; i < Count; ++i) {
        var d = FrontVectors(npc, Math.round(Math.random() * 360), 0, Math.round(Math.random() * Range), 0)
        var Height = StartingHeight + Math.round(Math.random() * 6) - 3
        drawDmgLine(npc, npc.world, targ.getPos().add(d[0], Height, d[2]), targ.getPos().add(d[0], -1, d[2]), 5, "flame", 50, "", 0.05, 0.05, 0.05, 0, 1, 0, 1, 1)
    }
}

function Boom(npc, x, y, z) {

    npc.world.spawnParticle("large_smoke", x, y + 1, z, 0.5, 0.5, 0.5, 0.1, 50)
    npc.world.spawnParticle("minecraft:explosion", x, y + 1, z, 0.5, 0.5, 0.5, 0.1, 10)
    npc.world.spawnParticle("flame", x, y + 1, z, 0.5, 0.5, 0.5, 0.1, 50)
    npc.world.playSoundAt(npc.world.getBlock(x, y + 1, z).getPos(), "minecraft:entity.generic.explode", 3, 1)
    var vics = npc.world.getNearbyEntities(npc.world.getBlock(x, y + 1, z).getPos(), 2, 5)

    for (var i = 0; i < vics.length; ++i) {
        if (vics[i] != npc) {
            vics[i].setMotionY(0.2)
            vics[i].damage(4)
        }
    }
}


function drawDmgLine(entity, world, pos1, pos2, resolution, particle, speed, Sound, dx, dy, dz, dv, count, Damage, Range, ID) {
    var NpcAPI = Java.type("noppes.npcs.api.NpcAPI").Instance();
    var Thread = Java.type("java.lang.Thread");
    var MyThread = Java.extend(Thread, {
        run: function () {
            var drawAmount = Math.ceil(pos1.distanceTo(pos2)) * resolution;
            var subs = pos2.subtract(pos1);
            for (var i = 0; i < drawAmount; i++) {
                var x = (pos1.getX() + subs.getX() * (i / drawAmount) + 0.5).toFixed(4);
                var y = (pos1.getY() + subs.getY() * (i / drawAmount) + 0.5).toFixed(4);
                var z = (pos1.getZ() + subs.getZ() * (i / drawAmount) + 0.5).toFixed(4);
                var cords = x + " " + y + " " + z;
                var output = NpcAPI.executeCommand(world, "/particle " + particle + " " + cords + " " + dx + " " + dy + " " + dz + " " + dv + " " + count);
                var CurrentPos = world.getBlock(x, y, z).getPos()

                world.playSoundAt(CurrentPos, Sound, 1, 1)
                var targs = world.getNearbyEntities(CurrentPos, Range, 5)
                for (var t = 0; t < targs.length; ++t) {
                    if (targs[t] != entity) {
                        //Extra Damage Effects Here
                        if (ID == 1) {
                            Boom(entity, x, y, z)
                            return;
                        }
                        DoActualDamage(entity, Damage, targs[t], false)
                    }
                }
                //During Line Effects Here
                if (ID == 1) { }
                //if(!world.getBlock(x,y,z).isAir())Boom(entity,x,y,z)
                Thread.sleep(speed);
            }
            //After Line Effects Here
            if (ID == 1) {
                Boom(entity, x, y, z)
            }
        }
    });
    var th = new MyThread();
    th.start();
}

function FrontVectors(entity, dr, dp, distance, mode) {
    if (mode == 1) var angle = dr + entity.getRotation()
    if (mode == 0) var angle = dr
    var pitch = (-entity.getPitch() + dp) * Math.PI / 180
    var dx = -Math.sin(angle * Math.PI / 180) * (distance * Math.cos(pitch))
    var dy = Math.sin(pitch) * distance
    var dz = Math.cos(angle * Math.PI / 180) * (distance * Math.cos(pitch))
    return [dx, dy, dz]
}


//end

function rangedLaunched(t) {
    var e = t.projectiles[0]
    e.despawn()
    DeadlyRain(t.npc)
}

function DeadlyRain(npc) {
    var Count = 4
    var Range = 10
    var StartingHeight = 8
    var targ = npc.getAttackTarget()
    if (targ == null) return;
    for (var i = 0; i < Count; ++i) {
        var d = FrontVectors(npc, Math.round(Math.random() * 360), 0, Math.round(Math.random() * Range), 0)
        var Height = StartingHeight + Math.round(Math.random() * 6) - 3
        drawDmgLine(npc, npc.world, targ.getPos().add(d[0], Height, d[2]), targ.getPos().add(d[0], -1, d[2]), 5, "flame", 50, "", 0.05, 0.05, 0.05, 0, 1, 0, 1, 1)
    }
}

function Boom(npc, x, y, z) {
    npc.world.spawnParticle("largesmoke", x, y + 1, z, 0.5, 0.5, 0.5, 0.1, 50)
    npc.world.spawnParticle("largeexplode", x, y + 1, z, 0.5, 0.5, 0.5, 0.1, 10)
    npc.world.spawnParticle("flame", x, y + 1, z, 0.5, 0.5, 0.5, 0.1, 50)
    npc.world.playSoundAt(npc.world.getBlock(x, y + 1, z).getPos(), "minecraft:entity.generic.explode", 3, 1)
    var vics = npc.world.getNearbyEntities(npc.world.getBlock(x, y + 1, z).getPos(), 2, 5)
    for (var i = 0; i < vics.length; ++i) {
        if (vics[i] != npc) {
            vics[i].setMotionY(0.2)
            vics[i].damage(4)
        }
    }
}

function drawDmgLine(entity, world, pos1, pos2, resolution, particle, speed, Sound, dx, dy, dz, dv, count, Damage, Range, ID) {
    var NpcAPI = Java.type("noppes.npcs.api.NpcAPI").Instance();
    var Thread = Java.type("java.lang.Thread");
    var MyThread = Java.extend(Thread, {
        run: function () {
            var drawAmount = Math.ceil(pos1.distanceTo(pos2)) * resolution;
            var subs = pos2.subtract(pos1);
            for (var i = 0; i < drawAmount; i++) {
                var x = (pos1.getX() + subs.getX() * (i / drawAmount) + 0.5).toFixed(4);
                var y = (pos1.getY() + subs.getY() * (i / drawAmount) + 0.5).toFixed(4);
                var z = (pos1.getZ() + subs.getZ() * (i / drawAmount) + 0.5).toFixed(4);
                var cords = x + " " + y + " " + z;
                var output = NpcAPI.executeCommand(world, "/particle " + particle + " " + cords + " " + dx + " " + dy + " " + dz + " " + dv + " " + count);
                var CurrentPos = world.getBlock(x, y, z).getPos()
                world.playSoundAt(CurrentPos, Sound, 1, 1)
                var targs = world.getNearbyEntities(CurrentPos, Range, 5)
                for (var t = 0; t < targs.length; ++t) {
                    if (targs[t] != entity) {
                        //Extra Damage Effects Here
                        if (ID == 1) {
                            Boom(entity, x, y, z)
                            return;
                        }
                        DoActualDamage(entity, Damage, targs[t], false)
                    }
                }
                //During Line Effects Here
                if (ID == 1) { }
                //if(!world.getBlock(x,y,z).isAir())Boom(entity,x,y,z)
                Thread.sleep(speed);
            }
            //After Line Effects Here
            if (ID == 1) {
                Boom(entity, x, y, z)
            }
        }
    });
    var th = new MyThread();
    th.start();
}

function FrontVectors(entity, dr, dp, distance, mode) {
    if (mode == 1) var angle = dr + entity.getRotation()
    if (mode == 0) var angle = dr
    var pitch = (-entity.getPitch() + dp) * Math.PI / 180
    var dx = -Math.sin(angle * Math.PI / 180) * (distance * Math.cos(pitch))
    var dy = Math.sin(pitch) * distance
    var dz = Math.cos(angle * Math.PI / 180) * (distance * Math.cos(pitch))
    return [dx, dy, dz]
}


//end