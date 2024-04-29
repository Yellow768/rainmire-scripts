var clone_gui, entity, clone_name, tab, entity, min_time, max_time, amount, max_clones, radius

function init(e) {
    e.block.setIsPassible(true)
    clone_name = e.block.storeddata.get("clone")
    tab = e.block.storeddata.get("tab")
    max_time = e.block.storeddata.get("max_time")
    min_time = e.block.storeddata.get("min_time")
    amount = e.block.storeddata.get("amount")
    max_clones = e.block.storeddata.get("max_clones")
    radius = e.block.storeddata.get("radius")
    try {
        entity = e.API.clones.get(tab, clone_name, e.block.world)
    } catch (error) {
        e.block.executeCommand("say Nonexistant clone")
        entity = null
    }
    if (entity) {
        e.block.timers.forceStart(1, getRandomInt(min_time, max_time), false)
    }

}

function interact(e) {
    clone_gui = e.API.createCustomGui(1, 256, 256, false, e.player)
    clone_gui.addTextField(2, 50, 60, 150, 25).setText(e.block.storeddata.get("clone"))
    clone_gui.addTextField(3, 50, 90, 20, 20).setCharacterType(1).setInteger(e.block.storeddata.get("tab"))
    clone_gui.addButton(6, "Set", 50, 200, 25, 20).setOnPress(function (gui, t) { updateEntity(e) })
    clone_gui.addButton(25, "Enabled", 50, 200, 25, 20).setOnPress(function (gui, t) { toggleEnabled(e) }).setLabel(e.block.storeddata.get("enabled"))
    clone_gui.addEntityDisplay(4, 220, 70, entity)
    clone_gui.addLabel(5, "", 50, 140, 1, 1)
    clone_gui.addLabel(14, "Min Time", 0, 125, 1, 1, 0xffffff)
    clone_gui.addLabel(15, "Max Time", 95, 125, 1, 1, 0xffffff)
    clone_gui.addLabel(16, "Maximum Clones", -30, 155, 1, 1, 0xffffff)
    clone_gui.addLabel(17, "Amt to Spawn", 100, 155, 1, 1, 0xffffff)
    clone_gui.addLabel(18, "Clone Name", -10, 65, 1, 1, 0xffffff)
    clone_gui.addLabel(19, "Tab #", -10, 95, 1, 1, 0xffffff)
    clone_gui.addLabel(21, "Radius", 190, 125, 1, 1, 0xffffff)
    clone_gui.addTextField(10, 50, 120, 40, 20).setCharacterType(1).setInteger(e.block.storeddata.get("min_time"))
    clone_gui.addTextField(11, 140, 120, 40, 20).setCharacterType(1).setInteger(e.block.storeddata.get("max_time"))
    clone_gui.addTextField(12, 50, 150, 40, 20).setCharacterType(1).setInteger(e.block.storeddata.get("max_clones"))
    clone_gui.addTextField(13, 170, 150, 40, 20).setCharacterType(1).setInteger(e.block.storeddata.get("amount"))
    clone_gui.addTextField(20, 230, 120, 40, 20).setCharacterType(1).setInteger(e.block.storeddata.get("radius"))
    // else clone_gui.addEntityDisplay(4, 120, 60, e.player)

    e.player.showCustomGui(clone_gui)

}

function toggledEnabled(e) {
    switch (e.block.storeddata.get("enabled")) {
        case "false":
            e.block.storeddata.put("enabled", "True")
            break;
        case "true":
            e.block.storeddata.put("enabled", "False")
            break;
    }

}

function updateEntity(e) {
    e.block.storeddata.put("clone", clone_gui.getComponent(2).getText())
    e.block.storeddata.put("tab", clone_gui.getComponent(3).getInteger())
    e.block.storeddata.put("min_time", clone_gui.getComponent(10).getInteger())
    e.block.storeddata.put("max_time", clone_gui.getComponent(11).getInteger())
    e.block.storeddata.put("amount", clone_gui.getComponent(13).getInteger())
    e.block.storeddata.put("radius", clone_gui.getComponent(20).getInteger())
    e.block.storeddata.put("max_clones", clone_gui.getComponent(12).getInteger())
    clone_name = e.block.storeddata.get("clone")
    tab = e.block.storeddata.get("tab")
    max_time = e.block.storeddata.get("max_time")
    min_time = e.block.storeddata.get("min_time")
    amount = e.block.storeddata.get("amount")
    max_clones = e.block.storeddata.get("max_clones")
    radius = e.block.storeddata.get("radius")
    try {
        entity = e.API.clones.get(tab, clone_name, e.block.world)
        clone_gui.getComponent(5).setText("")
        clone_gui.getComponent(4).setEntity(entity)
        clone_gui.update()
    } catch (error) {
        clone_gui.getComponent(5).setText("Clone Does Not Exist!").setColor(0xff0000)
        entity = null
        clone_gui.getComponent(4).setEntity(entity)
        clone_gui.update()
    }

}

function timer(e) {
    if (e.block.storeddata.get("enabled") != "False") {
        var entities = e.block.world.getNearbyEntities(e.block.pos, 2, radius)
        var already_spawned_clones = 0
        if (!entity) return
        for (var i = 0; i < entities.length; i++) {
            if (entities[i].name == entity.name) {
                already_spawned_clones++
            }
        }

        if (already_spawned_clones <= max_clones) {
            for (var i = 0; i < amount; i++) {
                var pos = findValidBlock(e)
                e.API.clones.spawn(pos.x, pos.y, pos.z, tab, clone_name, e.block.world)
            }
        }
    }
    e.block.timers.forceStart(1, getRandomInt(min_time, max_time), false)
}

function customGuiClose(e) {
    updateEntity(e)
}

function findValidBlock(e) {
    var valid_pos = e.block.world.getBlock(e.block.x + getRandomInt(-radius, radius), e.block.y + 2, e.block.z + getRandomInt(-radius, radius))
    if (!valid_pos.isAir() && valid_pos.name.indexOf("water") == -1) {
        valid_pos = findValidBlock(e)
    }
    else {
        valid_pos = valid_pos.getPos()
    }
    return valid_pos
}