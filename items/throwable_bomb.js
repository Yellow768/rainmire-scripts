/*-*/
function playerShoot(e, t) { var r = e.player, a = Number(r.getPitch().toFixed(2)), i = Number(r.getRotation().toFixed(2)); i < 0 ? (i < -360 && (i %= 360), i = 360 + i) : i > 360 && (i %= 360); var o = function (e, t) { t *= Math.PI / 180; var r = Math.cos(t), a = Math.sin(t); return new Array(Math.round(1e4 * (e[0] * r - e[1] * a)) / 1e4, Math.round(1e4 * (e[0] * a + e[1] * r)) / 1e4) }([0, 1], i), n = o[0], d = o[1], s = a = a / 90 * -1, c = 1 - Math.abs(s); s = 0 == t.gravity ? .1 * s : s; var p = .07 * t.speed * n * c, l = .07 * t.speed * d * c, u = '{id:"customnpcs:customnpcprojectile",ownerName:"' + e.player.UUID + '",Pos:[' + e.player.x + "d," + (e.player.y + 1.6) + "d," + e.player.z + "d],PotionEffect:" + t.PotionEffect + ",isArrow:" + t.isArrow + "b,punch:" + t.punch + ",explosiveRadius:" + t.explosiveRadius + ',Item:{id:"' + t.itemid + '",Count:1b,Damage:' + t.itemmeta + "s},damagev2:" + t.power + "f,trailenum:" + t.trailenum + ",Spins:" + t.spins + "b,glows:" + t.glows + "b,accelerate:" + t.accelerate + "b,direction:[" + p + "d," + s + "d," + l + "d],Motion:[" + p + "d," + s + "d," + l + "d],velocity:" + t.speed + ",canBePickedUp:0b,size:" + t.size + ",Sticks:" + t.sticks + "b,gravity:" + t.gravity + "b,effectDuration:" + t.effectDuration + ",Render3D:" + t.render3d + "b}", y = e.player.world.createEntityFromNBT(e.API.stringToNbt(u)); return e.player.world.spawnEntity(y), y }
/*projectile*/
var bomb = { trailenum: 0, PotionEffect: 0, effectDuration: 5, gravity: 1, accelerate: 0, glows: 0, speed: 22, power: 0, size: 18, punch: 0, explosiveRadius: 0, spins: 0, sticks: 1, render3d: 0, isArrow: 0, itemid: "minecraft:pufferfish", itemmeta: 0 }
/*config*/
var explosion = { delay: 0, power: 3, fire: false, grief: false };
var timerID = 769000; /*this and this+1 must be available*/
var item = { id: "minecraft:pufferfish", displayName: "Puff Bomb", consumable: true }
/*code*/
var bombProjectile = []; /*global*/
var primed = []; /*global*/


