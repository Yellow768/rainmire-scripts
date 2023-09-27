var projectile
function init(e) {
    e.npc.stats.ranged.setSpeed(40)
    e.npc.stats.ranged.setSize(50)
    e.npc.timers.forceStart(1, getRandomInt(20, 40), false)
    projectile = e.npc.world.createItem("coal_block", 1)

}

function timer(e) {
    e.npc.timers.start(1, getRandomInt(20, 40), false)
    var nE = e.npc.world.getNearbyEntities(e.npc.pos, 80, 1)
    if (nE.length > 0) {
        e.npc.shootItem(nE[0], projectile, 100)
    }
}

function rangedLaunched(e) {
    e.projectile.enabledEvents()
}

function projectileEvent(e) {
    e.projectile.nbt.setInteger("timeTilDeath", e.projectile.nbt.getInteger("timeTilDeath"))

}