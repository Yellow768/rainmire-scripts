var API = Java.type('noppes.npcs.api.NpcAPI').Instance();

var world = API.getIWorld("overworld")
function tickEventPlayerTickEvent(e) {
    var noppesPlayer = API.getIEntity(e.event.player)
    if (noppesPlayer.hasTag("levitating")) {
        noppesPlayer.setMotionY(0)
        noppesPlayer.world.spawnParticle("falling_water", noppesPlayer.x, noppesPlayer.y - 2, noppesPlayer.z, 0.1, .7, 0.1, 1, 50)
        noppesPlayer.world.spawnParticle("bubble_pop", noppesPlayer.x, noppesPlayer.y, noppesPlayer.z, 0.3, .2, 0.3, .01, 100)

    }
    if (noppesPlayer.hasTag("isDashing")) {
        var angle = noppesPlayer.getRotation()
        var dx = -Math.sin(angle * Math.PI / 180)
        var dz = Math.cos(angle * Math.PI / 180)
        // noppesPlayer.world.spawnParticle("cloud", noppesPlayer.x, noppesPlayer.y + 1, noppesPlayer.z, 0.1, .1, 0.1, .01, 5)
        noppesPlayer.world.spawnParticle("bubble_pop", noppesPlayer.x - dx, noppesPlayer.y + 1, noppesPlayer.z - dz, 0.1, .1, 0.1, .01, 50)
        noppesPlayer.world.spawnParticle("falling_water", noppesPlayer.x - dx, noppesPlayer.y + 1, noppesPlayer.z - dz, 0.1, .2, 0.1, 1, 5)
    }
}

function worldOut(text) {
    return API.getIWorld("overworld").broadcast(text);
}

