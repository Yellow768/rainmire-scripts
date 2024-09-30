var lockpick_interact = function (e) {
    if (e.type == 2 && e.target.hasTileEntity()) {
        if (e.player.getMainhandItem().getDisplayName() == "Dev Locker") { changeContainerLockStrength(e) }
        if (e.target.storeddata.get("LockDifficulty") != undefined && e.target.storeddata.get("LockDifficulty") > 0) {

            switch (e.player.getMainhandItem().getDisplayName()) {
                case "Shabby Lockpick":
                    pickLock(e, 10, 768001)
                    break;
                case "Average Lockpick":
                    pickLock(e, 20, 768002)
                    break;
                case "Apprentice Lockpick":
                    pickLock(e, 30, 768003)
                    break;
                case "Master Lockpick":
                    pickLock(e, 50, 768004)
                    break;
                case "Dev Locker":
                    break;
                case "Lock Destroyer":
                    pickLock(e, 1000, 768005)
                default:
                    e.setCanceled(true)
                    executeCommand('/title ' + e.player.name + ' actionbar {"text":"Locked! Lock Strength: ' + e.target.storeddata.get("LockDifficulty") + '%","bold":true,"color":"red"}')
                    executeCommand("/playsound minecraft:entity.shulker.close player @a[x=" + e.player.x + ",y=" + e.player.y + ",z=" + e.player.z + ",distance=..5] " + e.player.x + " " + e.player.y + " " + e.player.z)

            }
        }
    }
    if (e.type == 0 && e.player.getMainhandItem().getDisplayName() == "Dev Locker") { changePlayerLockModifier(e) }

}


function changeContainerLockStrength(e) {
    e.setCanceled(true)
    var lockDifficultySetter
    var sound

    if (e.player.storeddata.get("LockModifier") == undefined) { e.player.storeddata.put("LockModifier", 10) }
    lockDifficultySetter = e.player.storeddata.get("LockModifier")
    sound = "minecraft:ui.button.click"

    if (e.player.isSneaking()) {
        lockDifficultySetter *= -1
        sound = "supplementaries:block.tick_1"
    }
    if (e.target.storeddata.get("LockDifficulty") == undefined) {
        e.target.storeddata.put("LockDifficulty", 0)
    }
    executeCommand('data merge block ' + e.target.x + ' ' + e.target.y + ' ' + e.target.z + ' {Lock:"True"}')
    e.target.storeddata.put("LockDifficulty", e.target.storeddata.get("LockDifficulty") + lockDifficultySetter)

    if (e.target.storeddata.get("LockDifficulty") < 1) {
        executeCommand('data merge block ' + e.target.x + ' ' + e.target.y + ' ' + e.target.z + ' {Lock:""}')
        e.target.storeddata.put("LockDifficulty", 0)
    }

    executeCommand('/title ' + e.player.name + ' actionbar {"text":"Lock Strength Set To ' + e.target.storeddata.get("LockDifficulty") + '%","color":"green"}')
    executeCommand("/playsound " + sound + " player @a[x=" + e.player.x + ",y=" + e.player.y + ",z=" + e.player.z + ",distance=..5] " + e.player.x + " " + e.player.y + " " + e.player.z)
}

function changePlayerLockModifier(e) {
    if (e.player.storeddata.get("LockModifier") == undefined) { e.player.storeddata.put("LockModifier", 10) }

    if (e.player.isSneaking()) { e.player.storeddata.put("LockModifier", e.player.storeddata.get("LockModifier") - 10) }
    else { e.player.storeddata.put("LockModifier", e.player.storeddata.get("LockModifier") + 10) }

    if (e.player.storeddata.get("LockModifier") < 10) { e.player.storeddata.put("LockModifier", 10) }

    executeCommand('/title ' + e.player.name + ' actionbar {"text":"Dev Locker Set to ' + e.player.storeddata.get("LockModifier") + '% strength","color":"green"}')
}


function pickLock(e, lockDamage, customModelData) {
    var lockStrength
    if (lockDamage > 0) {
        if (customModelData != 0) {
            executeCommand("clear " + e.player.name + " minecraft:tripwire_hook{CustomModelData:" + customModelData + "} 1")
            executeCommand("/particle item minecraft:tripwire_hook{CustomModelData:" + customModelData + "} " + e.player.x + " " + (e.player.y + 1) + " " + e.player.z + " .5 .2 .5 .4 10")
        }

        executeCommand("/playsound minecraft:entity.item_frame.rotate_item player @a[x=" + e.player.x + ",y=" + e.player.y + ",z=" + e.player.z + ",distance=..5] " + e.player.x + " " + e.player.y + " " + e.player.z)


        var damageModifier = 5 * (getScore("Mind") - 1)
        e.target.storeddata.put("LockDifficulty", e.target.storeddata.get("LockDifficulty") - (lockDamage + damageModifier))

        if (e.target.storeddata.get("LockDifficulty") > 0) {
            e.setCanceled(true)
            lockStrength = e.target.storeddata.get("LockDifficulty")
            executeCommand('/title ' + e.player.name + ' actionbar {"text":"Lock Picked Down To ' + lockStrength + '%","bold":true,"color":"yellow"}')
            executeCommand("/playsound iob:ui.lockpick player @a[x=" + e.player.x + ",y=" + e.player.y + ",z=" + e.player.z + ",distance=..5] " + e.player.x + " " + e.player.y + " " + e.player.z)
        }
        else {
            executeCommand('/title ' + e.player.name + ' actionbar {"text":"Lock Picked!","bold":true,"color":"green"}')
            executeCommand('data merge block ' + e.target.x + ' ' + e.target.y + ' ' + e.target.z + ' {Lock:""}')
            executeCommand("/playsound iob:ui.trap_disabled player @a[x=" + e.player.x + ",y=" + e.player.y + ",z=" + e.player.z + ",distance=..5] " + e.player.x + " " + e.player.y + " " + e.player.z)
        }
    }
}
