var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/boiler/commonFunctions.js')

var positions_in_arena = {
    bottom: [
        [1575, 34, 2552],
        [1585, 34, 2552],
        [1643, 34, 2551],
        [1635, 34, 2551],
        [1618, 34, 2551],
        [1609, 34, 2551],
        [1600, 34, 2552],
    ],

    left: [
        [1635, 34, 2551],
        [1571, 34, 2535],
        [1570, 34, 2526],
        [1570, 34, 2517]
    ],

    top: [
        [1580, 34, 2511],
        [1589, 34, 2511],
        [1601, 34, 2511],
        [1610, 34, 2512],
        [1619, 34, 2512],
        [1628, 34, 2512],
        [1635, 34, 2512]

    ],

    right: [
        [1642, 34, 2519],
        [1642, 34, 2527],
        [1643, 34, 2534],
        [1642, 34, 2544]
    ],

    getValidSides: function (side) {
        var valid_sides = ["bottom", "left", "top", "right"]
        if (valid_sides.indexOf(side) != -1) {
            valid_sides.splice(valid_sides.indexOf(side), 1)
        }
        if (valid_sides.indexOf(prev_side) != -1) {
            valid_sides.splice(valid_sides.indexOf(prev_side), 1)
        }
        return valid_sides
    },
    chooseValidSide: function (side, prev_side) {
        var sides = positions_in_arena.getValidSides(side, prev_side)
        return getRandomElement(sides)
    },
    getRandomPosition: function (side) {
        return getRandomElement(positions_in_arena[side])
    }
}

var npc
function init(e) {
    npc = e.npc
}

function interact(e) {
    if (e.npc.timers.has(1)) {
        e.npc.timers.stop(1)
        return
    }
    chooseNewDesintation()
    e.npc.timers.forceStart(1, 0, true)
}

function timer(e) {
    if (e.id == 1) {

        var destination = e.npc.tempdata.get("roll_destination")
        var angle = GetAngleTowardsPosition(npc.pos, npc.world.getBlock(destination[0], destination[1], destination[2]).getPos())
        var d = FrontVectors(e.npc, angle, 0, 2, 0)
        e.npc.setMotionX(d[0])
        e.npc.setMotionZ(-d[2])
        e.npc.rotation = angle
        var distance_to_destination = TrueDistanceCoord(e.npc.x, e.npc.y, e.npc.z, destination[0], destination[1], destination[2])
        //e.npc.say(distance_to_destination + " blocks away from " + destination + " angle = " + angle)
        if (distance_to_destination < 6) {
            chooseNewDesintation(e.npc.tempdata.get("roll_side"))
        }
    }
}

var prev_side

function chooseNewDesintation(side) {
    var new_side = positions_in_arena.chooseValidSide(side, prev_side)
    var random_pos = positions_in_arena.getRandomPosition(new_side)
    var angle = GetAngleTowardsPosition(npc.pos, npc.world.getBlock(random_pos[0], random_pos[1], random_pos[2]).getPos())
    prev_side = npc.tempdata.get("roll_side")
    npc.tempdata.put("roll_destination", random_pos)
    npc.tempdata.put("roll_angle", angle)
    npc.tempdata.put("roll_side", new_side)

}

var current_destination
