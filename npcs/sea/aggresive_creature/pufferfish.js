var puffed = false
var dropItem = false
function init(e) {
    e.npc.display.setModel("minecraft:pufferfish")
    e.npc.display.setVisible(0)
    e.npc.updateClient()
    e.npc.timers.stop(1)
    e.npc.timers.stop(2)
    dropItem = true
}

function target(e) {
    if (e.npc.health < 1) return
    e.npc.timers.forceStart(1, getRandomInt(40, 80), false)

}

function targetLost(e) {
    if (e.npc.health < 1) return
    shrink(e)
    e.npc.timers.stop(2)
}

function shrink(e) {
    e.npc.display.setModel("minecraft:pufferfish")
    e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.puffer_fish.blow_out", 1, 1)
    e.npc.updateClient()
    e.npc.timers.stop(1)
    puffed = false
    e.npc.world.spawnParticle("supplementaries:air_burst", e.npc.x, e.npc.y, e.npc.z, .4, .4, .4, .3, 6)
    dropItem = true
}

function tick(e) {
    if (e.npc.inWater()) {
        e.npc.ai.setNavigationType(2)
    }

    if (!e.npc.inWater()) {
        e.npc.ai.setNavigationType(0)
    }
}

function timer(e) {
    if (e.npc.storeddata.get("hasStatusEffect") == 1) return
    if (e.id == 1) {
        puffed = true
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.puffer_fish.blow_up", 1, 1)
        e.npc.display.setModel("customnpcs:npcslime")
        e.npc.display.setSkinTexture("minecraft:textures/entity/fish/pufferfish.png")
        e.npc.updateClient()
        e.npc.world.spawnParticle("supplementaries:air_burst", e.npc.x, e.npc.y, e.npc.z, .4, .4, .4, 0, 20)
        dropItem = false
        e.npc.timers.forceStart(2, getRandomInt(60, 120), false)
    }
    if (e.id == 2) {
        shrink(e)
        e.npc.timers.forceStart(1, getRandomInt(40, 80), false)
    }
}

function died(e) {
    if (dropItem) {
        var drop = e.npc.world.createItem("minecraft:pufferfish", 1)
        e.npc.dropItem(drop)
    }
    e.npc.timers.stop(2)
    e.npc.timers.stop(1)
}

function meleeAttack(e) {
    if (!puffed) return
    blowUp(e)
}

function damaged(e) {
    if (puffed) blowUp(e)
}

function blowUp(e) {
    puffed = false
    e.npc.display.setVisible(1)
    e.npc.updateClient()
    e.npc.kill()

    var world = e.npc.getWorld()
    world.spawnParticle("supplementaries:air_burst", e.npc.x, e.npc.y, e.npc.z, .2, .2, .2, 1, 100)
    world.playSoundAt(e.npc.pos, "minecraft:entity.puffer_fish.blow_out", 15, 1)
    world.playSoundAt(e.npc.pos, "minecraft:entity.shulker.shoot", 15, 1)
    world.playSoundAt(e.npc.pos, "minecraft:block.shroomlight.break", 15, 1)



    // world.explode(e.projectile.x, e.projectile.y, e.projectile.z, 5, false, false)
    var nearbyNPCs = e.npc.world.getNearbyEntities(e.npc.pos, 4, -1)
    var npcs = []
    for (var i = 0; i < nearbyNPCs.length; i++) {
        if (nearbyNPCs[i].name != "Status NPC") {
            if (nearbyNPCs[i].type == 2) {
                npcs.push(nearbyNPCs[i])
            }
            if (nearbyNPCs[i].type == 7) {
                knockbackEntity(nearbyNPCs[i], e.npc, 1)
            }
            else {
                knockbackEntity(nearbyNPCs[i], e.npc, 2)
            }
        }
    }
    findValidBlocks(e)
}

function knockbackEntity(npc, player, power) {
    var x1 = player.x;
    var z1 = player.z;

    var x2 = npc.x;
    var z2 = npc.z;

    var xdir = x2 - x1;
    var zdir = z2 - z1;
    var angle = Math.atan(xdir / zdir); // x and z distance triangle
    var pi = Math.PI;
    var degrees = (angle * (180 / pi)); // Convert Radians => Degrees
    if (xdir < 0 && zdir > 0) { // Quad I
        degrees = Math.abs(degrees);
    }
    if (xdir < 0 && zdir < 0) { // Quad II
        angle = Math.atan((xdir * -1) / zdir);
        degrees = (angle * (180 / pi)) + 180;
    }
    if (xdir > 0 && zdir < 0) { // Quad III
        angle = Math.atan((xdir * -1) / zdir);
        degrees = (angle * (180 / pi)) + 180;
    }
    if (xdir > 0 && zdir > 0) { // Quad IV
        degrees = 360 - degrees;
    }

    var d = Math.sqrt(Math.pow(xdir, 2) + Math.pow(zdir, 2));
    // Farther distance, more knockback

    npc.setMotionY((Math.random() / 2) + (power / 10))
    npc.knockback(power / 2, degrees);
    //event.player.knockback(-d, degrees); Negative pulls in
}



function findValidBlocks(e) {
    var valid_breakable_blocks = []
    for (var ix = -3; ix < 3; ix++) {
        for (var iy = -3; iy < 3; iy++) {
            for (var iz = -3; iz < 3; iz++) {
                var current_scanned_block = e.npc.world.getBlock(e.npc.x + ix, e.npc.y + iy, e.npc.z + iz)
                if (current_scanned_block.name.indexOf("chest") != -1 || current_scanned_block.name.indexOf("door") != -1) {
                    current_scanned_block.remove()
                }
                if (current_scanned_block.name.indexOf("scripted") != -1) {
                    current_scanned_block.trigger(1, [current_scanned_block])
                }
            }
        }
    }
    return valid_breakable_blocks
}