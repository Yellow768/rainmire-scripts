function dialog(e) {
    if (e.dialog.id == 331) {
        e.player.playSound("minecraft:ambient.underwater.loop", 1, .2)
    }
}
function dialogOption(e) {
    if (e.dialog.id == 337) {
        e.player.addPotionEffect(15, 1, 1, false)
        e.API.executeCommand(e.player.world, "stopsound " + e.player.name)
        e.API.executeCommand(e.player.world, "/tp " + e.player.name + " 1690 75 2848 135 -76")
        e.API.executeCommand(e.player.world, "/playsound iob:music.intro record " + e.player.name + " " + e.player.x + " " + e.player.y + " " + e.player.z)
        e.API.executeCommand(e.player.world, '/title ' + e.player.name + ' times 20 40 20')
        e.API.executeCommand(e.player.world, '/title ' + e.player.name + ' subtitle {"text":"Draw your first breath, once more","italic":true,"color":"yellow"}')
        e.API.executeCommand(e.player.world, '/title ' + e.player.name + ' title {"text":" ","bold":true,"color":"yellow"}')
        e.player.playSound("iob:ui.breath", 1, 1)
    }
}

