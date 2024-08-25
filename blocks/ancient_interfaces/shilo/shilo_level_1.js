


var on_script = function (e) {
    e.block.timers.forceStart(1, 2, true)
}

var y_index = -4


function timer(e) {

    if (y_index <= 6) {
        e.block.executeCommand("/fill 1652 " + y_index + " 2658 1545 " + y_index + " 2554 water replace air")
        y_index++
    }
    else {
        e.block.timers.stop(1)
    }
}