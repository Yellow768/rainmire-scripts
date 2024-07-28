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

}