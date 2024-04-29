

function interact(e) {
    if (e.player.gamemode != 1) return
    e.player.message(e.block.x + " " + e.block.y + " " + e.block.z)
    e.block.executeCommand("say " + e.block.getRedstonePower())
    switch (e.block.getRedstonePower()) {
        case 15:
            e.block.setRedstonePower(0)
            break;
        case 0:
            e.block.setRedstonePower(15)
            break;
    }
}