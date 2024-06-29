var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(API.getLevelDir() + "/scripts/ecmascript/boiler/commonFunctions.js");
load(API.getLevelDir() + "/scripts/ecmascript/boiler/id_generator.js");

var player
var NAME_GUI
var guard_npc

function init(e) {
    player = e.player


    e.player.timers.stop(id("liftSound"))
    e.player.timers.stop(id("explosionEffects"))
    e.player.timers.stop(id("smallEffects"))
    e.player.timers.stop(id("rapidEffects"))
    e.player.timers.stop(id("playerAt2Health"))
    e.player.timers.stop(id("chantLoop"))
    e.player.timers.stop(id("windSoundLoop"))
    e.player.timers.stop(id("preventEscape"))
    e.player.timers.stop(id("preventEscape2"))

}

function attack(e) {
    if (e.player.hasTag("Intro")) {
        e.setCanceled(true)
        e.player.message("Your hands are cuffed, you are unable to attack.")
    }
}

function chat(e) {
    if (e.message == "intro") {
        e.setCanceled(true)
        e.API.executeCommand(e.player.world, "/title @a times 0 30 40")
        e.API.executeCommand(e.player.world, '/title @a title {"text":"🆘"}')
        e.player.timers.forceStart(id("keepPlayerInAir"), 0, true)
        e.player.timers.forceStart(id("triggerGuardIntro"), 90, false)
        findGuardNPC(e)
        guard_npc.tempdata.put("player", e.player)
        e.player.timers.forceStart(id("windSoundLoop"), 390, true)



    }
    if (e.message == "interact") {
        e.player.world.getBlock(1746, 227, 248).interact(0)

    }
    if (e.message == "interacta") {
        e.player.world.getBlock(1727, 80, 235).interact(0)

    }
    if (e.message == "interactb") {
        e.player.world.getBlock(1727, 78, 235).interact(0)

    }
    if (e.message == "interactc") {
        e.player.world.getBlock(1727, 76, 235).interact(0)

    }
    if (e.message == "liftScene") {
        e.player.timers.start(id("startLift"), 20, false)
    }
    if (e.message == "lowHealth") {
        e.player.timers.start(id("playerAt2Health"), 0, true)
    }
    if (e.message == "sound") {
        playLiftStopSound(e)
    }
    if (e.message == "toggleIntro") {
        if (e.player.hasTag("Intro")) {
            e.player.removeTag("Intro")
            e.player.message("Regular")
            return
        }
        if (!e.player.hasTag("Intro")) {
            e.player.addTag("Intro")
            e.player.message("Intro Mode")
            return
        }
    }
}

function playLiftStopSound(e) {
    e.player.playSound("minecraft:entity.item.break", 1, .2)
    e.player.playSound("minecraft:entity.item.break", 1, 2)
    e.player.playSound("minecraft:block.iron_door.close", 1, .2)
}

function trigger(e) {
    if (e.id == id("showNameGui")) {
        createNameGui(e)
    }
}


function broken(e) {
    if (e.player.hasTag("Intro")) {
        e.setCanceled(true)
    }
}

