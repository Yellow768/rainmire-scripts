
var direction




function dash(e) {
    if (!attemptToUseHydration(2)) {

        return
    }
    direction = player.getRotation()
    if (isMovingForward) {
        direction = player.getRotation()
    }
    if (isMovingBackwards) {
        direction = player.getRotation() + 180
    }
    if (isMovingLeft) {
        direction -= 90
        if (isMovingForward) {
            direction += 45
        }
        if (isMovingBackwards) {
            direction += 135
        }
    }
    if (isMovingRight) {
        direction += 90
        if (isMovingForward) {
            direction -= 45
        }
        if (isMovingBackwards) {
            direction -= 135
        }
    }
    var d
    player.timers.forceStart(id("DASH_COLLISION_CHECK"), 0, true)
    if (player.getMount()) {
        d = FrontVectors(player, player.getMount().getRotation(), 0, 1.6, false)
    }
    else if (player.getMCEntity().m_5842_()) {
        d = FrontVectors(player, direction, -player.pitch * .4, (.8 * (getScore("swmspd") + 1)) * Math.max(((90 - Math.abs(e.player.pitch)) / 90), .6), false)
        e.player.timers.forceStart(id("is_player_underwater"), 0, true)
    }
    else if (e.player.isSneaking() && isOnGround(e.player) && getScore("dash_c")) {
        d = FrontVectors(player, 0, 60, 1.3, true)
    }
    else {
        d = FrontVectors(player, direction, 7, 1.6, false)
    }
    if (player.getMount()) {
        player.getMount().setMotionY(d[1])
        player.getMount().setMotionX(d[0])
        player.getMount().setMotionZ(d[2])
    }
    if (!player.getMCEntity().m_20096_()) {
        player.setMotionY(d[1] * 1.7)
        player.setMotionX(d[0] / 2)
        player.setMotionZ(d[2] / 2)
    }
    else {
        player.setMotionY(d[1] * 1.3)
        player.setMotionX(d[0])
        player.setMotionZ(d[2])
    }
    player.timers.forceStart(id("DASH_TIMER"), 15, false)
    player.timers.forceStart(id("dash_visual_effects"), 0, true)


    player.addTag("isDashing")
    player.world.playSoundAt(player.pos, "minecraft:item.bucket.empty", 1, 1)
    player.world.playSoundAt(player.pos, "variedcommodities:magic.shot", 1, 1)
    player.world.playSoundAt(player.pos, "minecraft:ambient.underwater.exit", 1, 1)
    if (getScore("dash_b")) player.timers.forceStart(id("start_dash_glide"), 7 + (Number(e.player.isSneaking()) * 8), false)

}

var delay = 0
var glide_power_consumption_iteration = 0
var max_glide_power_consumption_number = 10

function dash_timers(e) {
    switch (e.id) {
        case id("DASH_TIMER"):

            player.removeTag("isDashing")
            player.timers.stop(id("DASH_COLLISION_CHECK"))
            player.timers.stop(id("dash_visual_effects"))
            e.player.timers.stop(id("is_player_underwater"))
            //player.world.playSoundAt(player.pos, "minecraft:weather.rain", .2, 1)
            break;
        case id("dash_visual_effects"):
            var angle = player.getRotation()
            var dx = -Math.sin(angle * Math.PI / 180)
            var dz = Math.cos(angle * Math.PI / 180)
            // player.world.spawnParticle("cloud", player.x, player.y + 1, player.z, 0.1, .1, 0.1, .01, 5)
            player.world.spawnParticle("bubble_pop", player.x - dx, player.y + 1, player.z - dz, 0.1, .1, 0.1, .01, 50)
            player.world.spawnParticle("falling_water", player.x - dx, player.y + 1, player.z - dz, 0.1, .2, 0.1, 1, 5)
            break
        case id("start_dash_glide"):
            e.player.addTag("dashGliding")
            e.player.timers.forceStart(id("dash_glide"), 0, true)
            e.API.executeCommand(e.player.world, "/attribute " + e.player.name + " forge:entity_gravity base set 0.002")
            e.player.tempdata.put("initial_angle", e.player.rotation)
            e.player.tempdata.put("dash_glide_motion", d)
            break;
        case id("dash_glide"):
            var initial_angle = e.player.tempdata.get("initial_angle")
            if (isMovingLeft) initial_angle -= 1.3
            if (isMovingRight) initial_angle += 1.3

            e.player.tempdata.put("initial_angle", initial_angle)
            var d = FrontVectors(e.player, initial_angle, 0, .60, false)
            e.player.setMotionX(d[0])
            e.player.setMotionZ(d[2])
            player.world.spawnParticle("falling_water", player.x, player.y - 2, player.z, 0.1, .7, 0.1, 1, 50)
            player.world.spawnParticle("bubble_pop", player.x, player.y, player.z, 0.3, .2, 0.3, .01, 100)
            glide_power_consumption_iteration++
            if (glide_power_consumption_iteration > max_glide_power_consumption_number) {
                if (!attemptToUseHydration(1)) deactivateDashGlide(e)
                glide_power_consumption_iteration = 0
                executeCommand("/playsound minecraft:weather.rain voice @a " + player.x + " " + player.y + " " + player.z + " 1")
            }
            if (isOnGround(e.player) || e.player.inWater()) {
                deactivateDashGlide(e)
            }
            player.getMCEntity().f_19789_ = 0
            break;


    }
}


function deactivateDashGlide(e) {
    e.player.timers.stop(id("dash_glide"))
    e.player.timers.stop(id("start_dash_glide"))
    e.API.executeCommand(e.player.world, "/attribute " + e.player.name + " forge:entity_gravity base set 0.08")
    glide_power_consumption_iteration = 0
    executeCommand("stopsound " + player.name + " voice minecraft:weather.rain")
}


