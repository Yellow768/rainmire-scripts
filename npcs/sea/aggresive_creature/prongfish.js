var i = 0
function init(e) {
    e.npc.timers.stop(10)
    e.npc.timers.stop(20)
    e.npc.timers.stop(15)
    e.npc.display.setSize(5)
}

function target(e) {
    e.npc.timers.forceStart(10, getRandomInt(20, 120), false)
}

function targetLost(e) {
    e.npc.timers.stop(10)
    e.npc.timers.stop(20)
    e.npc.timers.stop(15)
    e.npc.display.setSize(5)
}

function died(e) {
    e.npc.timers.stop(10)
    e.npc.timers.stop(20)
    e.npc.timers.stop(15)
}

function timer(e) {
    if (e.id == 10) {
        e.npc.timers.start(20, 40, false)
        e.npc.display.setSize(4)
        e.npc.updateClient()
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.puffer_fish.blow_up", 1, 1)
    }
    if (e.id == 20) {
        e.npc.display.setSize(5)
        e.npc.updateClient()
        for (var i = 0; i < 9; i++) {

            var pos = FrontVectors(e.npc, e.npc.rotation + (50 * i), getRandomInt(-90, 90), 1, 0)
            var prong = e.API.getClones().spawn(e.npc.x + pos[0], e.npc.y, e.npc.z + pos[2], 3, "Prong Projectile", e.npc.world)
            prong.setMotionX(pos[0])
            prong.setMotionY(pos[1] / 2)
            prong.setMotionZ(pos[2])
            prong.rotation = e.npc.rotation + (30 * i) + 90
            prong.updateClient()
            e.npc.timers.stop(15)
            e.npc.timers.forceStart(10, getRandomInt(20, 120), false)
        }
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.puffer_fish.blow_out", 1, 1)
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.bee.sting", 1, 1)
    }
}

