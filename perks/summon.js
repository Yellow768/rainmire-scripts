var summoned = []
function perk_summon(e, cost) {
    if (!attemptToUseHydration(e, cost)) {
        return
    }
    var block = e.player.rayTraceBlock(8, true, true)
    if (block == null) {
        block = e.player
    }
    else {
        block = block.getBlock()
    }
    e.player.world.spawnParticle("minecraft:falling_water", block.x, block.y + 1, block.z, .3, .3, .3, 1, 1000)
    e.player.world.playSoundAt(block.pos, "minecraft:entity.player.splash", 1, 1)
    var summon = e.API.clones.spawn(block.x, block.y + 1, block.z, 2, "Water Summon", e.player.world)
    summon.trigger(1, [e.player])
    summon.role.setFollowing(e.player)
    summon.addTag("companion")
    summoned.push(summon)
    spawnSummonCircularParticles(e, "minecraft:poof", 1, .2, 1, summon.pos)
}

function spawnSummonCircularParticles(e, particle, radius, speed, amount, pos) {
    var JavaMath = Java.type("java.lang.Math");
    var y = 1;
    for (var d = 0; d < JavaMath.PI * 2 * radius; d += JavaMath.PI / 20) {
        var x = radius * Math.cos(d);
        var z = radius * Math.sin(d);
        var px = pos.getX() + x;
        var pz = pos.getZ() + z;
        var py = pos.getY() + y;
        e.player.world.spawnParticle(particle, px, py, pz, 0, 0, 0, speed, amount);

    }
}

function removeNpcFromArray(e, npc) {
    summoned = summoned.splice(summoned.indexOf(npc), 1)
}