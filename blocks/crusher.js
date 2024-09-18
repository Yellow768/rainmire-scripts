var in_crush_position = false
var motion = 2
var npc

function init(e) {
    if (!e.npc.storeddata.has("crushDelay")) {
        e.npc.storeddata.put("crushDelay", 20)
        e.npc.storeddata.put("releaseDelay", 20)
        e.npc.storeddata.put("initialPosition", 1)
    }
    e.npc.timers.forceStart(4, e.npc.storeddata.get("crushDelay") + e.npc.storeddata.get("releaseDelay"), true)
    e.npc.timers.forceStart(10, 40, true)
    npc = e.npc
    in_crush_position = e.npc.storeddata.get("initialPosition")
    switch (e.npc.storeddata.get("initialPosition")) {
        case 1:
            e.npc.timers.forceStart(2, e.npc.storeddata.get("crushDelay"), false)
            e.npc.setMotionY(motion)
            break;
        case 0:
            e.npc.timers.forceStart(2, e.npc.storeddata.get("releaseDelay"), false)
            e.npc.setMotionY(-motion)
            break;

    }
}


var CRUSHER_GUI



function interact(e) {
    if (e.player.gamemode == 1) {
        var initPosLabel = ["Down", "Up"]
        CRUSHER_GUI = e.API.createCustomGui(id("CRUSHER_GUI"), 256, 256, false, e.player)
        CRUSHER_GUI.addTextField(id("crusher_crushDelay"), 50, 50, 90, 25).setText(e.npc.storeddata.get("crushDelay"))
        CRUSHER_GUI.addTextField(id("crusher_releaseDelay"), 50, 80, 90, 25).setText(e.npc.storeddata.get("releaseDelay"))
        CRUSHER_GUI.addLabel(id("crusher_crushDelayLabel"), "Crush Delay", -16, 55, 1, 1, 0xffffff)
        CRUSHER_GUI.addLabel(id("crusher_releaseDelayLabel"), "Release Delay", -22, 85, 1, 1, 0xffffff)
        CRUSHER_GUI.addButton(id("crusher_initialPosition"), "Up", 50, 120, 25, 20).setLabel(initPosLabel[npc.storeddata.get("initialPosition")])
        CRUSHER_GUI.addButton(id("crusher_saveButton"), "Save", 50, 160, 25, 20)
        e.player.showCustomGui(CRUSHER_GUI)
    }
}

function customGuiButton(e) {
    e.player.message(e.buttonId)
    if (e.buttonId == id("crusher_initialPosition")) {
        switch (npc.storeddata.get("initialPosition")) {
            case 1:
                CRUSHER_GUI.getComponent(e.buttonId).setLabel("Down")
                npc.storeddata.put("initialPosition", 0)
                break;
            case 0:
                CRUSHER_GUI.getComponent(e.buttonId).setLabel("Up")
                npc.storeddata.put("initialPosition", 1)
                break;
        }
        CRUSHER_GUI.update()
    }
    if (e.buttonId == id("crusher_saveButton")) {
        npc.storeddata.put("crushDelay", CRUSHER_GUI.getComponent(id("crusher_crushDelay")).getText())
        npc.storeddata.put("releaseDelay", CRUSHER_GUI.getComponent(id("crusher_releaseDelay")).getText())
        e.player.closeGui()
        npc.reset()
    }
}

function timer(e) {
    if (e.id == 10) {
        if (!e.npc.world.getClosestEntity(e.npc.pos, 10, 1)) {
            e.npc.reset()
        }
    }
    if (e.id == 4) {
        e.npc.reset()



    }
    if (e.id == 2) {
        var motion
        switch (in_crush_position) {
            case 1:
                motion = -e.npc.stats.getRanged().getRange()
                e.npc.world.playSoundAt(e.npc.pos, "minecraft:block.piston.contract", .7, .2)
                in_crush_position = 0
                e.npc.timers.start(1, 3, false)
                e.npc.timers.forceStart(2, e.npc.storeddata.get("releaseDelay"), false)

                break;
            case 0:
                motion = e.npc.stats.getRanged().getRange()
                in_crush_position = 1
                e.npc.world.playSoundAt(e.npc.pos, "minecraft:block.piston.extend", .7, .2)
                e.npc.timers.forceStart(2, e.npc.storeddata.get("crushDelay"), false)
                break;
        }

        e.npc.setMotionY(motion)
        e.npc.rotation = 0
    }
    if (e.id == 1) {
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.item.break", 1, .2)
    }
}

function collide(e) {
    if (e.entity.type == 1 && e.entity.gamemode == 1) return
    if (e.entity.pos.distanceTo(e.npc.pos) < 2) {
        e.entity.kill()
    }

}