var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/npcs/boiler/base_npc_script.js')

/*
NPC
applies attributes to the entity


*/

state_idle.enter = function (e) {

    if (e.npc.storeddata.get("passive_mob")) {
        hideNPC(e)
        createMob(e, null)
        e.npc.timers.forceStart(1, 0, true)
    }
}

state_idle.init = function (e) {
    if (e.npc.storeddata.has("uuid")) {
        var mob = attemptToFindMob(e)
        if (mob) {
            e.npc.tempdata.put("mob", mob)
            return
        }
        e.npc.storeddata.remove("uuid")
        e.npc.timers.stop(1)
        resetNPC(e)
        return
    }
    if (e.npc.isAlive()) {
        resetNPC(e)
        if (e.npc.storeddata.get("passive_mob")) {
            hideNPC(e)
            createMob(e, null)
            e.npc.timers.forceStart(1, 0, true)
        }
    }
}

state_idle.interact = function (e) {
    if (e.player.isSneaking()) {
        e.npc.tempdata.put("disabled", 1)
        e.player.message("&eNPC will not change model. Change model and right click to set")
        return
    }
    e.npc.storeddata.put("mob_model", e.npc.display.getModel())
    e.npc.storeddata.put("original_skin", e.npc.display.getSkinTexture())
    e.npc.storeddata.put("extra_model_data", e.npc.getEntityNbt().getCompound("NpcModelData").toJsonString())
    e.player.message("&eSet the NPCs model")
    e.npc.tempdata.remove("disabled")
}

state_idle.damaged = function (e) {
    if (e.source && e.source.type == 1) {
        if (e.source.isSneaking()) {
            e.npc.storeddata.put("passive_mob", 1)
        }
    }
}

state_idle.target = function (e) {
    if (e.npc.storeddata.has("uuid")) {
        return
    }
    hideNPC(e)
    createMob(e, e.entity)
    e.npc.timers.forceStart(1, 0, true)
    e.npc.timers.forceStart(3, 0, true)
}

function hideNPC(e) {
    e.npc.storeddata.put("name", e.npc.name)
    e.npc.storeddata.put("color", e.npc.getFaction().getColor().toString(16))
    e.npc.display.setSkinTexture("iob:textures/skins/empty.png")
    e.npc.display.setModel("")
    e.npc.display.setHitboxState(1)
    e.npc.storeddata.put("show_name", e.npc.display.getShowName())
    e.npc.display.setShowName(1)
    e.npc.updateClient()
}

function createMob(e, target) {
    var mob = e.npc.world.createEntity(e.npc.storeddata.get("mob_model"))
    e.npc.tempdata.put("mob", mob)
    e.npc.storeddata.put("uuid", mob.getUUID())
    mob.x = e.npc.x
    mob.y = e.npc.y
    mob.z = e.npc.z
    mob.spawn()
    mob.setMaxHealth(e.npc.getMaxHealth())
    mob.setHealth(e.npc.health)
    var nbt = mob.getEntityNbt()
    nbt.putString("DeathLootTable", "minecraft:empty")
    if (e.npc.storeddata.get("show_name") != 1) {
        nbt.putString("CustomName", '{"italic":false,"extra":[{"text":""},{"color":"#' + e.npc.storeddata.get("color") + '","text":"' + e.npc.storeddata.get("name") + '"}],"text":""}')
        nbt.setByte("CustomNameVisible", 1)
    }
    nbt.setByte("PersistenceRequired", 1)
    nbt.setByte("isBaby", 0)
    mob.setEntityNbt(nbt)
    mob.tempdata.put("parent", e.npc)
    e.npc.executeCommand("/attribute @e[type=" + e.npc.storeddata.get("mob_model") + ",limit=1,distance=..1] minecraft:generic.knockback_resistance base set " + (e.npc.getStats().getResistance(3) - 1))
    e.npc.executeCommand("/attribute @e[type =" + e.npc.storeddata.get("mob_model") + ",limit=1,distance=..1] minecraft:generic.movement_speed base set " + e.npc.getAi().getWalkingSpeed() / 9)
    e.npc.executeCommand("/data modify entity @e[type=" + e.npc.storeddata.get("mob_model") + ",limit=1,distance=..1] HandDropChances set value [0f, 0f]")
    e.npc.executeCommand("/data modify entity @e[type=" + e.npc.storeddata.get("mob_model") + ",limit=1,distance=..1] ArmorDropChances set value [0f, 0f]")
    if (target) {
        e.npc.executeCommand("/attribute @e[type=" + e.npc.storeddata.get("mob_model") + ",limit=1,distance=..1] minecraft:generic.attack_damage base set " + e.npc.getStats().getMelee().getStrength())
        e.npc.executeCommand("/attribute @e[type=" + e.npc.storeddata.get("mob_model") + ",limit=1,distance=..1] minecraft:generic.attack_knockback base set " + e.npc.getStats().getMelee().getKnockback())

        mob.setAttackTarget(e.entity)
    }
}

