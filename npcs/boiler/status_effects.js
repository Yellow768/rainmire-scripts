var effectedNPC, defaultAttackMode, defaultTint, npc, player, statusMark, npc

var PARALYSIS_ID = 123401
var PANICKED_ID = 123402
var PANICKED_JUMP = 123422
var PANICKED_SWING = 1234222
var PANICKED_SWING_OFF = 123423
var FLAME_ID = 123403
var COMPANION_BOOST_ID = 123404
var APPLY_STATUS_EFFECTS_ID = 450

function init(e) {
    npc = e.npc

}




function trigger(e) {

    if (e.id == APPLY_STATUS_EFFECTS_ID) {
        if (!npc.storeddata.has("altered")) {
            npc.storeddata.put("defaultRetaliateType", npc.ai.getRetaliateType())
            npc.storeddata.put("defaultHitbox", npc.display.getHitboxState())
            npc.storeddata.put("defaultTint", npc.display.getTint())
            npc.storeddata.put("defaultMovingType", npc.ai.getMovingType())
            npc.storeddata.put("defaultWanderingRange", npc.ai.getWanderingRange())
            npc.storeddata.put("defaultMovingPathType", npc.ai.getMovingPathType())
            npc.storeddata.put("defaultMovingPathPause", npc.ai.getMovingPathPauses())
            npc.storeddata.put("defaultWalkingSpeed", npc.ai.getWalkingSpeed())
            npc.storeddata.put("defaultNavigationType", npc.ai.getNavigationType())
            npc.storeddata.put("altered", 1)
        }
    }
    if (e.id == PARALYSIS_ID) {
        npc.storeddata.put("paralyzed", 1)
        npc.executeCommand("/particle upgrade_aquatic:yellow_jelly_blob ~ ~1 ~ .5 .5 .5 .02 30 force")
        npc.timers.forceStart(PARALYSIS_ID, e.arguments[1], false)
        changeNPCStatus()

    }
    if (e.id == PANICKED_ID) {
        npc.storeddata.put("panicked", 1)
        if (npc.name != "Water Summon") {
            npc.timers.forceStart(PANICKED_JUMP, Math.random() * (40 - 1) + 1, false)
            npc.timers.forceStart(PANICKED_SWING, Math.random() * (40 - 1) + 1, false)
            npc.timers.forceStart(PANICKED_SWING_OFF, Math.random() * (40 - 1) + 1, false)
        }
        npc.timers.forceStart(PANICKED_ID, e.arguments[1], false)
        changeNPCStatus()

    }
    if (e.id == FLAME_ID) {
        npc.setBurning(60)
        npc.executeCommand("/particle upgrade_aquatic:red_jelly_blob ~ ~1 ~ .5 .5 .5 .02 30 force")
    }



}


function timer(e) {
    if (e.id == PARALYSIS_ID) {
        npc.storeddata.remove("paralyzed")
        changeNPCStatus()
    }
    if (e.id == PANICKED_ID) {
        npc.storeddata.remove("panicked")
        npc.timers.stop(PANICKED_JUMP)
        npc.timers.stop(PANICKED_SWING)
        npc.timers.stop(PANICKED_SWING_OFF)
        changeNPCStatus()
    }
    if (e.id == PANICKED_JUMP) {
        npc.jump()
        npc.timers.forceStart(PANICKED_JUMP, Math.random() * (40 - 1) + 1, false)
    }
    if (e.id == PANICKED_SWING) {
        npc.swingMainhand()
        var rT = npc.rayTraceEntities(2, false, true)
        if (rT.length != 0) {
            rT[0].damage(npc.getStats().getMelee().getStrength())
        }
        npc.timers.forceStart(PANICKED_SWING, Math.random() * (40 - 1) + 1, false)
    }
    if (e.id == PANICKED_SWING_OFF) {
        npc.swingOffhand()
        npc.timers.forceStart(PANICKED_SWING_OFF, Math.random() * (40 - 1) + 1, false)
    }

}

function changeNPCStatus() {
    npc.storeddata.put("hasStatusEffect", 0)
    npc.ai.setRetaliateType(npc.storeddata.get("defaultRetaliateType"))
    npc.display.setHitboxState(npc.storeddata.get("defaultHitbox"))
    npc.display.setTint(npc.storeddata.get("defaultTint"))
    npc.ai.setMovingPathType(npc.storeddata.get("defaultMovingPathType"), npc.storeddata.get("defaultMovingPathPause"))
    npc.ai.setMovingType(npc.storeddata.get("defaultMovingType"))
    npc.ai.setWalkingSpeed(npc.storeddata.get("defaultWalkingSpeed"))
    npc.ai.setNavigationType(npc.storeddata.get("defaultNavigationType"))
    if (statusMark == undefined) {
        statusMark = npc.addMark(0)
    }
    statusMark.setType(0)

    if (npc.storeddata.has("panicked")) {
        if (npc.name != "Water Summon") {
            npc.ai.setRetaliateType(1)
        }
        npc.ai.setMovingPathType(0, false)
        npc.ai.setMovingType(1)
        npc.display.setTint(10494192)
        npc.storeddata.put("hasStatusEffect", 1)
        statusMark.setType(1)
        statusMark.setColor(10494192)

    }
    if (npc.storeddata.has("paralyzed")) {
        if (npc.name != "Water Summon") {
            npc.ai.setRetaliateType(3)
            npc.display.setHitboxState(2)
        }

        npc.display.setTint(16776960)
        npc.ai.setWalkingSpeed(0)
        statusMark.setType(5)
        statusMark.setColor(16776960)
        npc.storeddata.put("hasStatusEffect", 1)
        if (npc.ai.getNavigationType() == 1) {
            npc.ai.setNavigationType(0)
        }
    }
    statusMark.update()
    var curPos = npc.pos
    if (npc.storeddata.get("hasStatusEffect") != 1) {
        npc.removeMark(statusMark)
        npc.storeddata.remove("altered")
        npc.trigger(123406, [npc])

        try {
            undoStatusEffects(e)
        } catch (e) {

        }

    }
    else {
        npc.world.playSoundAt(npc.pos, "upgrade_aquatic:entity.jellyfish.death", 1, 1)
        npc.world.playSoundAt(npc.pos, "minecraft:entity.turtle.egg_break", 1, 1)
        npc.trigger(123405, [npc])
    }

}