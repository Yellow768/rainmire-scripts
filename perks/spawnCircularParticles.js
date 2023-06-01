function spawnCircularParticles(e, particle, radius, speed, amount, pos) {
    var JavaMath = Java.type("java.lang.Math");
    var y = 1;
    for (var d = 0; d < JavaMath.PI * 2 * radius; d += JavaMath.PI / 20) {
        var x = radius * Math.cos(d);
        var z = radius * Math.sin(d);
        var px = pos.getX() + x;
        var pz = pos.getZ() + z;
        var py = pos.getY() + y;
        if (particle == "hurricane") {
            executeCommand("/particle minecraft:dust .2 .5 1 2 " + toFixed(px, 5) + " " + toFixed(py, 5) + " " + toFixed(pz, 5) + " 0 0 0 .5 1")
        }
        else {
            e.player.world.spawnParticle(particle, px + .5, py, pz + .5, 0, 0, 0, speed, amount);
        }


    }
}

function toFixed(num, fixed) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
}