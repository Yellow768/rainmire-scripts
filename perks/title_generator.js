function title(e, message, color) {
    executeCommand('/title ' + e.player.name + ' actionbar {"text":"' + message + '","color":"' + color + '"}')
}

function playFailure(e) {
    e.player.world.playSoundAt(e.player.pos, "minecraft:entity.guardian.hurt", .4, 1)
}