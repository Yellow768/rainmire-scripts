var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/boiler/scoreboard.js')


var block

function init(e) {
    block = e.block
}


/**
 * @param {BlockEvent.InteractEvent} e
 */
function interact(e) {
    e.player.message("&eDraining Shilo Dungeon")
    e.block.executeCommand("/fill 1544 23 2552 1653 -4 2659 air replace water")
    e.block.executeCommand("/fill 1544 23 2552 1653 -4 2659 minecraft:light_blue_stained_glass_pane replace minecraft:light_blue_stained_glass_pane")
    e.block.executeCommand("/fill 1544 23 2552 1653 -4 2659 minecraft:iron_bars replace minecraft:iron_bars")
    e.block.executeCommand("/fill 1544 23 2552 1653 -4 2659 minecraft:dark_prismarine_slab replace minecraft:dark_prismarine_slab")
    setScore("shilo_level", 0, "shilo_dungeon")
}