var giveBack = true

function aquacustomGuiButton(e) {
    if (e.player.getCustomGui() == aquaticUpgradePurchasingGUI) {
        if (e.buttonId == 1) {
            player.storeddata.put("airDecreaseRate", parseInt(player.storeddata.get("airDecreaseRate")) + 1)
            giveBack = false
            player.closeGui()
            player.playSound("minecraft:block.respawn_anchor.charge", 1, 1)
            player.playSound("iob:ui.breath", 1, 1)
            player.playSound("minecraft:block.enchantment_table.use", 1, .6)
            displayTitle(e, "Your Lung Capacity Has Increased!", "aqua")
            player.world.spawnParticle("splash", player.x, player.y + 1.2, player.z, .2, .2, .2, .2, 100)
            player.world.spawnParticle("supplementaries:air_burst", player.x, player.y + 1.2, player.z, .2, .2, .2, .2, 100)
            addToScore("max_perk_power", 2)
            e.player.getMainhandItem().setStackSize(e.player.getMainhandItem().getStackSize() - 1)
            e.player.playSound("minecraft:entity.generic.eat", 1, 1)
            e.player.playSound("minecraft:entity.player.burp", 1, 1)
            e.player.playSound("minecraft:entity.witch.drink", 1, 1)
            produceFoodParticles(e)
        }
        if (e.buttonId == 2) {
            addToScore("swmspd", 1)
            giveBack = false
            player.closeGui()
            player.playSound("minecraft:block.respawn_anchor.charge", 1, 1)
            player.playSound("minecraft:ambient.underwater.enter", 1, 1)
            player.playSound("minecraft:block.enchantment_table.use", 1, .6)
            displayTitle(e, "Your Swim Speed Has Increased!", "aqua")
            player.world.spawnParticle("splash", player.x, player.y + 1.2, player.z, .2, .2, .2, .2, 100)
            player.world.spawnParticle("cloud", player.x, player.y + 1.2, player.z, .2, .2, .2, .2, 100)
            addToScore("max_perk_power", 2)
            e.player.getMainhandItem().setStackSize(e.player.getMainhandItem().getStackSize() - 1)
            e.player.playSound("minecraft:entity.generic.eat", 1, 1)
            e.player.playSound("minecraft:entity.player.burp", 1, 1)
            e.player.playSound("minecraft:entity.witch.drink", 1, 1)
            produceFoodParticles(e)
        }
        if (e.buttonId == 4) {
            player.closeGui()
        }
    }
}

function aquaCustomGuiClosed(e) {
    if (e.gui == aquaticUpgradePurchasingGUI) {
        if (giveBack) {
            executeCommand('/summon minecraft:item ' + player.x + ' ' + player.y + ' ' + player.z + ' {Item:{id:"aquamirae:esca",Count:1b,tag:{display:{Lore:[\'{"italic":false,"color":"white","extra":[{"text":""},{"color":"dark_aqua","text":"Use at a Power or Dampening Remnant"}],"text":""}\', \'{"italic":false,"color":"white","extra":[{"text":""},{"color":"dark_aqua","text":"to obtain a perk. Or ingest it to"}],"text":""}\', \'{"italic":false,"color":"white","extra":[{"text":""},{"color":"dark_aqua","text":"enhance your aquatic abilities"}],"text":""}\'],Name:\'{"italic":false,"extra":[{"text":""},{"underlined":true,"obfuscated":true,"color":"aqua","text":"a"},{"underlined":true,"color":"aqua","text":"Remnant Vessel"},{"underlined":true,"obfuscated":true,"color":"aqua","text":"K"}],"text":""}\'}}}}')
            player.playSound("minecraft:entity.llama.spit", 1, 1)
        }
    }
}

var aquaticUpgradePurchasingGUI
function openAquaticGUI() {
    giveBack = true
    aquaticUpgradePurchasingGUI = api.createCustomGui(10, 256, 256, false, player)
    if (player.storeddata.get("airDecreaseRate") < 10) {
        aquaticUpgradePurchasingGUI.addTexturedButton(1, "", -20, 10, 125, 128, "iob:textures/customgui/breath_supply.png", 0, 0)
            .setHoverText("Improve your air supply")
    }
    if (getScore("swmspd") < 10) {
        aquaticUpgradePurchasingGUI.addTexturedButton(2, "", 140, 10, 125, 128, "iob:textures/customgui/swim_speed.png", 0, 0)
            .setHoverText("Improve your swim speed")
    }
    player.playSound("minecraft:block.enchantment_table.use", 1, .4)
    player.playSound("minecraft:item.trident.return", 1, .4)
    aquaticUpgradePurchasingGUI.addButton(4, "Cancel", 20, 200, 200, 20)
    player.showCustomGui(aquaticUpgradePurchasingGUI)

}
function produceFoodParticles(e) {
    var angle = e.player.getRotation()
    var dx = -Math.sin(angle * Math.PI / 180)
    var dz = Math.cos(angle * Math.PI / 180)
    var dy = -Math.tan(e.player.getPitch() / 90)
    var pitch = (90 - (Math.abs(e.player.getPitch()))) * 0.011
    if (dy < 0) {
        dy = 0
    }
    var x = e.player.x + (dx * pitch)
    var y = e.player.y + 1 + dy
    var z = e.player.z + (dz * pitch)
    executeCommand("/particle minecraft:item " + e.player.getMainhandItem().name + " " + x + " " + y + " " + z + " .3 .2 .3 .00001 20 force")

}