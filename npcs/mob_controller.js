var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/boiler/commonFunctions.js')
load(api.getLevelDir() + '/scripts/ecmascript/boiler/id_generator.js')

var real_mob, npc

function init(e) {
    if (!e.npc.storeddata.has("editing_mode")) {
        e.npc.storeddata.put("editing_mode", 1)
    }
    npc = e.npc
    var nE = e.npc.world.getNearbyEntities(e.npc.pos, 50, 5)
    for (var i = 0; i < nE.length; i++) {
        if (nE[i].getStoreddata().get("controller_npc") == e.npc.getUUID()) {
            real_mob = nE[i]
            real_mob.getTempdata().put("controller_npc", e.npc)
            return
        }
    }
    if (e.npc.storeddata.get("editing_mode")) {
        return
    }
    if (!e.npc.timers.has(768005) && e.npc.storeddata.has("mob")) {
        summonMob(e)
    }

}



function damaged(e) {
    if (e.npc.getDisplay().getVisible() == 1) {
        e.setCanceled(true)
    }
}

/**
 * @param {NpcEvent.TargetEvent} e
 */
function interact(e) {
    if (e.player.gamemode != 1) return
    if (e.player.isSneaking()) {
        var editingMode = e.npc.getStoreddata().get("editing_mode")
        if (editingMode) {
            editingMode = 0
            e.npc.say("Editing Mode Disabled")
            e.player.message("&eMob Controller Settings Saved")
            e.npc.getStoreddata().put("mob", e.npc.getDisplay().getModel())
            e.npc.getStoreddata().put("faction", e.npc.getFaction().getId())
            e.npc.getStoreddata().put("editing_mode", editingMode)
            return
        }
        else {
            editingMode = 1
            e.npc.say("Editing Mode Enabled")
            e.npc.getStoreddata().put("editing_mode", editingMode)
            e.npc.timers.stop(76805)
            e.npc.setFaction(e.npc.getStoreddata().get("faction"))
            return
        }
    }
    if (e.npc.getStoreddata().get("editing_mode")) {
        e.player.message("&cStill in Editing Mode. Sneak Right Click to disable.")
    }
    else {
        summonMob(e)
        e.player.message("Mob Summoned")
        e.npc.getDisplay().setModel("armor_stand")
        e.npc.getDisplay().setVisible(1)
        e.npc.getDisplay().setHitboxState(1)
        e.npc.getDisplay().setSize(1)
        e.npc.setFaction(4)
        e.npc.updateClient()
        e.npc.reset()
        e.npc.timers.forceStart(id("check_mob_range"), 20, true)
    }
}

