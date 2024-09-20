function redstone(e) {
    if (e.power == 0) return
    e.block.timers.forceStart(1, 60, false)
}

function timer(e) {
    if (e.id == 1) {
        e.block.executeCommand("/fill 1544 10 2552 1653 10 2659 water replace air")
        e.block.timers.start(2, 40, false)
    }
    if (e.id == 2) {
        e.block.executeCommand("/fill 1544 10 2552 1653 4 2659 water replace air")
        e.block.executeCommand("/fill 1544 10 2552 1653 4 2659 water replace water")
    }
}