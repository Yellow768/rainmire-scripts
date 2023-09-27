


//Needs to have the functions required to run animation
//Needs to have logic to determine when to attack



//Main Script

var Thread = Java.type("java.lang.Thread");
var NpcAPI = Java.type("noppes.npcs.api.NpcAPI").Instance();
/////////

var grabbingItem = false
var targetItem, spinning

var SPINNING_TIMER = 6
var SPIN_SOUND_TIMER = 7
var START_SPIN_TIMER = 8

var min_attack_time = 5
var max_attack_time = 15
var min_movement_time = 20
var max_movement_time = 25
var combat_movement_speed = .45

var blocking = false
var npc
var wasBurning = false

var no_attack_tags = ["spinning"]

var attacks_by_weight = []

var horizontal_swing = { default: { time: 0.2, head: { id: 0, a: [0, 0, 0], end: [180, 180, 180] }, left_arm: { id: 1, a: [0, 0, 0], end: [180, 180, 180] }, right_arm: { id: 2, a: [0, 0, 0], end: [180, 180, 180] }, body: { id: 3, a: [0, 0, 0], end: [180, 180, 180] } }, raise: { time: 0.2, head: { id: 0, a: [0, 0, 0], end: [180, 184, 180] }, left_arm: { id: 1, a: [0, 0, 0], end: [128, 180, 180] }, right_arm: { id: 2, a: [0, 0, 0], end: [178, 175, 82] }, body: { id: 3, a: [0, 0, 0], end: [180, 177, 180] } }, swing: { time: 0.1, head: { id: 0, a: [0, 0, 0], end: [187, 180, 180] }, left_arm: { id: 1, a: [0, 0, 0], end: [206, 198, 157] }, right_arm: { id: 2, a: [0, 0, 0], end: [47, 210, 82] }, body: { id: 3, a: [0, 0, 0], end: [180, 201, 180] } }, swing_revel: { time: 0.5, head: { id: 0, a: [0, 0, 0], end: [187, 180, 180] }, left_arm: { id: 1, a: [0, 0, 0], end: [206, 198, 157] }, right_arm: { id: 2, a: [0, 0, 0], end: [47, 212, 82] }, body: { id: 3, a: [0, 0, 0], end: [180, 194, 180] } }, return: { time: 0.4, head: { id: 0, a: [0, 0, 0], end: [180, 180, 180] }, left_arm: { id: 1, a: [0, 0, 0], end: [180, 180, 180] }, right_arm: { id: 2, a: [0, 0, 0], end: [180, 180, 180] }, body: { id: 3, a: [0, 0, 0], end: [180, 180, 180] } } }
var spin = { default: { time: 0.2, head: { id: 0, a: [0, 0, 0], end: [180, 180, 180] }, left_arm: { id: 1, a: [0, 0, 0], end: [180, 180, 180] }, right_arm: { id: 2, a: [0, 0, 0], end: [180, 180, 180] }, body: { id: 3, a: [0, 0, 0], end: [180, 180, 180] } }, raise: { time: 0.2, head: { id: 0, a: [0, 0, 0], end: [180, 184, 180] }, left_arm: { id: 1, a: [0, 0, 0], end: [128, 180, 180] }, right_arm: { id: 2, a: [0, 0, 0], end: [178, 175, 82] }, body: { id: 3, a: [0, 0, 0], end: [180, 177, 180] } }, swing: { time: 0.1, head: { id: 0, a: [0, 0, 0], end: [187, 180, 180] }, left_arm: { id: 1, a: [0, 0, 0], end: [206, 198, 157] }, right_arm: { id: 2, a: [0, 0, 0], end: [47, 210, 82] }, body: { id: 3, a: [0, 0, 0], end: [180, 201, 180] } }, swing_revel: { time: 0.8, head: { id: 0, a: [0, 0, 0], end: [187, 180, 180] }, left_arm: { id: 1, a: [0, 0, 0], end: [206, 198, 157] }, right_arm: { id: 2, a: [0, 0, 0], end: [47, 212, 82] }, body: { id: 3, a: [0, 0, 0], end: [180, 194, 180] } }, return: { time: 0.4, head: { id: 0, a: [0, 0, 0], end: [180, 180, 180] }, left_arm: { id: 1, a: [0, 0, 0], end: [180, 180, 180] }, right_arm: { id: 2, a: [0, 0, 0], end: [180, 180, 180] }, body: { id: 3, a: [0, 0, 0], end: [180, 180, 180] } } }


var attack_swing = {
    name: "swing",
    weighted_chance: 15,
    crit_chance: 20,
    use_melee_strength: true,
    additional_damage: 0,
    hitbox_time: 5,
    animation_time: 20,
    attack_time: 30,
    hitbox_cone: 180,
    hitbox_size: 3,
    attack_range: 4,
    horizontal_knockback_direction: 180,
    vertical_knockback_direction: 0,
    knockback_power: 1,
    animation: horizontal_swing,
    additional_timers: [],
    tags: []
}

var attack_spin = {
    name: "spin",
    weighted_chance: 2,
    crit_chance: 5,
    use_melee_strength: false,
    additional_damage: 3,
    horizontal_direction: 10,
    hitbox_time: 5,
    animation_time: 20,
    attack_time: 40,
    hitbox_cone: 180,
    hitbox_size: 2,
    attack_range: 7,
    horizontal_knockback_direction: 180,
    vertical_knockback_direction: 45,
    knockback_power: 2,
    animation: spin,
    additional_timers: [{ id: START_SPIN_TIMER, time: 2, repeat: false }],
    tags: ["spinning"]
}


