var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/boiler/id_generator.js')

var floodLevelBlockPos = { x: 1631, y: 10, z: 2679 }
/**
 * @param {BlockEvent.RedstoneEvent} e
 */
function interact(e) {
    e.block.executeCommand("/fill 1545 54 2554 1653 32 2659 water replace air")
}