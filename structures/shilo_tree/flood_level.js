var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/boiler/id_generator.js')


var block

function init(e) {
    block = e.block
}


/**
 * @param {BlockEvent.InteractEvent} e
 */
function interact(e) {
    e.player.message("&eDraining Shilo Dungeon")
    e.block.executeCommand("/fill 1545 54 2554 1652 -4 2658 air replace water")
    e.block.executeCommand("/fill 1695 43 2544 1737 25 2592 air replace water")
    e.block.executeCommand("/fill 1655 55 2590 1737 21 2640 air replace water")
    e.block.executeCommand("/fill 1654 31 2544 1692 23 2588 air replace water")
    e.block.executeCommand("/fill 1663 55 2627 1728 23 2559 water replace barrier")
}