function timer(e) {
    if (e.id == id("triggerGuardIntro") && guard_npc) {
        guard_npc.trigger(id("enterPlayerCell"))
        e.player.timers.forceStart(id("showNameGui"), 140, false)
    }
    if (e.id == id("showNameGui")) {
        createNameGui(e)
    }
    if (e.id == id("keepPlayerInAir")) {
        e.API.executeCommand(player.world, "tp " + player.name + " 1717 207 382")
        e.API.executeCommand(player.world, "/attribute " + e.player.name + " forge:entity_gravity base set 0")
        player.setMotionX(0)
        player.setMotionY(0)
        player.setMotionZ(0)
        if (player.rotation > 75) { e.API.executeCommand(player.world, "tp " + player.name + " 1717 207 382 75 " + player.pitch) }
        if (player.rotation < -75) { e.API.executeCommand(player.world, "tp " + player.name + " 1717 207 382 -75 " + player.pitch) }
    }
    if (e.id == id("startLift")) {
        e.player.world.getBlock(1746, 227, 248).interact(0)
        e.player.playSound("minecraft:entity.minecart.inside", .2, .4)
        e.player.timers.start(id("liftSound"), 115, true)
        e.player.timers.start(id("landInAethelric"), 440, false)
        e.API.executeCommand(e.player.world, "/playsound iob:music.descent record " + e.player.name + " " + e.player.x + " " + e.player.y + " " + e.player.z + " 1 1")
    }
    if (e.id == id("liftSound")) {
        e.player.playSound("minecraft:entity.minecart.inside", .2, .4)

    }
    if (e.id == id("landInAethelric")) {
        e.API.executeCommand(e.player.world, "/stopsound " + e.player.name + " * minecraft:entity.minecart.inside")
        e.player.timers.stop(id("liftSound"))
        e.player.timers.start(id("startAethelricDialog"), 60, false)
        playLiftStopSound(e)
        e.player.playSound("minecraft:item.elytra.flying", .1, .2)
        e.player.timers.forceStart(id("windSoundLoop"), 390, true)
        e.player.timers.forceStart(id("preventEscape"), 1, true)
    }
    if (e.id == id("preventEscape")) {
        if (e.player.x > 1750 || e.player.x < 1743 || e.player.z > 258 || e.player.z < 250) {
            e.player.setPosition(1746, 107, 254)
        }
    }
    if (e.id == id("windSoundLoop")) {
        e.player.playSound("minecraft:item.elytra.flying", .1, .2)
    }
    if (e.id == id("startAethelricDialog")) {
        e.player.timers.stop(id("preventEscape"))
        e.player.showDialog(368, "§bAethelric Blackmoor")
    }
    if (e.id == id("stopLiftSound")) {
        e.API.executeCommand(e.player.world, "/stopsound " + e.player.name + " * minecraft:entity.minecart.inside")
        playLiftStopSound(e)

        e.player.timers.start(id("preventEscape2"), 0, true)

    }
    if (e.id == id("preventEscape2")) {
        if (e.player.x > 1750 || e.player.x < 1743 || e.player.z > 258 || e.player.z < 250) {
            e.player.setPosition(1746, 86, 254)
        }

    }
    if (e.id == id("beginExecution")) {
        e.player.world.getBlock(1746, 227, 248).interact(0)
        e.player.timers.start(id("startSmallEffects"), 140, false)
        e.player.timers.start(id("startRapidEffects"), 320, false)
        e.player.timers.start(id("startExplosionEffects"), 440, false)
        e.player.playSound("minecraft:entity.minecart.inside", .6, .4)
        e.player.timers.start(id("stopLiftSound"), 105, false)

        e.API.executeCommand(e.player.world, "/playsound iob:music.execution record " + e.player.name + " " + e.player.x + " " + e.player.y + " " + e.player.z + " .3 1")
        e.API.executeCommand(e.player.world, "/stopsound " + e.player.name + " * iob:music.descent")
    }
    if (e.id == id("chantLoop")) {

        e.player.world.playSoundAt(e.player.pos.up(15), "iob:intro.chant", .3, getRandomFloat(0.9, 1.1))
    }
    if (e.id == id("startSmallEffects")) {

        e.player.timers.start(id("smallEffects"), 40, true)
        e.player.timers.start(id("playerAt2Health"), 0, true)
    }
    if (e.id == id("smallEffects")) {

        e.player.world.spawnParticle("alexsmobs:worm_portal", e.player.x, e.player.y, e.player.z, 2, 2, 2, 0, 500)
        e.player.world.spawnParticle("aquamirae:electric", e.player.x, e.player.y, e.player.z, 2, 2, 2, 0, 500)
        e.player.world.playSoundAt(e.player.pos, "minecraft:block.conduit.activate", 1, .6)
        e.player.world.playSoundAt(e.player.pos, "minecraft:block.beacon.power_select", 1, .3)

    }
    if (e.id == id("startRapidEffects")) {
        e.player.timers.forceStart(id("rapidEffects"), 20, true)
        e.player.timers.start(id("damage_1"), 130, false)
        e.player.addPotionEffect(9, 900, 0, false)
    }
    if (e.id == id("rapidEffects")) {
        e.player.world.spawnParticle("alexsmobs:worm_portal", e.player.x, e.player.y, e.player.z, 5, 5, 5, 0, 2000)
        e.player.world.spawnParticle("aquamirae:electric", e.player.x, e.player.y, e.player.z, 5, 5, 5, 0, 2000)
        e.player.world.spawnParticle("aquamirae:shine", e.player.x, e.player.y, e.player.z, 5, 5, 5, 0, 2000)
        e.player.world.playSoundAt(e.player.pos, "minecraft:block.conduit.deactivate", 1, .2)
    }
    if (e.id == id("startExplosionEffects")) {
        e.player.timers.start(id("explosionEffects"), 10, true)

    }
    if (e.id == id("explosionEffects")) {
        var explosion_type = ["explosion", "explosion_emitter"]
        var explosion_sound_type = ["minecraft:entity.generic.explode", "customnpcs:misc.old_explode"]
        var offsetX = getRandomInt(10, -10)
        var offsetZ = getRandomInt(3, -3)
        var randomX = getRandomInt(1746, 1755)
        var randomZ = getRandomInt(255, 265)
        var pos = e.player.world.getBlock(randomX + offsetX, e.player.y, randomZ + offsetZ).getPos()
        e.player.world.spawnParticle("alexsmobs:worm_portal", randomX + offsetX, e.player.y, randomZ + offsetZ, 1, 1, 1, 0, 500)
        e.player.world.spawnParticle("aquamirae:electric", randomX + offsetX, e.player.y, randomZ + offsetZ, 1, 1, 1, 0, 500)
        e.player.world.spawnParticle("aquamirae:shine", e.player.x, e.player.y, e.player.z, 5, 5, 5, 0, 500)
        e.player.world.spawnParticle(explosion_type[getRandomInt(0, 2)], randomX + offsetX, e.player.y, randomZ + offsetZ, 1, 1, 1, 0, 50)
        e.player.world.spawnParticle("aquamirae:shine", randomX + offsetX, e.player.y, randomZ + offsetZ, 5, 5, 5, 0, 500)
        e.player.world.playSoundAt(pos, explosion_sound_type[getRandomInt(0, 2)], 1, .6)
        e.player.world.playSoundAt(pos, "customnpcs:magic.shot", 1, .3)
        e.player.world.playSoundAt(pos, "minecraft:block.beacon.power_select", 1, .3)
        e.player.world.playSoundAt(pos, "minecraft:block.beacon.deactivate", 1, .3)

    }
    if (e.id == id("damage_1")) {
        e.player.world.getBlock(1727, 78, 235).interact(0)
        e.player.timers.start(id("damage_2"), 30, false)

    }
    if (e.id == id("damage_2")) {
        e.player.world.getBlock(1727, 76, 235).interact(0)

    }
    if (e.id == id("playerAt2Health")) {
        if (e.player.health <= 4) {
            e.player.world.spawnParticle("explosion", e.player.x, e.player.y, e.player.z, 2, 2, 2, 0, 500)
            e.player.world.spawnParticle("aquamirae:electric", e.player.x, e.player.y, e.player.z, .2, .2, .2, 0, 500)
            e.player.timers.start(id("tpPlayer"), 20, false)
            e.player.timers.stop(id("playerAt2Health"))
            e.API.executeCommand(e.player.world, "/title @a times 5 36 10")
            e.API.executeCommand(e.player.world, '/title @a title {"text":"♞"}')
            e.API.executeCommand(e.player.world, '/stopsound @a voice iob:intro.chant')
            e.player.timers.stop(id("chantLoop"))
            e.player.timers.stop(id("windSoundLoop"))
            e.player.timers.start(id("windLoop2"), 40, true)
            e.API.executeCommand(e.player.world, "/playsound minecraft:item.elytra.flying voice " + e.player.name + " " + e.player.x + " " + e.player.y + " " + e.player.z + " 10000 .3")
            e.API.executeCommand(e.player.world, "/playsound minecraft:entity.firework_rocket.twinkle_far ambient " + e.player.name + " " + e.player.x + " " + e.player.y + " " + e.player.z + " 10000 .3")
            e.API.executeCommand(e.player.world, "/playsound minecraft:block.beacon.power_select ambient " + e.player.name + " " + e.player.x + " " + e.player.y + " " + e.player.z + " 10000 .3")
            e.API.executeCommand(e.player.world, "/playsound customnpcs:magic.shot ambient " + e.player.name + " " + e.player.x + " " + e.player.y + " " + e.player.z + " 10000 .3")
            e.API.executeCommand(e.player.world, "/playsound minecraft:entity.generic.explode ambient " + e.player.name + " " + e.player.x + " " + e.player.y + " " + e.player.z + " 10000 .6")
            e.API.executeCommand(e.player.world, "/playsound minecraft:block.beacon.deactivate ambient " + e.player.name + " " + e.player.x + " " + e.player.y + " " + e.player.z + " 10000 .3")
            e.API.executeCommand(e.player.world, "/playsound minecraft:block.bubble_column.upwards_inside ambient " + e.player.name + " " + e.player.x + " " + e.player.y + " " + e.player.z + " 10000 .3")
            e.API.executeCommand(e.player.world, "/playsound iob:effect.large_collapse voice " + e.player.name + " " + e.player.x + " " + e.player.y + " " + e.player.z + " 10000 1")
            e.player.clearPotionEffects()
            e.player.timers.stop(id("preventEscape2"))
        }
    }
    if (e.id == id("windLoop2")) {
        e.player.playSound("minecraft:item.elytra.flying", 1, 2)
    }
    if (e.id == id("tpPlayer")) {

        e.player.world.spawnParticle("explosion", 1592, 146, 1096, .2, .2, .2, 0, 500)
        e.player.world.spawnParticle("aquamirae:electric", 1592, 146, 1096, .2, .2, .2, 0, 500)
        e.player.setPosition(1592, 186, 1096)

        e.player.playSound("minecraft:item.elytra.flying", 1, 2)


        e.player.timers.forceStart(id("maintainYLoop"), 0, true)
        e.player.timers.forceStart(id("maintainYStop"), 40, false)
        e.player.timers.forceStart(id("checkForYBelow76"), 0, true)
        e.player.timers.stop(id("explosionEffects"))
        e.player.timers.stop(id("smallEffects"))
        e.player.timers.stop(id("rapidEffects"))
        e.player.timers.forceStart(id("randomOutsideEffects"), 15, true)
        e.player.timers.forceStart(id("randomOutsideEffects2"), 12, true)
        for (var i = 0; i < 5; i++) {
            var randPos = e.player.world.getBlock(1625, 111, 1117).getPos()
            randPos = randPos.add(getRandomInt(-60, 60), getRandomInt(20, 90), getRandomInt(-60, 60))
            var fire = entityShoot(randPos, {
                speed: .01,
                itemid: "minecraft:deepslate_bricks",
                isArrow: 0,
                canBePickedUp: 0,
                deviation: 10,
                spins: 0,
                size: 160 + getRandomFloat(-5, 5),
                trailenum: 1,
                pitch: getRandomFloat(-45, 45),
                render3d: 1,
                glows: 1,
            })
        }

    }
    if (e.id == id("randomOutsideEffects")) {
        e.API.executeCommand(e.player.world, "/particle minecraft:explosion_emitter " + (1626 + getRandomInt(-40, 40)) + " " + (111 + getRandomInt(-40, 40)) + " " + (1116 + getRandomInt(-40, 40)) + " 2 2 2 0 10 force")
        e.player.world.playSoundAt(e.player.pos, "minecraft:entity.generic.explode", .1, .6)
        e.player.world.playSoundAt(e.player.pos, "customnpcs:magic.shot", .1, .3)
        e.player.world.playSoundAt(e.player.pos, "minecraft:entity.firework_rocket.twinkle_far", .1, .3)
        e.player.world.spawnParticle("alexsmobs:worm_portal", e.player.x, e.player.y, e.player.z, 20, 20, 20, 0, 300)
        e.player.world.spawnParticle("aquamirae:shine", e.player.x, e.player.y, e.player.z, 20, 20, 20, 0, 300)
    }
    if (e.id == id("randomOutsideEffects2")) {
        e.API.executeCommand(e.player.world, "/particle minecraft:explosion_emitter " + (1626 + getRandomInt(-40, 40)) + " " + (111 + getRandomInt(-40, 40)) + " " + (1116 + getRandomInt(-40, 40)) + " 2 2 2 0 10 force")
    }
    if (e.id == id("maintainYLoop")) {
        e.player.y = 186
        e.API.executeCommand(e.player.world, "/attribute " + e.player.name + " forge:entity_gravity base set 0")
        e.player.world.spawnParticle("aquamirae:electric", 1592, 146, 1096, 2, 2, 2, 0, 500)
        e.player.world.spawnParticle("aquamirae:electric", 1592, 146, 1096, 2, 2, 2, 0, 500)
        e.player.world.spawnParticle("explosion", e.player.x, e.player.y, e.player.z, 2, 2, 2, 0, 200)
        e.player.setMotionY(0)
    }
    if (e.id == id("maintainYStop")) {
        e.player.timers.stop(id("maintainYLoop"))
        e.API.executeCommand(e.player.world, "/attribute " + e.player.name + " forge:entity_gravity base set 0.08")
    }
    if (e.id == id("checkForYBelow76")) {
        if (e.player.y <= 77) {
            e.player.timers.stop(id("windLoop2"))
            e.player.world.spawnParticle("aquamirae:electric", e.player.x, e.player.y, e.player.z, 20, 20, 20, 0, 900)
            e.player.world.spawnParticle("aquamirae:shine", e.player.x, e.player.y, e.player.z, 20, 20, 20, 0, 900)
            e.API.executeCommand(e.player.world, "/title @a times 0 200 0")
            e.API.executeCommand(e.player.world, '/title @a title {"text":"𐌺☎𐌼"}')
            e.player.timers.stop(id("checkForYBelow76"))
            e.player.timers.start(id("startIntroDialog"), 90, false)
            e.API.executeCommand(e.player.world, "stopsound " + e.player.name + " voice")
            e.player.playSound("minecraft:entity.player.splash.high_speed", 1, .7)
            e.player.playSound("minecraft:entity.turtle.egg_break", 1, .7)
            e.player.timers.start(id("fadeToBlack"), 150, false)
            e.player.timers.stop(id("randomOutsideEffects"))
            e.player.timers.stop(id("randomOutsideEffects2"))
            e.player.setPosition(1698, 73, 2848)
            e.API.executeCommand(e.player.world, "clear " + e.player.name)

        }
    }
    if (e.id == id('fadeToBlack')) {
        e.API.executeCommand(e.player.world, "/title @a times 0 10000 0")
        e.API.executeCommand(e.player.world, '/title @a title {"text":"🆘"}')
        e.player.timers.start(id("dialogDelay"), 30, false)
        e.player.gamemode = 1
        //e.player.setPosition(1715, 68, 2861)
    }
    if (e.id == id("dialogDelay")) {
        e.player.showDialog(331, "§k???")
        e.API.executeCommand(e.player.world, "weather clear")
    }
}

