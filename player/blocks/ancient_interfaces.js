/**
 * @param {PlayerEvent.BreakEvent} e
 */
function broken(e) {
    if (e.block.name.indexOf("kubejs:ancient") != -1) {

        var aip = JSON.parse(e.player.world.getStoreddata().get("ancientInterfaceArray"))
        var id = e.block.x + "" + e.block.y + "" + e.block.z
        delete aip[id]
        e.player.world.getStoreddata().put("ancientInterfaceArray", JSON.stringify(aip))
    }
}

function ancientInterface_interact(e) {

    if (e.player.tempdata.has("interfaceEditing")) {
        if (!e.player.world.getStoreddata().has("ancientInterfaceArray")) {
            e.player.world.getStoreddata().put("ancientInterfaceArray", JSON.stringify({}))
        }
        var aip = JSON.parse(e.player.world.getStoreddata().get("ancientInterfaceArray"))
        var id = e.player.tempdata.get("interfaceEditing").x + "" + e.player.tempdata.get("interfaceEditing").y + "" + e.player.tempdata.get("interfaceEditing").z
        aip[id] = [e.target.x, e.target.y, e.target.z]
        e.player.world.storeddata.put("ancientInterfaceArray", JSON.stringify(aip))
        e.player.message("&eInterface Button Set to " + e.target.x + " " + e.target.y + " " + e.target.z)
        e.player.tempdata.remove("interfaceEditing")
    }
    if (e.player.tempdata.has("hourglassEditing")) {

        if (!e.player.world.getStoreddata().has("ancientInterfaceArray")) {
            e.player.world.getStoreddata().put("ancientInterfaceArray", JSON.stringify({}))
        }
        var aip = JSON.parse(e.player.world.getStoreddata().get("ancientInterfaceArray"))
        var id = e.player.tempdata.get("hourglassEditing").x + "" + e.player.tempdata.get("hourglassEditing").y + "" + e.player.tempdata.get("hourglassEditing").z
        aip[id]["buttonPos"] = [e.target.x, e.target.y, e.target.z]
        aip[id]["progress"] = 0
        e.player.world.storeddata.put("ancientInterfaceArray", JSON.stringify(aip))
        e.player.message("&eHourglass Button Set to " + e.target.x + " " + e.target.y + " " + e.target.z)
        e.player.tempdata.remove("hourglassEditing")
    }
    if (e.type == 2) {
        if (e.target.name == "kubejs:ancient_interface") {
            if (e.player.getMainhandItem().name == "minecraft:debug_stick") return
            if (!e.player.isSneaking() || e.player.gamemode != 1) {
                e.player.playAnimation(0)
                e.API.executeCommand(e.player.world, "/setblock " + e.target.x + " " + e.target.y + " " + e.target.z + " kubejs:ancient_interface[lit=" + !e.target.getProperty("lit") + ",facing=" + e.target.getProperty("facing") + ",waterlogged=" + e.target.getProperty("waterlogged") + "]")
                var aip = JSON.parse(e.player.world.getStoreddata().get("ancientInterfaceArray"))
                var id = e.target.x + "" + e.target.y + "" + e.target.z
                if (aip[id]) {
                    e.player.world.getBlock(aip[id][0], aip[id][1], aip[id][2]).interact(0)
                }
                if (e.target.getProperty("lit")) {
                    e.API.executeCommand(e.player.world, "/particle minecraft:dust 0 1 1 1 " + (e.target.x + .5) + " " + (e.target.y + 1) + " " + (e.target.z + .5) + " .1 .1 .1 0 50")
                    e.player.world.spawnParticle("enchant", e.target.x + .5, e.target.y + 1, e.target.z + .5, .2, .2, .2, 0, 25)

                    e.player.world.playSoundAt(e.target.pos, "minecraft:block.beacon.activate", 1, .8)
                }
                if (!e.target.getProperty("lit")) {
                    e.player.world.spawnParticle("aquamirae:ghost_shine", e.target.x + .5, e.target.y + 1, e.target.z + .5, .2, .2, .2, 0, 5)
                    e.player.world.playSoundAt(e.target.pos, "minecraft:block.beacon.deactivate", 1, .6)
                }
            }
            if (e.player.isSneaking() && e.player.gamemode == 1) {
                e.player.tempdata.put("interfaceEditing", e.target)
                e.player.message("&eSetting Interface Button")
            }
        }
        if (e.target.name == "kubejs:ancient_hourglass") {
            var aip = JSON.parse(e.player.world.getStoreddata().get("ancientInterfaceArray"))
            var id = e.target.x + "" + e.target.y + "" + e.target.z

            if (!aip[id]) {
                aip[id] = {
                    time: 1,
                    buttonPos: [1, 1, 1],
                    progress: 0
                }
            }
            if (e.player.getMainhandItem().name == "minecraft:debug_stick") { aip[id]["progress"] = 0; return }
            if (e.player.getMainhandItem().name == "minecraft:clock" && e.player.gamemode == 1) {
                var time = aip[id]["time"]
                if (e.player.isSneaking()) {
                    aip[id]["time"] = time - 1

                }
                else {
                    aip[id]["time"] = time + 1
                }
                e.player.message("&eSet interval to " + aip[id]["time"])
            }
            else if (e.player.gamemode == 1 && e.player.isSneaking()) {
                e.player.tempdata.put("hourglassEditing", e.target)
                e.player.message("&eSetting Hourglass Button")

            }
            else {
                e.player.playAnimation(0)
                if (aip[id]["progress"] == 0) {

                    e.API.executeCommand(e.player.world, "/particle minecraft:dust 0 1 1 1 " + (e.target.x + .5) + " " + (e.target.y + 1) + " " + (e.target.z + .5) + " .3 .3 .3 0 5")
                    e.player.world.spawnParticle("enchant", e.target.x + .5, e.target.y + 1, e.target.z + .5, .2, .2, .2, 0, 25)

                    e.player.world.playSoundAt(e.target.pos, "minecraft:block.beacon.activate", 1, 2)
                }
                if (aip[id]["progress"] < aip[id]["time"]) {
                    aip[id]["progress"] = aip[id]["progress"] + 1
                }

                if (aip[id]["progress"] == aip[id]["time"]) {
                    if (e.target.getProperty("power") < 4) {
                        e.API.executeCommand(e.player.world, "/setblock " + e.target.x + " " + e.target.y + " " + e.target.z + " kubejs:ancient_hourglass[power=" + (e.target.getProperty("power") + 1) + ",facing=" + e.target.getProperty("facing") + ",waterlogged=" + e.target.getProperty("waterlogged") + "]")
                        if (e.player.world.getBlock(e.target.x, e.target.y, e.target.z).getProperty("power") == 4) {
                            e.player.world.getBlock(aip[id]["buttonPos"][0], aip[id]["buttonPos"][1], aip[id]["buttonPos"][2]).interact(0)
                            e.API.executeCommand(e.player.world, "/particle minecraft:dust 0 1 1 1 " + (e.target.x + .5) + " " + (e.target.y + 1) + " " + (e.target.z + .5) + " .3 .3 .3 0 50")
                            e.player.world.spawnParticle("enchant", e.target.x + .5, e.target.y + 1, e.target.z + .5, .2, .2, .2, 0, 25)
                            e.player.world.playSoundAt(e.target.pos, "minecraft:block.beacon.activate", 1, .6)
                        }
                        else {
                            aip[id]["progress"] = 0
                        }
                    }
                }
            }
            e.player.world.storeddata.put("ancientInterfaceArray", JSON.stringify(aip))
        }


    }

}