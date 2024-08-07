load(api.getLevelDir() + '/scripts/ecmascript/boiler/ring.js')

var state_crush_jumping = new State("crush_jumping")

state_crush_jumping.enter = function (e) {
    e.npc.timers.start(1, getRandomInt(20, 60), false)
    e.npc.timers.start(2, getRandomInt(200, 260), false)
    e.npc.timers.stop(3)
}

state_crush_jumping.timer = function (e) {
    if (e.id == 1) {
        var d = FrontVectors(e.npc, GetAngleTowardsEntity(e.npc, attackTarget), 45, e.npc.pos.distanceTo(attackTarget.pos) / 4, 0)
        e.npc.setMotionX(d[0])
        e.npc.setMotionY(1.4)
        e.npc.setMotionZ(d[2])
        e.npc.timers.start(1, getRandomInt(60, 80), false)
        louderPlaySoundAt(e.npc.pos, 50, "customnpcs:magic.shot", 1, .2)
        louderPlaySoundAt(e.npc.pos, 50, "upgrade_aquatic:entity.jellyfish.cooldown_start", 1, 1)
        e.npc.timers.forceStart(3, 0, true)
    }
    if (e.id == 3) {
        e.npc.executeCommand("particle cloud ~ ~-2 ~ .2 .2 .2 0 500 force")
        if (isOnGround(e.npc)) {
            spawnParticleRing(e.npc.world, "block stone", e.npc.x, e.npc.y, e.npc.z, 1000, 13, 13, 0, 90)
            e.npc.world.spawnParticle("cloud", e.npc.x, e.npc.y, e.npc.z, 13, 1, 13, 0.2, 400)
            louderPlaySoundAt(e.npc.pos, 50, "minecraft:entity.puffer_fish.sting", 1, .2)
            louderPlaySoundAt(e.npc.pos, 50, "minecraft:entity.warden.attack_impact", 1, .2)
            louderPlaySoundAt(e.npc.pos, 50, "supplementaries:item.bomb", 1, .2)
            var nE = e.npc.world.getNearbyEntities(e.npc.pos, 13, 5)
            for (var i = 0; i < nE.length; i++) {
                if (nE[i] == e.npc) continue
                DoKnockback(e.npc, nE[i], 16 - e.npc.pos.distanceTo(nE[i].pos), 1.5 - (e.npc.pos.distanceTo(nE[i].pos) / 4))
                nE[i].damage(16 - e.npc.pos.distanceTo(nE[i].pos))
            }
            if (!e.npc.timers.has(2)) {
                StateMachine.transitionToState(StateMachine.current_state.name, "idle", e)
            }
            e.npc.timers.stop(3)
        }
    }
}

state_crush_jumping.exit = function (e) {
    e.npc.timers.stop(1)
    e.npc.timers.stop(2)
    e.npc.timers.stop(3)
}