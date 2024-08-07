load(api.getLevelDir() + '/scripts/ecmascript/boiler/entity_shoot.js')

var state_shooting_target = new State("shooting_target")
var attackTarget


state_shooting_target.enter = function (e) {
    attackTarget = e.entity
    e.npc.rotation = GetAngleTowardsEntity(e.npc, attackTarget)
    e.npc.timers.forceStart(1, getRandomInt(20, 60), false)
    e.npc.timers.forceStart(2, getRandomInt(20, 60), false)
    e.npc.timers.forceStart(3, 25, true)
    e.npc.timers.forceStart(4, getRandomInt(190, 200), true)
    e.npc.timers.forceStart(5, getRandomInt(30, 60), false)
    e.npc.timers.forceStart(6, 20, true)

}

state_shooting_target.exit = function (e) {
    e.npc.timers.stop(1)
    e.npc.timers.stop(2)
    e.npc.timers.stop(3)
    e.npc.timers.stop(4)
}

state_shooting_target.timer = function (e) {
    if (e.id == 1) {
        e.npc.rotation = GetAngleTowardsEntity(e.npc, attackTarget)
        e.npc.setMotionY(.6)
        e.npc.setMotionX(getRandomInt(-2, 2))
        e.npc.setMotionZ(getRandomInt(-2, 2))
        npc.timers.forceStart(1, getRandomInt(20, 120), false)
        louderPlaySoundAt(e.npc.pos, 50, "minecraft:entity.guardian.flop", 1, .2)
    }
    if (e.id == 3) {
        if (attackTarget.pos.distanceTo(e.npc.pos) > 50 || !attackTarget.isAlive() || (attackTarget.type == 1 && attackTarget.gamemode == 1)) {
            StateMachine.transitionToState(StateMachine.current_state.name, "idle", e)
        }
    }
    if (e.id == 4) {
        StateMachine.transitionToState("shooting_target", "choose_new_attack", e)
    }
    if (e.id == 6) {
        var target_rotation = GetAngleTowardsEntity(e.npc, attackTarget)

        if (e.npc.rotation < target_rotation) {
            e.npc.rotation += 10
        }
        if (e.npc.rotation > target_rotation) {
            e.npc.rotation -= 10
        }
    }
    if (e.id == 5) {

        e.npc.timers.forceStart(5, getRandomInt(30, 140), false)
        if (!canSeeEntity(e.npc, attackTarget, 150)) return

        louderPlaySoundAt(e.npc.pos, 50, "minecraft:entity.drowned.hurt_water", 1, getRandomFloat(.2, 1))
        for (var i = 0; i < 12; i++) {
            louderPlaySoundAt(e.npc.pos, 50, "minecraft:entity.llama.spit", 1, getRandomFloat(.2, 1))
            var d = FrontVectors(e.npc, getRandomInt(-10, 10), 0, 5, 1)
            var projectile = entityShoot({
                x: e.npc.x + d[0], y: e.npc.y + getRandomInt(1.5, 2), z: e.npc.z + d[2]
            }, {
                speed: 2,
                itemid: "minecraft:blue_dye",
                isArrow: 0,
                canBePickedUp: 0,
                deviation: 35,
                spins: 0,
                size: 30,
                trailenum: 1,
                pitch: 0,
                render3d: 1,
                glows: 1,
                rotation: GetAngleTowardsEntity(e.npc, attackTarget),
                power: 5,
                punch: 3
            })
            try {
                projectile.enableEvents()
            } catch (error) {

            }
        }
    }
}


function projectileImpact(e) {
    e.API.executeCommand(e.projectile.world, "particle splash " + e.projectile.x + " " + e.projectile.y + " " + e.projectile.z + " 2 2 2 0 100 force")
    louderPlaySoundAt(e.projectile.pos, 50, "minecraft:entity.player.splash", 1, getRandomFloat(.2, 1))
}