function dialog(e) {
    if (e.dialog.id == 331) {
        e.player.playSound("minecraft:ambient.underwater.loop", 1, .2)
        e.player.playSound("minecraft:item.elytra.flying", .1, .2)
        e.player.playSound("iob:music.transient", .1, .2)
        e.player.timers.start(id("windSoundLoop"), 390, true)
    }
    if (e.dialog.id == 333) {
        e.player.playSound("iob:effect.stretching", 1, 1)
    }

    if (e.dialog.id == 334) {
        e.player.playSound("iob:effect.blood_rushing", 1, 1)
    }

    if (e.dialog.id == 336) {
        e.player.playSound("iob:effect.heart_pounding", 1, 1)
    }
}

function dialogClose(e) {
    if (e.dialog.id == 349) {
        guard_npc.trigger(id("navigateToFirstCorner"))
        e.player.timers.stop(id("keepPlayerInAir"))
        e.API.executeCommand(player.world, "/attribute " + e.player.name + " forge:entity_gravity base set 0.08")
        e.player.playSound("minecraft:block.chain.place", 1, .7)
        e.player.playSound("minecraft:item.armor.equip_chain", 1, .7)
    }
    if (e.dialog.id == 380) {
        e.player.timers.start(id("beginExecution"), 30, false)
        e.player.world.playSoundAt(e.player.pos.up(10), "iob:intro.chant", .4, getRandomFloat(0.8, 1.2))
        e.player.timers.start(id("chantLoop"), 180, true)

    }
}

