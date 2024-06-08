var lastLightBlockPos
var lastLightWasWater = false
function init(e) {
    lastLightBlockPos = e.npc.pos
    e.npc.timers.forceStart(987001, 1, true)
}

function timer(e) {
    if (e.id == 987001) {
        if (lastLightBlockPos == e.npc.pos) {
            return
        }
        else {
            if (!lastLightWasWater) {
                e.npc.world.removeBlock(lastLightBlockPos)
            }
            else {
                e.npc.world.setBlock(lastLightBlockPos, "water")
            }
            if (e.npc.world.getBlock(e.npc.pos).isAir()) {
                e.npc.executeCommand("/setblock ~ ~ ~ minecraft:light[level=9]")
                lastLightBlockPos = e.npc.pos
                lastLightWasWater = false
            }
            else if (e.npc.world.getBlock(e.npc.pos).name == "minecraft:water") {
                if (e.npc.world.getBlock(e.npc.pos).getProperty("level") > 0) {
                    e.npc.executeCommand("/setblock ~ ~1 ~ minecraft:light[level=9]")
                    lastLightBlockPos = e.npc.pos.up(1)
                    lastLightWasWater = false
                }
                else {
                    e.npc.executeCommand("/setblock ~ ~ ~ minecraft:light[waterlogged=true,level=9]")
                    lastLightBlockPos = e.npc.pos
                    lastLightWasWater = true
                }
            }
        }
    }
}