

function interact(e) {
    spawnParticleRing(e.player.world, "flame", e.player.x, e.player.y, e.player.z, 40, 2, 3, -25, -45)
}

function spawnParticleRing(world, particle, x, y, z, points, width, height, rotation, pitch) {
    var t = 0
    for (var i = 0; i < points; i++) {
        if (t < 20) {
            t += 20 / points
        }
        else {
            t = 0
        }
        var sx = Math.sin(t) * width
        var sy = Math.cos(t) * height
        var sz = 0
        var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
        api.executeCommand(world, "execute positioned " + x + " " + y + " " + z + " rotated " + rotation + " " + pitch + " run particle " + particle + " ^" + sx.toFixed(4) + " ^" + sy.toFixed(4) + " ^" + sz.toFixed(4) + " 0 0 0 0 0 force @a")
    }
}