function dialogOption(e) {
    if (e.dialog.id == 337) {
        e.player.addPotionEffect(15, 1, 1, false)
        e.API.executeCommand(e.player.world, "stopsound " + e.player.name)
        e.API.executeCommand(e.player.world, "/tp " + e.player.name + " 1690 75 2848 135 -76")
        e.API.executeCommand(e.player.world, "/playsound iob:music.intro record " + e.player.name + " " + e.player.x + " " + e.player.y + " " + e.player.z)
        e.API.executeCommand(e.player.world, '/title ' + e.player.name + ' times 20 40 20')
        e.API.executeCommand(e.player.world, '/title ' + e.player.name + ' subtitle {"text":"Draw your first breath, once more","italic":true,"color":"yellow"}')
        e.API.executeCommand(e.player.world, '/title ' + e.player.name + ' title {"text":" ","bold":true,"color":"yellow"}')
        e.player.playSound("iob:ui.breath", 1, 1)
        e.player.gamemode = 2
        e.player.removeTag("Intro")
        e.player.trigger(6, [])
        e.player.addPotionEffect(6, 1, 1, true)

    }
}

var confirmed = false

function createNameGui(e) {
    NAME_GUI = e.API.createCustomGui(1, 256, 256, true, player)
    NAME_GUI.addLabel(1, "What is your name?", 90, 40, 1, 1, 0xffffff)
    NAME_GUI.addTextField(2, 60, 60, 160, 15)
    NAME_GUI.addButton(3, "Confirm", 90, 90, 80, 20).setOnPress(function (gui, t) { confirmName(gui, t, e) })
    player.showCustomGui(NAME_GUI)
}




