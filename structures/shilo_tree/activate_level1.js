function redstone(e) {
    e.block.timers.forceStart(1, 60, false)
}

function timer(e) {
    if (e.id == 1) {
        e.block.executeCommand("/fill 1544 3 2552 1653 3 2659 water replace air")
        e.block.timers.start(2, 40, false)
    }
    if (e.id == 2) {
        e.block.executeCommand("/fill 1545 3 2552 1653 -3 2659 water replace air")
    }
}