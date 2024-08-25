on_script = function (e) {
    e.block.executeCommand("/fill 1663 55 2627 1728 23 2559 barrier replace water")
    e.block.timers.start(1, 20, false)
    e.block.timers.start(2, 40, false)
    e.block.timers.start(3, 60, false)
    e.block.timers.start(4, 80, false)
    e.block.timers.start(5, 240, false)
    e.block.timers.start(6, 170, false)
    e.block.timers.start(7, 100, false)
    e.block.timers.start(8, 280, false)
    //e.block.executeCommand("setblock 1739 21 2544 redstone_block")
    //e.block.executeCommand("setblock 1651 21 2544 redstone_block")
    //e.block.executeCommand("setblock 1655 19 2642 redstone_block")
    // e.block.executeCommand("setblock 1737 20 2642 redstone_block")
}

var y_index = 30
function timer(e) {
    if (e.id == 1) {
        e.block.executeCommand("/fill 1663 55 2627 1728 23 2559 barrier replace water")
    }
    if (e.id == 2) {
        e.block.executeCommand("/fill 1654 31 2544 1692 23 2588 water replace air")
    }
    if (e.id == 3) {
        e.block.executeCommand("/fill 1695 43 2544 1737 25 2592 water replace air")
    }
    if (e.id == 4) {
        e.block.executeCommand("/fill 1655 55 2590 1737 21 2640 water replace air")
    }

    if (e.id == 5) {
        e.block.executeCommand("/fill 1545 30 2554 1580 30 2658 water replace air")
    }
    if (e.id == 6) {
        e.block.executeCommand("/fill 1579 30 2554 1616 30 2658 water replace air")
    }
    if (e.id == 7) {
        e.block.executeCommand("/fill 1615 30 2554 1652 30 2658 water replace air")
    }
    if (e.id == 8) {
        e.block.executeCommand("/fill 1545 30 2554 1652 7 2658 water replace air")
    }
}