function summonMob(e) {
    if (real_mob) real_mob.despawn()
    e.npc.say("Mob Summoned")
    var mob_name = e.npc.getStoreddata().get("mob")
    e.npc.executeCommand('summon ' + mob_name + ' ~ ~-.5 ~')
    var nE = e.npc.getWorld().getNearbyEntities(e.npc.pos, 5, 5)
    for (var i = 0; i < nE.length; i++) {
        if (nE[i].getTypeName() == mob_name) {
            real_mob = nE[i]
        }
    }
    real_mob.getStoreddata().put("controller_npc", e.npc.getUUID())

    var nbt = real_mob.getEntityNbt()
    nbt.putString("DeathLootTable", "minecraft:empty")
    if (e.npc.getDisplay().getShowName() != 1) {
        nbt.putString("CustomName", '{"italic":false,"extra":[{"text":""},{"color":"#' + e.API.getFactions().getFaction(npc.getStoreddata().get("faction")).getColor().toString(16) + '","text":"' + e.npc.getDisplay().getTitle() + '"}],"text":""}')
    }
    nbt.setByte("CustomNameVisible", 1)
    nbt.setByte("PersistenceRequired", 1)
    nbt.setByte("isBaby", 0)
    real_mob.setEntityNbt(nbt)

    real_mob.setMaxHealth(e.npc.getMaxHealth())
    real_mob.setHealth(e.npc.getHealth())
    real_mob.getTempdata().put("controller_npc", e.npc)
    for (var i = 0; i < 4; i++) {
        real_mob.setArmor(i, e.npc.getArmor(i))
    }

    if (!e.npc.getMainhandItem().isEmpty()) { real_mob.setMainhandItem(e.npc.getMainhandItem().copy()) }
    if (!e.npc.getOffhandItem().isEmpty()) real_mob.setOffhandItem(e.npc.getOffhandItem().copy())

    e.npc.executeCommand("/attribute @e[type=" + mob_name + ",limit=1,distance=..1] minecraft:generic.attack_damage base set " + e.npc.getStats().getMelee().getStrength())
    e.npc.executeCommand("/attribute @e[type=" + mob_name + ",limit=1,distance=..1] minecraft:generic.attack_knockback base set " + e.npc.getStats().getMelee().getKnockback())
    e.npc.executeCommand("/attribute @e[type=" + mob_name + ",limit=1,distance=..1] minecraft:generic.knockback_resistance base set " + (e.npc.getStats().getResistance(3) - 1))
    e.npc.executeCommand("/attribute @e[type=" + mob_name + ",limit=1,distance=..1] minecraft:generic.movement_speed base set " + e.npc.getAi().getWalkingSpeed() / 9)
    e.npc.executeCommand("/data modify entity @e[type=" + mob_name + ",limit=1,distance=..1] HandDropChances set value [0f, 0f]")
    e.npc.executeCommand("/data modify entity @e[type=" + mob_name + ",limit=1,distance=..1] ArmorDropChances set value [0f, 0f]")
}

/**
 * @param {NpcEvent.TimerEvent} e
 */
function trigger(e) {
    if (e.id == 76801) {
        npc.executeCommand("/execute positioned " + real_mob.x + " " + real_mob.y + " " + real_mob.z + " run kill @e[type=minecraft:experience_orb,distance=..1]")

        var experience_amt = npc.getInventory().getExpRNG()
        if (experience_amt != 0) {
            npc.executeCommand("/summon minecraft:experience_orb " + real_mob.x + " " + real_mob.y + " " + real_mob.z + " {Value:" + experience_amt + "}")
        }
        var itemsRNG = npc.getInventory().getItemsRNG()
        for (var i = 0; i < itemsRNG.length; i++) {
            var item = npc.world.createEntity("item")
            item.setItem(itemsRNG[i])
            item.x = real_mob.x
            item.y = real_mob.y + 1
            item.z = real_mob.z
            item.spawn()
            item.setMotionY(.1)
            item.setMotionZ(getRandomFloat(-0.2, 0.2))
            item.setMotionX(getRandomFloat(-0.2, 0.2))
        }
        npc.timers.forceStart(76805, npc.getStats().getRespawnTime() * 20, false)
        real_mob = null
    }
    if (e.id == 76802) {
        resetNpc()
        npc.say("Editing Mode Enabled")
        npc.getStoreddata().put("editing_mode", 1)
        real_mob = null
    }
}

function timer(e) {
    if (e.id == 76805) {
        summonMob(e)
    }
    if (e.id == id("check_mob_range")) {
        if (!real_mob && !e.npc.getStoreddata().get("editing_mode")) {
            summonMob(e)
            return
        }
        if (real_mob && real_mob.pos.distanceTo(e.npc.pos) > e.npc.stats.getAggroRange()) {
            real_mob.navigateTo(e.npc.x, e.npc.y, e.npc.z, e.npc.ai.getWalkingSpeed())
        }
    }
}

function resetNpc() {
    npc.getDisplay().setModel(npc.getStoreddata().get("mob"))
    npc.getDisplay().setVisible(0)
    npc.getDisplay().setHitboxState(0)
    npc.getDisplay().setSize(5)
    npc.setFaction(npc.getStoreddata().get("faction"))
    npc.updateClient()
}