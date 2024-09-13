var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/')
var i = 0
function init(e) {

    e.npc.timers.stop(10)
    e.npc.timers.stop(20)
    e.npc.display.setSize(5)
    e.npc.timers.forceStart(id("prongfish_projectile"), 0, true)

}

function target(e) {
    e.npc.timers.forceStart(10, getRandomInt(20, 120), false)
}

function targetLost(e) {
    e.npc.timers.stop(10)
    e.npc.timers.stop(20)
    e.npc.display.setSize(5)
}

function died(e) {
    e.npc.timers.stop(10)
    e.npc.timers.stop(20)
}
var projectile_array = []

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
        for (var layer = 0; layer < 3; layer++) {
            var layer_angles = [45, 0, -45]
            for (var i = 0; i < 4; i++) {
                var pos = FrontVectors(e.npc, e.npc.rotation + (90 * i), layer_angles[layer], 1, 0)
                var projectile = e.npc.shootItem(e.npc.x + pos[0], e.npc.y + pos[1], e.npc.z + pos[3], e.npc.world.createItem("golden_sword", 1), 100)
                projectile.setHasGravity(false)
                var nbt = projectile.getEntityNbt()
                nbt.setBoolean("NoGravity", true)
                projectile.setEntityNbt(nbt)
                projectile.rotation = e.npc.rotation + (90 * i)
                projectile.tempdata.put("direction", pos)
                projectile.tempdata.put("time", 0)
                projectile_array.push(projectile)

            }
        }
        e.npc.timers.forceStart(10, getRandomInt(20, 120), false)
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.puffer_fish.blow_out", 1, 1)
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.bee.sting", 1, 1)
    }
    if (e.id == id("prongfish_projectile")) {
        for (var i = 0; i < projectile_array.length; i++) {
            var p = projectile_array[i]
            p.setMotionX(p.tempdata.get("direction")[0])
            p.setMotionY(p.tempdata.get("direction")[1])
            p.setMotionZ(p.tempdata.get("direction")[2])
            if (p.tempdata.get("time") >= 30 || !p.inWater()) {
                p.kill()
                projectile_array.splice(i, 1)
                return
            }
            p.tempdata.put("time", p.tempdata.get("time") + 1)
        }
    }
}

