var animationExample = { disabled: [0, 0, 0, 1, 1, 1], pose1: [[169, 180, 182], [29, 188, 235], [170, 180, 169], [180, 180, 180], [180, 180, 180], [180, 180, 180]], pose2: [[180, 180, 180], [182, 182, 237], [180, 180, 180], [180, 180, 180], [180, 180, 180], [180, 180, 180]], speed: 5 }
var swingEnd = { disabled: [1, 0, 1, 1, 1, 1], pose1: [[180, 180, 180], [182, 182, 237], [180, 180, 180], [180, 180, 180], [180, 180, 180], [180, 180, 180]], pose2: [[180, 180, 180], [182, 182, 180], [180, 180, 180], [180, 180, 180], [180, 180, 180], [180, 180, 180]], speed: 6 }
function init(e) {
    e.npc.timers.stop(1)
    e.npc.stats.getMelee().setDelay(72000)
}

function interact(e) {
    e.npc.say(e.npc.getMCEntity().field_70732_aI)
}

function target(e) {
    e.npc.timers.forceStart(3, 40, false)
}

function meleeAttack(e) {
    e.npc.say(e.npc.getMCEntity().field_70732_aI)
    e.npc.getMCEntity().field_110158_av = 0

    e.setCanceled(true)
}

function timer(e) {
    if (e.id == 3) {
        triggerAnimation(e, animationExample)
        e.npc.timers.forceStart(1, 4, false)
    }

    if (e.id == 1) {
        triggerAnimation(e, swingEnd)
        e.npc.timers.forceStart(2, 4, false)
    }
    if (e.id == 2) {
        e.npc.getJob().setIsAnimated(false)
        var pnbt = e.npc.getEntityNbt()
        pnbt.setByte("PuppetStanding", 0)
        pnbt.setByte("PuppetMoving", 0)
        pnbt.setByte("PuppetAttacking", 0)

        e.npc.setEntityNbt(pnbt)
        e.npc.getMCEntity().field_110158_av = 0
        e.npc.updateClient()
        e.npc.timers.forceStart(3, 20, false)
    }
}

function triggerAnimation(e, animation) {
    var pnbt = e.npc.getEntityNbt()
    pnbt.setByte("PuppetStanding", 1)
    pnbt.setByte("PuppetMoving", 1)
    pnbt.setByte("PuppetAttacking", 1)
    pnbt.getCompound("PuppetRLeg").setByte("Disabled", animation.disabled[5])
    pnbt.getCompound("PuppetLLeg").setByte("Disabled", animation.disabled[4])
    pnbt.getCompound("PuppetRArm").setByte("Disabled", animation.disabled[2])
    pnbt.getCompound("PuppetLArm").setByte("Disabled", animation.disabled[1])
    pnbt.getCompound("PuppetBody").setByte("Disabled", animation.disabled[3])
    pnbt.getCompound("PuppetHead").setByte("Disabled", animation.disabled[0])
    e.npc.setEntityNbt(pnbt)
    e.npc.getMCEntity().field_110158_av = 0


    for (var i = 0; i < 6; i++) {
        if (animation.disabled[i] == 0) {
            e.npc.getJob().getPart(i).setRotation(animation.pose1[i][0], animation.pose1[i][1], animation.pose1[i][2])
        }
    }
    for (var i = 6; i < 11; i++) {
        if (animation.disabled[i] == 0) {
            e.npc.getJob().getPart(i).setRotation(animation.pose2[i - 6][0], animation.pose2[i - 6][1], animation.pose2[i - 6][2])
        }
    }
    e.npc.getJob().setAnimationSpeed(animation.speed)
    e.npc.getJob().setIsAnimated(true)
    e.npc.updateClient()

}
