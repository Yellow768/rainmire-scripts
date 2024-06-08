var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + "/scripts/ecmascript/boiler/id_generator.js");
function init(e) {

    if (e.npc.storeddata.has("navSpeed") && e.npc.ai.getWalkingSpeed() == 0) {
        e.npc.ai.setWalkingSpeed(e.npc.storeddata.get("navSpeed"))
    }
}

function target(e) {
    if (e.npc.ai.getWalkingSpeed() != 0) {
        e.npc.storeddata.put("navSpeed", e.npc.ai.getWalkingSpeed())

    }
    e.npc.ai.setWalkingSpeed(0)
    e.npc.timers.forceStart(id("properWaterNav"), 1, true)
}

function targetLost(e) {
    e.npc.ai.setWalkingSpeed(e.npc.storeddata.get("navSpeed"))
    e.npc.timers.stop(id("properWaterNav"))

}


function timer(e) {
    if (e.id == id("properWaterNav"))
        if (e.npc.getAttackTarget()) {
            var dir = GetPlayerRotation(e.npc, e.npc.getAttackTarget())
            e.npc.rotation = dir
            var d = FrontVectors(e.npc, dir, e.npc.y - e.npc.getAttackTarget().y, e.npc.storeddata.get("navSpeed") / 10, 0)
            var offsetX = d[0]
            var offsetY = d[1]
            var offsetZ = d[2]
            if (offsetX > 0) offsetX = Math.ceil(offsetX)
            if (offsetX < 0) offsetX = Math.floor(offsetX)
            if (offsetY >= 0) offsetY = Math.ceil(offsetY)
            if (offsetY <= 0) offsetY = Math.floor(offsetY)
            if (offsetZ > 0) offsetZ = Math.ceil(offsetZ)
            if (offsetZ < 0) offsetZ = Math.floor(offsetZ)

            if (e.npc.world.getBlock(e.npc.pos.add(0, -offsetY * 1.5, 0)).name == "minecraft:water") {
                e.npc.setMotionY(-d[1] * 10)
            }
            if ((e.npc.world.getBlock(e.npc.pos.add(offsetX, 0, offsetZ)).name == "minecraft:water") && e.npc.inWater()) {
                e.npc.setMotionX(d[0])
                e.npc.setMotionZ(d[2])
            }
        }
    if (!e.npc.inWater()) {
        e.npc.setMotionY(-.2)
    }
}