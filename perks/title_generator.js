function title(e, message, color) {
    executeCommand('/title ' + e.player.name + ' actionbar {"text":"' + message + '","color":"' + color + '"}')
}