var state_jump_cascade = new State("jump_cascade")

state_jump_cascade.enter = function (e) {
    e.npc.timers.start(1, getRandomInt(60, 90), false)
    e.npc.timers.forceStart(2, 10, false)
    e.npc.setMotionY(1.1)
}

state_jump_cascade.timer = function (e) {
    if (e.id == 1) {
        e.npc.timers.stop(2)
        e.npc.timers.stop(3)
        StateMachine.transitionToState(StateMachine.current_state.name, "idle", e)
    }
    if (e.id == 2) {
        //Slam Down
        e.npc.setMotionY(-2)
        e.npc.timers.forceStart(3, 5, false)
    }
    if (e.id == 3) {
        //Jump Up
        e.npc.executeCommand("/particle block stone ~ 34 ~ 7 0 7 1 1000 force")
        louderPlaySoundAt(e.npc.pos, 50, "customnpcs:misc.old_explode", 1, .2)
        louderPlaySoundAt(e.npc.pos, 50, "minecraft:entity.slime.attack", 1, .2)
        e.npc.executeCommand("/particle block stone " + attackTarget.x + " 55 " + attackTarget.z + " 7 0 7 1 1000 force")
        for (var i = 0; i < 6; i++) {
            var pos = {
                x: attackTarget.x + getRandomInt(-7, 7),
                y: 56,
                z: attackTarget.z + getRandomInt(-7, 7)
            }
            summonFallingBlockCircle(e.npc.world, pos)
        }
        e.npc.setMotionY(1.1)
        e.npc.timers.forceStart(2, 10, false)
        var nE = e.npc.world.getNearbyEntities(e.npc.pos, 13, 5)
        for (var i = 0; i < nE.length; i++) {
            if (nE[i] == e.npc) continue
            DoKnockback(e.npc, nE[i], 16 - e.npc.pos.distanceTo(nE[i].pos), 3 - (e.npc.pos.distanceTo(nE[i].pos) / 4))
        }
    }
}



function summonFallingBlockCircle(world, pos) {
    for (var x = -3; x < 3; x++) {
        for (var z = -3; z < 3; z++) {
            var chance_to_not_summon = getRandomInt(0, 100)
            if (chance_to_not_summon < 15) continue
            api.executeCommand(world, '/summon falling_block ' + (pos.x + x) + ' ' + pos.y + ' ' + (pos.z + z) + ' {BlockState:{Name:"minecraft:stone"},Time:1,HurtEntities:true,FallHurtMax:20,FallHurtAmount:1f,CancelDrop:true}')
        }
    }

}
