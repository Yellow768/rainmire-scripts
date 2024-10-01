function lockpick_interact(e) {
    var item = e.player.getMainhandItem()
    if (item.getDisplayName() == "Dev Locker") {
        openDevLockGUI(e)
        e.setCanceled(true)
        return
    }
    if (e.target.storeddata.get("lock_strength") > 0) {
        if (!e.player.getMainhandItem().isEmpty() && e.player.getMainhandItem().getItemNbt().toJsonString() == e.target.storeddata.get("key_item")) {
            e.setCanceled(true)
            switch (e.target.storeddata.get("unlocked")) {
                case 0:
                    displayTitle(e, "Unlocked", "green")
                    setPropertyOnBlock(e.target, "unlocked", 1)
                    e.player.playSound("minecraft:item.lodestone_compass.lock", 1, getRandomFloat(1, 1.2))
                    break;
                default:
                    setPropertyOnBlock(e.target, "unlocked", 0)
                    displayTitle(e, "Locked", "green")
                    e.player.playSound("minecraft:item.lodestone_compass.lock", 1, getRandomFloat(.2, .4))
                    break;
            }

        }
        else {
            if (!e.target.storeddata.get("unlocked"))
                if (item.getDisplayName().indexOf("Lockpick") != -1) {
                    attemptToPickLock(e, item)
                }
                else {
                    e.setCanceled(true)
                    displayTitle(e, "Locked! Strength: §a" + e.target.storeddata.get("lock_strength"), "red")
                    e.player.playSound("minecraft:item.lodestone_compass.lock", 1, getRandomFloat(.2, .4))
                }
        }

    }

}


function openDevLockGUI(e) {
    setPropertyOnBlock(e.target, "unlocked", 0)
    var GUI = e.API.createCustomGui(1, 256, 256, false, e.player)
    GUI.addLabel(2, "Block Lock Config", 128, 0, 1, 1, 0xffffff)
    GUI.addLabel(3, "Lock Strength               %", 20, 40, 1, 1, 0xffffff)
    GUI.addLabel(4, "Key Item", 20, 90, 1, 1, 0xffffff)
    var lock_strength_text_field = GUI.addTextField(33, 100, 35, 40, 20)
        .setCharacterType(1)
        .setInteger(0)
        .setOnChange(function (gui, t) {
            setPropertyOnBlock(e.target, "lock_strength", t.getInteger())
        })
    if (e.target.storeddata.has("lock_strength")) {
        lock_strength_text_field.setInteger(e.target.storeddata.get("lock_strength"))
    }
    var item_slot = GUI.addItemSlot(100, 85)
        .setOnUpdate(function (gui, t) {
            setPropertyOnBlock(e.target, "key_item", t.getStack().getItemNbt().toJsonString())
        })
    if (e.target.storeddata.has("key_item")) {
        try { item_slot.setStack(e.player.world.createItemFromNbt(e.API.stringToNbt(e.target.storeddata.get("key_item")))) }
        catch (error) { }
    }
    GUI.showPlayerInventory(50, 150, true)
    e.player.showCustomGui(GUI)
}

function attemptToPickLock(e, item) {
    var roll1 = getRandomInt(1, 6)
    var roll2 = getRandomInt(1, 6)
    var pick_modifier = 0
    var chance_to_destroy = 7
    switch (item.getDisplayName()) {
        case "Shabby Lockpick":
            pick_modifier = 0
            break;
        case "Average Lockpick":
            pick_modifier = 1
            break;
        case "Good Lockpick":
            pick_modifier = 2
            break;
        case "Pristine Lockpick":
            pick_modifier = 3
            break;

    }
    var result = roll1 + roll2 + pick_modifier + getScore("Mind")
    if (result >= e.target.storeddata.get("lock_strength")) {
        displayTitle(e, "§a§lLock Picked!: §r§a" + result + " §dvs §e" + e.target.storeddata.get("lock_strength"), "white")
        setPropertyOnBlock(e.target, "unlocked", 1)
        e.player.playSound("iob:ui.trap_disabled", 1, getRandomFloat(.4, 1.2))
    }
    else {
        displayTitle(e, "§c§lLockpick Failure: §r§c" + result + " §dvs §e" + e.target.storeddata.get("lock_strength"), "white")
        e.player.playSound("iob:ui.lockpick", 1, getRandomFloat(.2, 1.2))
    }
    var result_for_destroy = getRandomInt(1, 6) + getScore("Mind")
    if (result_for_destroy < chance_to_destroy - pick_modifier) {
        item.setStackSize(item.getStackSize() - 1)
    }
    else {
        e.player.message("&aLockpick recovered.")
    }
    e.setCanceled(true)
}


function setPropertyOnBlock(block, property, value) {
    block.storeddata.put(property, value)
    if (block.name != "customnpcs:npcscripteddoor") return
    var y_offset = -1
    if (block.getProperty("half") == "lower") y_offset = 1
    var other_half = block.world.getBlock(block.x, block.y + y_offset, block.z)
    other_half.storeddata.put(property, value)
}