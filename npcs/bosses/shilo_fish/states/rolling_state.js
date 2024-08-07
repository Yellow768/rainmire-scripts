var state_rolling = new State("rolling_state")
var bounds = {
    left: 1569,
    right: 1643,
    top: 2510,
    bottom: 2552
}

var xSpeed
var zSpeed
var xModifier = 1
var zModifier = 1
var xWidth = 6.5
var zWidth = 6.5


state_rolling.enter = function (e) {
    var dirs = [-1, 1]
    xSpeed = getRandomElement(dirs)
    zSpeed = getRandomElement(dirs)
    e.npc.timers.forceStart(1, 0, true)
    e.npc.timers.forceStart(3, 3, true)
    e.npc.timers.forceStart(2, getRandomInt(120, 200), false)



}

state_rolling.exit = function (e) {
    e.npc.timers.stop(1)
    e.npc.timers.stop(2)
    e.npc.timers.stop(3)
}

state_rolling.timer = function (e) {
    if (e.id == 3) {
        louderPlaySoundAt(e.npc.pos, 90, "upgrade_aquatic:entity.jellyfish.harvest", 1, getRandomFloat(.5, 1.2))
    }

    if (e.id == 1) {
        if (e.npc.x - xWidth <= bounds.left || e.npc.x + xWidth >= bounds.right) {
            xSpeed *= -1
            xModifier = getRandomFloat(.8, 1)
            louderPlaySoundAt(e.npc.pos, 90, "upgrade_aquatic:entity.perch.hurt", 1, .5)
            louderPlaySoundAt(e.npc.pos, 90, "minecraft:entity.armor_stand.break", 1, .5)


        }
        if (e.npc.z - zWidth <= bounds.top || e.npc.z + zWidth >= bounds.bottom) {
            zSpeed *= -1
            zModifier = getRandomFloat(.8, 1)
            louderPlaySoundAt(e.npc.pos, 90, "upgrade_aquatic:entity.perch.hurt", 1, .5)
            louderPlaySoundAt(e.npc.pos, 90, "minecraft:entity.armor_stand.break", 1, .5)
        }
        e.npc.setMotionX(xSpeed * xModifier)
        e.npc.setMotionZ(zSpeed * zModifier)
        var angle = Math.atan2((zSpeed * zModifier), (xSpeed * xModifier)) * (-180 / Math.PI)
        e.npc.rotation = angle + 90
    }
    if (e.id == 2) {
        StateMachine.transitionToState(StateMachine.current_state.name, "idle", e)
    }
}


state_rolling.collide = function (e) {
    e.entity.damage(5)
    DoKnockback(e.npc, e.entity, 2, 1)
}