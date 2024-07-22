function displayTitle(e, message, color) {
    executeCommand('/title ' + e.player.name + ' actionbar {"text":"' + message + '","color":"' + color + '"}')
}

function playFailure() {
    player.world.playSoundAt(player.pos, "minecraft:entity.guardian.hurt", .4, 1)
}