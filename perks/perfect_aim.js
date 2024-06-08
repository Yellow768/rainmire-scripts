function perk_perfect_aim(e, cost) {
    if (e.player.hasTag("perfectAimActive")) {
        e.player.removeTag("perfectAimActive")
        displayTitle(e, "Perfect Aim Disabled", "aqua")
    }
    else {
        e.player.addTag("perfectAimActive")
        displayTitle(e, "Perfect Aim Activated", "aqua")
    }
}

function perfect_aim_ranged_launched(e) {
    if (!attemptToUsePerkPower(e, good_perks["perfect_aim"].cost)) return
    e.player.timers.start(id("findArrowForPerfectAim"), 0, false)
    e.player.world.playSoundAt(e.player.pos, "minecraft:ambient.underwater.enter", .6, 1)
    //e.player.world.playSoundAt(e.player.pos, "minecraft:item.bucket.empty", .6, .7)
    e.player.world.playSoundAt(e.player.pos, "create:fwoomp", 1, 2)

}

var shotArrows = []


function perfect_aim_timers(e) {
    if (e.id == id("findArrowForPerfectAim")) {
        var arrows = e.player.world.getNearbyEntities(e.player.pos, 8, 10)
        for (var arrow = 0; arrow < arrows.length; arrow++) {
            if (arrows[arrow].getEntityNbt().getInteger("life") == 0) {
                arrows[arrow].tempdata.put("vector", [arrows[arrow].getMotionX(), arrows[arrow].getMotionY(), arrows[arrow].getMotionZ()])
                arrows[arrow].y += .2
                var nbt = arrows[arrow].getEntityNbt()
                nbt.setBoolean("NoGravity", true)
                arrows[arrow].setEntityNbt(nbt)
                shotArrows.push(arrows[arrow])

            }

        }
        if (shotArrows.length > 0 && !e.player.timers.has(id("applyContinuousMotionToArrows"))) {
            e.player.timers.forceStart(id("applyContinuousMotionToArrows"), 0, true)
        }
    }
    if (e.id == id("applyContinuousMotionToArrows")) {
        var groundedArrowsIndex = []
        for (var i = 0; i < shotArrows.length; i++) {
            shotArrows[i].setMotionX(shotArrows[i].tempdata.get("vector")[0])
            shotArrows[i].setMotionY(shotArrows[i].tempdata.get("vector")[1])
            shotArrows[i].setMotionZ(shotArrows[i].tempdata.get("vector")[2])
            shotArrows[i].world.spawnParticle("bubble_pop", shotArrows[i].x, shotArrows[i].y - .2, shotArrows[i].z, .1, .1, .1, 0, 50)
            shotArrows[i].world.spawnParticle("splash", shotArrows[i].x, shotArrows[i].y - .2, shotArrows[i].z, .2, .2, .2, 0, 50)

            if (shotArrows[i].getEntityNbt().getBoolean("inGround") || !shotArrows[i].isAlive()) {
                groundedArrowsIndex.push(i)

            }

        }
        for (var i = 0; i < groundedArrowsIndex.length; i++) {
            shotArrows.splice(i, 1)
        }
        if (shotArrows.length < 1) {
            e.player.timers.stop(id("applyContinuousMotionToArrows"))
        }
    }
    /*
    for (var i = 0; i < 15; i++) {
        var arrow = e.player.world.createEntityFromNBT(shotArrow.getEntityNbt())
        arrow.generateNewUUID()
        arrow.setPos(shotArrow.pos)
        var spread = 1.2
        arrow.x += getRandomFloat(-spread, spread)
        arrow.y += getRandomFloat(-spread, spread)
        arrow.z += getRandomFloat(-spread, spread)
        e.player.world.spawnEntity(arrow)
    }
    */

}
