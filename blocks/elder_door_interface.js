var GUI

function init(e) {
    if (e.block.getModel().name.indexOf("scripted") != -1) { e.block.setModel("upgrade_aquatic:chiseled_elder_prismarine_coralstone") }

    if (!e.block.storeddata.has("x")) {
        e.block.storeddata.put("x", 0)
        e.block.storeddata.put("y", 0)
        e.block.storeddata.put("z", 0)
    }
}

function interact(e) {
    if (e.player.gamemode == 1 && e.player.isSneaking()) {
        GUI = e.API.createCustomGui(1, 256, 256, false, e.player)
        GUI.addTextField(1, 50, 50, 50, 20).setText(e.block.storeddata.get("x"))
        GUI.addTextField(2, 110, 50, 50, 20).setText(e.block.storeddata.get("y"))
        GUI.addTextField(3, 170, 50, 50, 20).setText(e.block.storeddata.get("z"))
        GUI.addButton(4, "Save", 50, 90, 15, 20).setOnPress(function (gui, t) {
            e.block.storeddata.put("x", GUI.getComponent(1).getText())
            e.block.storeddata.put("y", GUI.getComponent(2).getText())
            e.block.storeddata.put("z", GUI.getComponent(3).getText())
            gui.close()
        })
        e.player.showCustomGui(GUI)
        return
    }
    var x = e.block.storeddata.get("x")
    var y = e.block.storeddata.get("y")
    var z = e.block.storeddata.get("z")
    switch (e.block.getModel().name) {

        case "upgrade_aquatic:chiseled_elder_prismarine_coralstone":
            e.block.setModel("upgrade_aquatic:chiseled_prismarine_coralstone")
            e.block.executeCommand("/particle upgrade_aquatic:prismarine_shower ~ ~ ~ .1 .2 .1 0 100")
            e.block.executeCommand("/particle aquamirae:electric ~ ~ ~ .3 .2 .3 0 100")
            e.block.executeCommand("/particle minecraft:end_rod ~ ~ ~ .3 .2 .3 0 100")
            e.block.world.playSoundAt(e.player.pos, "minecraft:block.beacon.power_select", 1, .7)
            e.block.world.playSoundAt(e.player.pos, "minecraft:block.conduit.ambient", 1, .7)
            e.block.world.getBlock(x, y, z).setRedstonePower(0)

            break;

        case "upgrade_aquatic:chiseled_prismarine_coralstone":
            e.block.setModel("upgrade_aquatic:chiseled_elder_prismarine_coralstone")
            e.block.world.playSoundAt(e.player.pos, "minecraft:block.beacon.deactivate", 1, .7)
            e.block.world.playSoundAt(e.player.pos, "minecraft:block.conduit.ambient", 1, .7)
            e.block.world.getBlock(x, y, z).setRedstonePower(15)
    }
}
