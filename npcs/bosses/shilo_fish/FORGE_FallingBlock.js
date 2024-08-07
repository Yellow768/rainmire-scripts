var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
function entityLeaveLevelEvent(e) {
    if (e.entity.name == "Falling Stone") {
        API.executeCommand(API.getIWorld("overworld"), "/particle block stone " + e.entity.x + " 34 " + e.entity.z + " .5 .5 .5 1 10 force")
        if (Math.random() < .1) {
            API.getIWorld("overworld").playSoundAt(e.entity.pos, "minecraft:entity.turtle.egg_break", .4, Math.random())
        }
    }
}

function worldOut(text) {
    return API.getIWorld("overworld").broadcast(text);
}