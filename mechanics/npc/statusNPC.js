var effectedNPC, defaultAttackMode, defaultTint, thisNPC, player, statusMark

var PARALYSIS_ID = 1
var PANICKED_ID = 2
var PANICKED_JUMP = 22
var PANICKED_SWING = 222
var PANICKED_SWING_OFF = 223
var FLAME_ID = 3
var COMPANION_BOOST_ID = 4

function init(e) {
    thisNPC = e.npc
}

function trigger(e) {
    var target = e.arguments[0]
    if (!target.storeddata.has("altered")) {
        target.storeddata.put("defaultRetaliateType", target.ai.getRetaliateType())
        target.storeddata.put("defaultHitbox", target.display.getHitboxState())
        target.storeddata.put("defaultTint", target.display.getTint())
        target.storeddata.put("defaultmovingType", target.ai.getMovingType())
        target.storeddata.put("defaultWanderingRange", target.ai.getWanderingRange())
        target.storeddata.put("defaultMovingPathType", target.ai.getMovingPathType())
        target.storeddata.put("defaultMovingPathPause", target.ai.getMovingPathPauses())
        target.storeddata.put("altered", 1)
    }

    if (e.id == PARALYSIS_ID) {
        thisNPC.storeddata.put("uuid", target.getUUID())
        target.storeddata.put("paralyzed", 1)
        thisNPC.executeCommand("/particle upgrade_aquatic:yellow_jelly_blob ~ ~1 ~ .5 .5 .5 .02 30")
        thisNPC.timers.forceStart(PARALYSIS_ID, e.arguments[1], false)

    }
    if (e.id == PANICKED_ID) {
        thisNPC.storeddata.put("uuid", target.getUUID())
        target.storeddata.put("panicked", 1)
        thisNPC.executeCommand("/particle upgrade_aquatic:purple_jelly_blob ~ ~1 ~ .5 .5 .5 .02 30")
        if (target.name != "Water Summon") {
            thisNPC.timers.forceStart(PANICKED_JUMP, Math.random() * (40 - 1) + 1, false)
            thisNPC.timers.forceStart(PANICKED_SWING, Math.random() * (40 - 1) + 1, false)
            thisNPC.timers.forceStart(PANICKED_SWING_OFF, Math.random() * (40 - 1) + 1, false)
        }
        thisNPC.timers.forceStart(PANICKED_ID, e.arguments[1], false)

    }
    if (e.id == FLAME_ID) {
        thisNPC.storeddata.put("uuid", target.getUUID())
        target.setBurning(60)
        thisNPC.executeCommand("/particle upgrade_aquatic:red_jelly_blob ~ ~1 ~ .5 .5 .5 .02 30")
    }
    changeNPCStatus(target)
    thisNPC.world.playSoundAt(thisNPC.pos, "upgrade_aquatic:entity.jellyfish.death", 1, 1)
    thisNPC.world.playSoundAt(thisNPC.pos, "minecraft:entity.turtle.egg_break", 1, 1)
}


function timer(e) {
    var target = findTarget(e)
    if (e.id == PARALYSIS_ID) {
        target.storeddata.remove("paralyzed")
    }
    if (e.id == PANICKED_ID) {
        target.storeddata.remove("panicked")
    }
    if (e.id == PANICKED_JUMP) {
        target.jump()
        thisNPC.timers.forceStart(PANICKED_JUMP, Math.random() * (40 - 1) + 1, false)
    }
    if (e.id == PANICKED_SWING) {
        target.swingMainhand()
        var rT = target.rayTraceEntities(2, false, true)
        if (rT.length != 0) {
            rT[0].damage(target.getStats().getMelee().getStrength())
        }
        thisNPC.timers.forceStart(PANICKED_SWING, Math.random() * (40 - 1) + 1, false)
    }
    if (e.id == PANICKED_SWING_OFF) {
        target.swingOffhand()
        thisNPC.timers.forceStart(PANICKED_SWING_OFF, Math.random() * (40 - 1) + 1, false)
    }
    changeNPCStatus(target)
}


function findTarget(e) {
    var nE = e.npc.world.getNearbyEntities(e.npc.pos, 100, 2)
    for (var npc = 0; npc < nE.length; npc++) {
        if (nE[npc].getUUID() == e.npc.storeddata.get("uuid")) {
            return nE[npc]
        }
    }
    e.npc.despawn()
}

function changeNPCStatus(target) {
    target.storeddata.put("hasStatusEffect", 0)
    target.ai.setRetaliateType(target.storeddata.get("defaultRetaliateType"))
    target.display.setHitboxState(target.storeddata.get("defaultHitbox"))
    target.display.setTint(target.storeddata.get("defaultTint"))
    target.ai.setMovingPathType(target.storeddata.get("defaultMovingPathType"), target.storeddata.get("defaultMovingPathPauses"))
    target.ai.setMovingType(target.storeddata.get("defaultMovingType"))
    if (statusMark == undefined) {
        statusMark = target.addMark(0)
    }
    statusMark.setType(0)

    if (target.storeddata.has("panicked")) {
        if (target.name != "Water Summon") {
            target.ai.setRetaliateType(1)
        }
        target.ai.setMovingPathType(0, false)
        target.ai.setMovingType(1)
        target.display.setTint(10494192)
        target.storeddata.put("hasStatusEffect", 1)
        statusMark.setType(1)
        statusMark.setColor(10494192)

    }
    if (target.storeddata.has("paralyzed")) {
        if (target.name != "Water Summon") {
            target.ai.setRetaliateType(3)
            target.display.setHitboxState(2)
        }

        target.display.setTint(16776960)
        statusMark.setType(5)
        statusMark.setColor(16776960)
        target.storeddata.put("hasStatusEffect", 1)
    }
    statusMark.update()
    var curPos = target.pos
    if (target.storeddata.get("hasStatusEffect") != 1) {
        target.removeMark(statusMark)
        thisNPC.kill()

    }

}