function findGuardNPC(e) {
    var nE = e.player.world.getNearbyEntities(e.player.pos, 100, 2)
    for (var i = 0; i < nE.length; i++) {
        if (nE[i].name == "Releasing Guard") {
            guard_npc = nE[i]
            break;
        }
    }
}




function confirmName(gui, t, e) {
    confirmed = true;
    player.closeGui();
    e.API.executeCommand(player.world, "execute as " + player.name + " run mpm name " + gui.getComponent(2).getText())
    player.showDialog(344, "Robed Guard")

}

function customGuiClosed(e) {
    if (e.gui != NAME_GUI) { return }
    if (!confirmed) {
        e.player.timers.start(id("showNameGui"), 2, false)
    }
}


///particle alexsmobs:worm_portal ~ ~ ~ 5 5 5 0 500
///particle aquamirae:electric ~ ~ ~ 5 5 5 0 100
///particle aquamirae:shine ~ ~ ~ 5 5 5 0 100


//PROJECTILE SHOOTING
//Credit to Runonstoff https://pastebin.com/aqx0xYmh


/**
 * Shoot from an actual entity.
 * This function will set a few additional entity related options of the projectile
 * @param {IEntity} entity The entity to shoot from, usually a player.
 * @param {Object} projectileData Extra settings to override projectile 
 */


