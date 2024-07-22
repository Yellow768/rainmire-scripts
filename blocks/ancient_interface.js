
function interact(e) {
    if (!e.npc.storeddata.has("on")) {
        e.npc.storeddata.put("on", 0)
    }
    var on = e.npc.storeddata.get("on")

    switch (on) {
        case 0:
            on = 1
            e.npc.display.setSkinTexture("iob:textures/block/ancient_interface_off.png")
            break;
        case 1:
            on = 0
            e.npc.display.setSkinTexture("iob:textures/block/ancient_interface_on.png")
            break;


    }
    e.npc.updateClient()


    e.npc.storeddata.put("on", on)
}