function summonThrowableBomb(event) {
    var MH = event.player.mainhandItem;
    if (MH && MH.name == item.id && MH.displayName.indexOf("Bomb") != -1) {
        event.setCanceled(true)
        var e = playerShoot(event, bomb);
        event.player.world.playSoundAt(event.player.pos, "customnpcs:misc.swosh", 1, 1)
        e.enableEvents()
        bombProjectile.push(e);
        if (MH.displayName.indexOf("Flammable") != -1) {
            e.addTag("Flammable")
        }
        if (MH.displayName.indexOf("Paralyzing") != -1) {
            e.addTag("Paralyzing")
        }
        if (MH.displayName.indexOf("Panicking") != -1) {
            e.addTag("Panicking")
        }
        if (item.consumable && event.player.gamemode != 1) {
            var newItem = event.player.getMainhandItem()
            newItem.setStackSize(newItem.getStackSize() - 1)
            event.player.setMainhandItem(newItem)
        };

    };
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



function projectileTick(e) {
    if (e.projectile.hasTag("Flammable")) { e.projectile.world.spawnParticle("upgrade_aquatic:red_jelly_flame", e.projectile.x, e.projectile.y, e.projectile.z, .1, .1, .1, .01, 3) }
    if (e.projectile.hasTag("Paralyzing")) { e.projectile.world.spawnParticle("upgrade_aquatic:yellow_jelly_flame", e.projectile.x, e.projectile.y, e.projectile.z, .1, .1, .1, .01, 3) }
    if (e.projectile.hasTag("Panicking")) { e.projectile.world.spawnParticle("upgrade_aquatic:purple_jelly_flame", e.projectile.x, e.projectile.y, e.projectile.z, .1, .1, .1, .01, 3) }
}

function projectileImpact(e) {
    var world = e.projectile.getWorld()
    world.spawnParticle("supplementaries:air_burst", e.projectile.x, e.projectile.y, e.projectile.z, .2, .2, .2, 1, 100)
    world.playSoundAt(e.projectile.pos, "minecraft:entity.puffer_fish.blow_out", 15, 1)
    world.playSoundAt(e.projectile.pos, "minecraft:entity.shulker.shoot", 15, 1)
    world.playSoundAt(e.projectile.pos, "minecraft:block.shroomlight.break", 15, 1)



    // world.explode(e.projectile.x, e.projectile.y, e.projectile.z, 5, false, false)
    var nearbyNPCs = world.getNearbyEntities(e.projectile.pos, 4, -1)
    var npcs = []
    for (var i = 0; i < nearbyNPCs.length; i++) {
        if (nearbyNPCs[i].name != "Status NPC") {
            if (nearbyNPCs[i].type == 2) {
                npcs.push(nearbyNPCs[i])
            }
            if (nearbyNPCs[i].type == 7) {
                knockbackEntity(nearbyNPCs[i], e.projectile, 1)
            }
            else {
                knockbackEntity(nearbyNPCs[i], e.projectile, 4)
            }
        }
    }
    var jellied = false
    if (e.projectile.hasTag("Flammable")) {
        executeCommand("/particle upgrade_aquatic:red_jelly_blob " + e.projectile.x + " " + e.projectile.y + " " + e.projectile.z + " 1 2 1 .5 100")
        for (var i = 0; i < npcs.length; i++) {
            applyStatusEffect(e, npcs[i], 3)

        }
        jellied = true

    }
    if (e.projectile.hasTag("Paralyzing")) {
        executeCommand("/particle upgrade_aquatic:yellow_jelly_blob " + e.projectile.x + " " + e.projectile.y + " " + e.projectile.z + " 1 2 1 .5 100")
        for (var i = 0; i < npcs.length; i++) {
            applyStatusEffect(e, npcs[i], 1)
        }
        jellied = true
    }
    if (e.projectile.hasTag("Panicking")) {
        executeCommand("/particle upgrade_aquatic:purple_jelly_blob " + e.projectile.x + " " + e.projectile.y + " " + e.projectile.z + " 1 2 1 .5 100")
        for (var i = 0; i < npcs.length; i++) {

            applyStatusEffect(e, npcs[i], 2)
        }
        jellied = true
    }
    if (jellied) {
        world.playSoundAt(e.projectile.pos, "upgrade_aquatic:entity.jellyfish.death", 3, 1)
        world.playSoundAt(e.projectile.pos, "minecraft:entity.turtle.egg_break", 3, 1)
    }

    var valid_breakable_blocks = findValidBlocks(e)
    //destroyBlocksInView(e, valid_breakable_blocks)
}


function findValidBlocks(e) {
    var valid_breakable_blocks = []
    for (var ix = -3; ix < 3; ix++) {
        for (var iy = -3; iy < 3; iy++) {
            for (var iz = -3; iz < 3; iz++) {
                var current_scanned_block = e.projectile.world.getBlock(e.projectile.x + ix, e.projectile.y + iy, e.projectile.z + iz)
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


function destroyBlocksInView(e, valid_breakable_blocks) {
    for (var ray_i = 0; ray_i < valid_breakable_blocks.length; ray_i++) {
        var curr_block = valid_breakable_blocks[ray_i]
        var checker = e.API.clones.spawn(curr_block.x, curr_block.y, curr_block.z, 1, "Explosion Checker", e.projectile.world)
        checker.display.setVisible(1)
        checker.display.setHitboxState(1)
        checker.reset()

        if (checker.canSeeEntity(e.projectile)) {
            e.API.executeCommand(e.projectile.world, "/particle minecraft:block " + curr_block.name + " " + curr_block.x + " " + curr_block.y + " " + curr_block.z + " .5 1 .5 1 150")
            curr_block.remove()
        }
        checker.kill()
    }
}