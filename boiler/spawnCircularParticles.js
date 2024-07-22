function spawnCircularParticles(world, particle, radius, speed, amount, x, y, z) {
    var JavaMath = Java.type("java.lang.Math");
    var ry = 1;
    for (var d = 0; d < JavaMath.PI * 2 * radius; d += JavaMath.PI / 20) {
        var rx = radius * Math.cos(d);
        var rz = radius * Math.sin(d);
        var px = rx + x;
        var pz = rz + z;
        var py = ry + y;
        if (particle == "hurricane") {
            executeCommand("/particle minecraft:dust .2 .5 1 2 " + toFixed(px, 5) + " " + toFixed(py, 5) + " " + toFixed(pz, 5) + " 0 0 0 .5 1")
        }
        else {
            world.spawnParticle(particle, px, py, pz, 0, 0, 0, speed, amount);
        }


    }
}

function toFixed(num, fixed) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
}