state_idle.timer = function (e) {
    var mob = e.npc.tempdata.get("mob")
    if (!mob) {
        mob = attemptToFindMob(e)
        if (!mob) {
            e.npc.storeddata.remove("uuid")
            e.npc.timers.stop(1)
            e.npc.timers.stop(2)
            e.npc.tempdata.remove("mob")
            return
        }
    }
    if (e.id == 1) {

        if (!mob.isAlive()) {
            e.npc.executeCommand("/execute positioned " + mob.x + " " + mob.y + " " + mob.z + " run kill @e[type=minecraft:experience_orb,distance=..1]")
            e.npc.x = mob.x
            e.npc.y = mob.y
            e.npc.z = mob.z
            e.npc.kill()
            e.npc.storeddata.remove("uuid")
            e.npc.tempdata.remove("mob")
            e.npc.timers.stop(1)
        }

    }
    if (e.id == 3) {
        //check if hostile mob is idle
        if (mob.getAttackTarget() == null && !e.npc.timers.has(2)) {
            e.npc.timers.start(2, 200, false)
        }
        if (mob.getAttackTarget() && e.npc.timers.has(2)) {
            e.npc.timers.stop(2)
        }
    }
    if (e.id == 2) {
        e.npc.timers.stop(1)
        e.npc.x = mob.x
        e.npc.y = mob.y
        e.npc.z = mob.z
        e.npc.rotation = mob.rotation
        e.npc.health = mob.health
        mob.despawn()
        e.npc.storeddata.remove("uuid")
        resetNPC(e)

    }
}


function resetNPC(e) {
    if (npc.tempdata.has('disabled')) return
    npc.display.setModel(npc.storeddata.get("mob_model"))
    npc.display.setSkinTexture(npc.storeddata.get("original_skin"))
    npc.display.setHitboxState(0)

    if (npc.storeddata.has("show_name")) {
        npc.display.setShowName(npc.storeddata.get("show_name"))
        npc.storeddata.remove("show_name")
    }
    npc.updateClient()
}



function attemptToFindMob(e) {
    var nE = e.npc.world.getNearbyEntities(e.npc.pos, 128, 5)
    for (var i = 0; i < nE.length; i++) {
        if (nE[i].getUUID() == e.npc.storeddata.get("uuid")) {
            nE[i].tempdata.put("parent", e.npc)
            return nE[i]
        }
    }
    return null

}


state_paralyzed.enter = function (e) {
    var mob = npc.tempdata.get("mob")
    if (mob) {
        resetNPC(e)
        npc.x = mob.x
        npc.y = mob.y
        npc.z = mob.z
        npc.rotation = mob.rotation
        mob.despawn()
        npc.timers.stop(1)
        npc.timers.stop(2)
        npc.tempdata.remove("mob")
        npc.storeddata.remove("uuid")
    }
    state_paralyzed.applyParalyzedEffects(e)
}
state_panicking.enter = function (e) {
    var mob = npc.tempdata.get("mob")
    if (mob) {
        resetNPC(e)
        npc.x = mob.x
        npc.y = mob.y
        npc.z = mob.z
        npc.rotation = mob.rotation
        mob.despawn()
        npc.timers.stop(1)
        npc.timers.stop(2)
        npc.tempdata.remove("mob")
        npc.storeddata.remove("uuid")
    }
    state_panicking.applyPanickingEffects(e)
}
