var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/boiler/id_generator.js')

var floodLevelBlockPos = { x: 1631, y: 10, z: 2679 }
/**
 * @param {BlockEvent.RedstoneEvent} e
 */
function interact(e) {
    e.block.executeCommand("/fill 1652 -4 2658 1545 6 2554 water replace air")

}