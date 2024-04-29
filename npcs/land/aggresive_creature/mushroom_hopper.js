var animationEngine
var isWalking = false
var isAttacking = false
var justLanded = false
var ANIMATE_WALKING_TIMER = 1
var APPLY_JUMP_FORCE_TIMER = 2
var CHECK_IF_LANDED_TIMER = 3
var CHECK_IF_CAN_ATTACK_TIMER = 5
var COOLDOWN_TIMER = 6
var JUST_LANDED_TIMER = 7
var WALKING_SOUND_TIMER = 8


function init(e) {
    animationEngine = e.API.createAnimBuilder()
    disableRegularAttacks
    e.npc.timers.forceStart(1, 2, true)
}

function disableRegularAttacks(e) {
    e.npc.stats.getMelee().setDelay(72000)
    e.npc.stats.ranged.setDelay(72000, 72000)
    e.npc.stats.ranged.setAccuracy(0)
    e.npc.stats.ranged.setRange(0)
    e.npc.inventory.setProjectile(e.npc.world.createItem("minecraft:scute", 1))
}


function target(e) {
    e.npc.timers.forceStart(CHECK_IF_CAN_ATTACK_TIMER, 0, true)
}

function targetLost(e) {
    e.npc.timers.stop(CHECK_IF_CAN_ATTACK_TIMER)
    e.npc.timers.stop(COOLDOWN_TIMER)
}

function damaged(e) {
    e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.bat.hurt", .2, .2)
    e.npc.executeCommand("/particle dust 1 .2 .2 1 ~ ~ ~ 0.15 0.15 0.15 2 20 force")
}

function died(e) {
    e.npc.timers.stop(CHECK_IF_CAN_ATTACK_TIMER)
    e.npc.timers.stop(APPLY_JUMP_FORCE_TIMER)
    e.npc.timers.stop(CHECK_IF_LANDED_TIMER)
    e.npc.timers.stop(WALKING_SOUND_TIMER)
}

function doHopAttack(e) {

    animationEngine.clearAnimations()
    animationEngine.addAnimation("animation.mushroom_hopper.attack")
    isAttacking = true
    isWalking = false
    e.npc.timers.stop(WALKING_SOUND_TIMER)
    e.npc.syncAnimationsForAll(animationEngine)
    e.npc.timers.start(APPLY_JUMP_FORCE_TIMER, 15, false)
    e.npc.ai.setWalkingSpeed(0)

}

function timer(e) {
    switch (e.id) {
        case CHECK_IF_CAN_ATTACK_TIMER:
            if (e.npc.timers.has(COOLDOWN_TIMER) || isAttacking) return
            if (e.npc.getAttackTarget() == null) {
                e.npc.timers.stop(CHECK_IF_CAN_ATTACK_TIMER)
                return
            }
            var minimumDistance = 8
            if (e.npc.getAttackTarget().type != 1) {
                minimumDistance = 3
            }
            if (e.npc.getAttackTarget().pos.distanceTo(e.npc.pos) <= minimumDistance) {
                doHopAttack(e)
                e.npc.timers.stop(WALKING_SOUND_TIMER)
            }
            break;


        case ANIMATE_WALKING_TIMER:

            if (!isAttacking && !isWalking && (e.npc.getMotionX() != 0 || e.npc.getMotionZ() != 0)) {
                isWalking = true
                animationEngine.clearAnimations()
                animationEngine.loop("animation.mushroom_hopper.walk")
                e.npc.syncAnimationsForAll(animationEngine)
                e.npc.timers.forceStart(WALKING_SOUND_TIMER, 10, true)
            }
            if (!isAttacking && isWalking && e.npc.getMotionX() == 0 && e.npc.getMotionZ() == 0) {
                isWalking = false
                animationEngine.clearAnimations()
                animationEngine.addAnimation("animation.mushroom_hopper.idle")
                e.npc.syncAnimationsForAll(animationEngine)
                e.npc.timers.stop(WALKING_SOUND_TIMER)
            }
            break;
        case WALKING_SOUND_TIMER:
            e.npc.world.playSoundAt(e.npc.pos, "minecraft:block.fungus.step", .1, getRandomFloat(.2, .6))
            break;
        case APPLY_JUMP_FORCE_TIMER:
            var distanceToJump = 1.5
            var angle = e.npc.rotation
            if (e.npc.getAttackTarget() != null) {
                distanceToJump = e.npc.pos.distanceTo(e.npc.getAttackTarget().pos) / 4.5
                angle = GetPlayerRotation(e.npc, e.npc.getAttackTarget())
            }

            var d = FrontVectors(e.npc, angle, 0, distanceToJump, 0)
            e.npc.setMotionX(d[0])
            e.npc.setMotionZ(d[2])
            e.npc.setMotionY(.4)
            e.npc.timers.forceStart(CHECK_IF_LANDED_TIMER, 0, true)
            e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.goat.long_jump", 1, getRandomFloat(0.2, 0.9))
            e.npc.world.playSoundAt(e.npc.pos, "minecraft:block.beehive.exit", 1, getRandomFloat(0.2, 0.9))
            e.npc.executeCommand("/particle block " + e.npc.world.getBlock(e.npc.pos.down(1)).getName() + " ~ ~-.5 ~ .2 .2 .2 0 4 force")

            break;
        case CHECK_IF_LANDED_TIMER:
            if (e.npc.getMCEntity().m_20096_()) {
                e.npc.timers.stop(CHECK_IF_LANDED_TIMER)
                isAttacking = false
                justLanded = true
                e.npc.timers.forceStart(JUST_LANDED_TIMER, 2, false)
                e.npc.ai.setWalkingSpeed(2)
                e.npc.world.playSoundAt(e.npc.pos, "upgrade_aquatic:entity.perch.hurt", 1, getRandomFloat(0.2, 0.9))
                e.npc.executeCommand("/particle block " + e.npc.world.getBlock(e.npc.pos.down(1)).getName() + " ~ ~-.5 ~ .2 .2 .2 0 10 force")
                e.npc.timers.forceStart(COOLDOWN_TIMER, getRandomInt(10, 30), false)
            }
            break;
        case JUST_LANDED_TIMER:
            justLanded = false
            break;

    }
}

function collide(e) {
    if ((isAttacking && !e.npc.getMCEntity().m_20096_()) || justLanded) {
        if (e.entity.pos.distanceTo(e.npc.pos) > 1) return
        e.entity.damage(2)
        DoKnockback(e.npc, e.entity, 1, 0)
    }
}
