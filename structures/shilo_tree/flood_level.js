var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/boiler/id_generator.js')


var block

function init(e) {
    block = e.block
}

/**
 * @param {BlockEvent.TriggerEvent} e
 */
function trigger(e) {
    if (e.id == id("flood_level_1")) {
        block.timers.start(1, 1, true)
    }
    if (e.id == id("flood_level_2")) {
        block.executeCommand("/fill 1545 30 2554 1557 7 2658 minecraft:water replace air")
        block.executeCommand("/fill 1558 30 2554 1570 7 2658 minecraft:water replace air")
        block.executeCommand("/fill 1571 30 2554 1583 7 2658 minecraft:water replace air")
        block.executeCommand("/fill 1584 30 2554 1596 7 2658 minecraft:water replace air")
        block.executeCommand("/fill 1597 30 2554 1609 7 2658 minecraft:water replace air")
        block.executeCommand("/fill 1610 30 2554 1622 7 2658 minecraft:water replace air")
        block.executeCommand("/fill 1623 30 2554 1635 7 2658 minecraft:water replace air")
        block.executeCommand("/fill 1635 30 2554 1652 7 2658 minecraft:water replace air")
    }

}

/**
 * @param {BlockEvent.RedstoneEvent} e
 */
function redstone(e) {
    if (e.prevPower == 0) {
        for (var i = 31; i > -4; i -= 2) {
            e.block.executeCommand("/fill 1545 " + i + " 2554 1652 " + (i - 1) + " 2658 air replace water")
        }
    }
}

var level_1_commands = [
    "/fill 1545 6 2554 1572 -4 2658 minecraft:water replace air",
    "/fill 1573 6 2554 1600 -4 2658 minecraft:water replace air",
    "/fill 1601 6 2554 1628 -4 2658 minecraft:water replace air",
    "/fill 1628 6 2554 1652 -4 2658 minecraft:water replace air"
]
var level_1_index = 0

function timer(e) {
    if (e.id == 1) {
        if (level_1_index < level_1_commands.length) {
            e.block.executeCommand(level_1_commands[level_1_index])
            level_1_index++
        }
        else {
            e.block.timers.stop(1)
            level_1_index = 0
        }
    }
}
