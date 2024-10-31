var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/boiler/scoreboard.js')
load(api.getLevelDir() + '/scripts/ecmascript/boiler/commonFunctions.js')
function tick(e) {
    if (getScore("NatanoDoor", "global") == 1 && !e.npc.storeddata.get("saved")) {
        if (e.npc.name == "Natano") {
            e.API.clones.spawn(895, 97, 1234, 5, "Natano", e.npc.world)
        }
        if (e.npc.name == "Reia") {
            e.API.clones.spawn(879, 95, 1181, 5, "Reia", e.npc.world)
        }
        e.npc.say(getRandomElement(["Thank you!", "Thank heavens!", "See you back at Shilo!"]))
        e.npc.setPosition(617, 80, 1407)
        e.npc.setHome(617, 80, 1407)
        e.npc.storeddata.put("saved", 1)
    }

}

function interact(e) {
    if (e.player.isSneaking()) {
        e.npc.storeddata.put("saved", 0)
    }
}