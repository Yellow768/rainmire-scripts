var x, y, z
var rotation = 0
var pitch = 0
var size_height = 2
var size_width = 2
var t
var min_t = 0
var max_t = 15
var points = 100

function init(e) {
    t = min_t
    x = e.block.x
    y = e.block.y + 3
    z = e.block.z
    e.block.timers.forceStart(1, 0, true)
}

function timer(e) {

    if (e.id == 1) {
        var sx, sy, sz
        t = parseInt(min_t)
        for (var i = 0; i < points; i++) {
            if (t < max_t) {
                t += max_t / points
            }
            else {
                t = min_t
            }
            sx = Math.sin(t) * size_width
            sy = Math.cos(t) * size_height
            sz = 0

            //e.block.executeCommand("say " + t)
            e.block.executeCommand("execute positioned " + x + " " + y + " " + z + " rotated " + rotation + " " + pitch + " run particle bubble ^" + sx.toFixed(4) + " ^" + sy.toFixed(4) + " ^" + sz.toFixed(4) + " 0 0 0 0 0 force @a")

        }
    }
}