function verify() {
    return true
}

function entityShoot(pos, projectileData) {
    var projectile = createProjectile(player.world, Object.assign({
        x: pos.x,
        y: pos.y, //func_70047_e = getEyeHeight
        z: pos.z,
        rotation: getRandomInt(0, 360),
        pitch: getRandomInt(-45, 0)
    }, projectileData));
    player.world.spawnEntity(projectile);
    return projectile

}

//Object.assign polyfill, some java/nashorn installations dont have Object.assign and will error without this polyfill!
if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (target) {
            'use strict';
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert first argument to object');
            }

            var to = Object(target);
            for (var i = 1; i < arguments.length; i++) {
                var nextSource = arguments[i];
                if (nextSource === undefined || nextSource === null) {
                    continue;
                }
                nextSource = Object(nextSource);

                var keysArray = Object.keys(Object(nextSource));
                for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                    var nextKey = keysArray[nextIndex];
                    var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== undefined && desc.enumerable) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
            return to;
        }
    });
}

var API = Java.type('noppes.npcs.api.NpcAPI').Instance();


/**
 * Create a new Custom NPCs Projectile
 * @param {IWorld} world The world to create projectile in (not spawn)
 * @param {Object} options Options to override, see the function to see the available options
 */
function createProjectile(world, options) {
    options = Object.assign({
        x: 0, y: 0, z: 0, /*Position to spawn projectile*/
        trailenum: 0, /*Trail Type: 0:None, 1:Smoke, 2:Portal, 3:Redstone, 4:Lightning, 5:LargeSmoke, 6:Magic, 7:Enchant*/
        PotionEffect: 0, /*Effect: 0:None, 1:Fire, 2:Poison, 3:Hunger, 4:Weakness, 5:Slowness, 6:Nausea, 7:Blindness, 8:Wither*/
        effectDuration: 5,  /*Effect duration, 1-99999, used if effect is not 0*/
        gravity: 1, /*Is the projectile affected by gravity: 0 or 1*/
        accelerate: 0, /*Does the projectile accelerate: 0 or 1, only effective if gravity is 0*/
        glows: 0, /*Does the projectile glow: 0 or 1*/
        speed: 1, /*Projectile speed: 1-50*/
        power: 0, /*Projectile damage in half-hearts: 0-999*/
        size: 10, /*Projectile size: 5-20, 10 is normal size*/
        punch: 0, /*Projectile knockback: 0-3*/
        explosiveRadius: 0, /*Explosion size: 0:None, 1:Small, 2:Medium, 3:Large*/
        spins: 0, /*Does the projectile spin: 0 or 1*/
        sticks: 0, /*Does the projectile stick to the ground: 0 or 1*/
        render3d: 1, /*Render type: 0 is 2D, 1 is 3D*/
        canBePickedUp: 1, /*whether a player can pick up this projectile*/
        isArrow: 0, /*if 1, projectile will render as a vanilla arrow, set to 1 if using an arrow*/
        itemid: "minecraft:deepslate_bricks", /*item to shoot*/
        itemmeta: 0,/*metadata of the item to shoot*/
        rotation: 0, /*the direction 0-360 to shoot*/
        pitch: 0, /*the pitch -90 - 90 to shoot*/
        deviation: 0,/*recoil, zero is no recoil, recommended is anything between 0-5, but higher is possible*/
        owner: null, /*UUID of projectile owner*/
    }, options);

    function random_sign() {
        return (Math.random() >= 0.5) ? 1 : -1;
    }

    var pi = Math.PI;
    var rot = options.rotation;// angle in X Z axis

    var deviation = Math.random() * random_sign() * (options.deviation);// optional value for arrow to have some deviation
    rot += deviation;




    var xz_vector = options.speed * Math.abs(Math.cos(options.pitch * pi / 180));// projection of motion vector in X Z plane
    var x_dir = Math.sin(rot * pi / 180) * (-1) * xz_vector;// X component of motion vector
    var y_dir = options.speed * Math.sin(options.pitch * pi / 180) * (-1);// Y component of motion vector
    var z_dir = Math.cos(rot * pi / 180) * xz_vector;// Z component of motion vector

    // create NBT string for projectile
    var str = '{id:"customnpcs:customnpcprojectile"' +
        (options.owner ? ',ownerName:"' + options.owner + '"' : '') +
        ',Pos:[' + options.x + 'd,' + (options.y) + 'd,' + options.z +
        'd],PotionEffect:' + options.PotionEffect
        + ',isArrow:' + options.isArrow
        + 'b,punch:' + options.punch
        + ',explosiveRadius:' + options.explosiveRadius
        + ',Item:{id:"' + options.itemid + '",Count:1,Damage:' + options.itemmeta + 's},damagev2:' + options.power
        + 'f,trailenum:' + options.trailenum
        + ',Spins:' + options.spins
        + 'b,glows:' + options.glows
        + 'b,Accelerate:' + options.accelerate
        + 'b,direction:[' + x_dir + 'd,' + y_dir + 'd,' + z_dir
        + 'd],Motion:[' + 0 + 'd,' + 0 + 'd,' + 0// while creating Nbt motion values do nothing, but calculated later in fly
        + 'd],velocity:' + options.speed
        + ',canBePickedUp:' + options.canBePickedUp
        + 'b,size:' + options.size
        + ',Sticks:' + options.sticks
        + 'b,gravity:' + options.gravity
        + 'b,effectDuration:' + options.effectDuration
        + ',Render3D:' + options.render3d
        + 'b}'

    return world.createEntityFromNBT(API.stringToNbt(str));// create actual entity
}