var attacks_to_register = [attack_spin, attack_swing]


var i = 0
function init(e) {
    npc = e.npc
    disableRegularAttacks(e)
    if (e.npc.hasTag("spinning")) {
        return
    }
    e.npc.getStoreddata().put("notRunning", 1);
    e.npc.ai.setWalkingSpeed(5)
    e.npc.timers.stop(6)
    e.npc.removeTag("spinning")
}

function interact(e) {
    e.npc.setAttackTarget(null)
    e.npc.ai.setWalkingSpeed(0)
    e.npc.reset()
    setNBTPuppetMode(e.npc, true)
    e.npc.storeddata.put("notRunning", 1)
    runAnimation(spin, e.npc, 50)
    e.npc.updateClient()
    e.npc.addTag("spinning")
    e.npc.tempdata.put("spinDirection", frontVectors(e.npc, e.npc.rotation, 0, .2))
    e.npc.timers.forceStart(SPINNING_TIMER, 0, true)
    e.npc.timers.start(ATTACK_FINISHED_TIMER, 26, false)


}

function tick(e) {
    if (e.npc.getAttackTarget() != null && e.npc.getAttackTarget().pos.distanceTo(e.npc.pos) < 1 && getRandomInt(0, 10) < 5) {
        var d = frontVectors(e.npc, e.npc.rotation, 0, .02)
        e.npc.setMotionX(-d[0])
        e.npc.setMotionZ(-d[2])
    }
    if (e.npc.getAttackTarget() != null && e.npc.getAttackTarget().pos.distanceTo(e.npc.pos) < 3) {
        e.npc.ai.setWalkingSpeed(1)
    }
    else if (!e.npc.hasTag("spinning")) {
        e.npc.ai.setWalkingSpeed(5)
    }
}

function chooseCombatMovement(e) {
    if (e.npc.hasTag("spinning")) {
        e.npc.timers.forceStart(COBMAT_MOVEMENT_TIMER, getRandomInt(min_movement_time, max_movement_time), false)
        return
    }
    if (e.npc.getAttackTarget() == null) {
        e.npc.timers.stop(4)
        return
    }
    if (e.npc.getAttackTarget().pos.distanceTo(e.npc.pos) < 3 && !e.npc.storeddata.has("paralyzed")) {
        var move_chance = getRandomInt(0, 100)
        if (move_chance < 25) {
            e.npc.setMoveForward(-combat_movement_speed)
        }

        if (move_chance > 25 && move_chance <= 50) {
            e.npc.setMoveStrafing(combat_movement_speed)
            e.npc.setMoveForward(0)

        }
        if (move_chance > 50 && move_chance <= 75) {
            var d = frontVectors(e.npc, e.npc.rotation, 0, .02)
            e.npc.setMotionX(d[0])
            e.npc.setMotionZ(d[2])
        }
        else {
            var d = frontVectors(e.npc, e.npc.rotation, 0, .12)
            e.npc.setMotionX(-d[0])
            e.npc.setMotionZ(-d[2])
        }

    }
    e.npc.timers.forceStart(COBMAT_MOVEMENT_TIMER, getRandomInt(e.npc.storeddata.get("min_movement_time"), e.npc.storeddata.get("max_movement_time")), false)
}

function additionalTimer(e) {
    if (e.id == START_SPIN_TIMER) {
        e.npc.ai.setRetaliateType(3)
        e.npc.ai.setWalkingSpeed(0)
        e.npc.setAttackTarget(null)
        e.npc.updateClient()
        e.npc.addTag("spinning")
        e.npc.reset()
        setNBTPuppetMode(e.npc, true)
        e.npc.tempdata.put("spinDirection", frontVectors(e.npc, e.npc.rotation, 0, .45))
        e.npc.timers.start(SPINNING_TIMER, 0, true)
        e.npc.timers.forceStart(SPIN_SOUND_TIMER, 5, true)
        e.npc.timers.forceStart(ATTACK_FINISHED_TIMER, 30, false)
    }
    if (e.id == SPINNING_TIMER) {
        if (!e.npc.tempdata.has("spinDirection")) {
            e.npc.timers.stop(SPINNING_TIMER)
            e.npc.timers.stop(SPIN_SOUND_TIMER)
            e.npc.removeTag("spinning")
            e.npc.ai.setRetaliateType(0)
            return
        }
        i -= 35
        e.npc.setAttackTarget(null)
        e.npc.setRotation(i)
        var spin_direction = e.npc.tempdata.get("spinDirection")
        e.npc.setMotionX(spin_direction[0])
        e.npc.setMotionZ(spin_direction[2])
        activateDamageHitbox(e)


    }
    if (e.id == SPIN_SOUND_TIMER) {
        e.npc.world.playSoundAt(e.npc.pos, "customnpcs:misc.swosh", 1, getRandomFloat(0.8, 1.2))
        e.npc.world.playSoundAt(e.npc.pos, "aquamirae:item.terrible_sword", 1, getRandomFloat(0.8, 1.2))
    }
}

function additionalFinishAttackFunctions(e) {
    e.npc.removeTag("spinning")
}



function additionalTargetFunctions(e) {

}

function additionalTargetLostFunctions(e) {

}

function additionalDiedFunctions(e) {

}





