var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
var world = API.getIWorld("overworld")
var currentEyePosition
var forgePlayer
var test = 300
function tickEventPlayerTickEvent(e) {
    noppesPlayer.message("test")
    forgePlayer = e.event.player
    var noppesPlayer = API.getIEntity(forgePlayer)
    if (isNaN(noppesPlayer.storeddata.get("currentAir")) || noppesPlayer.storeddata.get("currentAir") == null) {
        noppesPlayer.message("No Air! Reset!")
        noppesPlayer.storeddata.put("currentAir", 300)
        return
    }
    if (noppesPlayer.gamemode == 1 || noppesPlayer.gamemode == 3) {
        return
    }
    var playerX = Math.floor(forgePlayer.func_226277_ct_())
    var playerZ = Math.floor(forgePlayer.func_226281_cx_())
    currentEyePosition = e.event.player.m_20188_()

    var blockAtEyeLevel = world.getBlock(playerX, currentEyePosition, playerZ).name
    if (noppesPlayer.hasTag("resurfaced")) {
        forgePlayer.func_70050_g(-10)
        noppesPlayer.storeddata.put("currentAir", -10)
    }
    if (blockAtEyeLevel == "minecraft:water" && !noppesPlayer.hasTag("oxygenating")) {
        if (noppesPlayer.storeddata.get("currentAir") < 1) {
            return
        }
        if (!forgePlayer.func_70086_ai() > 0) {
            return
        }

        var newAirSupply = noppesPlayer.storeddata.get("currentAir") - noppesPlayer.storeddata.get("airDecreaseRate")
        forgePlayer.func_70050_g(Math.ceil(newAirSupply))
        if (newAirSupply < -20) { newAirSupply = 0 }
        //worldOut(forgePlayer.func_70086_ai())
        noppesPlayer.storeddata.put("currentAir", newAirSupply)

    }
    else {
        if (noppesPlayer.storeddata.get("currentAir") < 300) {
            // noppesPlayer.storeddata.put("currentAir", forgePlayer.func_70086_ai())
            if (noppesPlayer.hasTag("oxygenating") && !noppesPlayer.tempdata.has("targetOxygen")) {
                noppesPlayer.tempdata.put("targetOxygen", parseFloat(noppesPlayer.storeddata.get("currentAir")) + 150)

            }
            forgePlayer.func_70050_g(noppesPlayer.storeddata.get("currentAir"))
            var newAirSupply = parseFloat(noppesPlayer.storeddata.get("currentAir"))
            var airDecreaseRate = parseFloat(noppesPlayer.storeddata.get("airDecreaseRate"))

            newAirSupply += 5 * airDecreaseRate
            //worldOut(parseInt(newAirSupply) + parseInt(noppesPlayer.storeddata.get("airDecreaseRate")))
            if (noppesPlayer.hasTag("oxygenating") && newAirSupply >= noppesPlayer.tempdata.get("targetOxygen")) {
                noppesPlayer.removeTag("oxygenating")
                noppesPlayer.tempdata.remove("targetOxygen")
            }
            if (newAirSupply > 300) {
                newAirSupply = 300
                noppesPlayer.removeTag("oxygenating")
            }

            forgePlayer.func_70050_g(Math.floor(newAirSupply))
            noppesPlayer.storeddata.put("currentAir", newAirSupply)

            //worldOut(noppesPlayer.storeddata.get("airDecreaseRate"))

        }

    }

}





function worldOut(text) {
    return API.getIWorld("overworld").broadcast(text);
}


