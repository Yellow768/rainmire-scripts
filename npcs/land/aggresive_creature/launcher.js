//enemy that shoots up projectiles in an arc, when it lands it creates an aoe damage.
var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(API.getLevelDir() + "/scripts/ecmascript/boiler/commonFunctions.js");
load(API.getLevelDir() + "/scripts/ecmascript/boiler/id_generator.js");
load(API.getLevelDir() + "/scripts/ecmascript/boiler/proper_damage.js");
load(API.getLevelDir() + "/scripts/ecmascript/boiler/spawnCircularParticles.js");
//load(API.getLevelDir() + "/scripts/ecmascript/boiler/entity_shoot.js");


var current_target, npc

function init(e) {
    npc = e.npc
}

function damaged(e) {
    e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.enderman.hurt", 1, 1.7)
}


function tick(e) {
    if (e.npc.getAttackTarget() && !e.npc.timers.has(id("launch_projectile")) && e.npc.isAlive()) {
        e.npc.timers.forceStart(id("launch_projectile"), getRandomInt(20, 60), false)
        current_target = e.npc.getAttackTarget()
        e.npc.timers.stop(id("stop_launching_projectiles"))
        e.npc.timers.forceStart(id("switch_retaliate_mode"), getRandomInt(20, 40), false)
    }
}

function targetLost(e) {
    e.npc.timers.forceStart(id("stop_launching_projectiles"), 80, false)
}

function died(e) {
    e.npc.timers.stop(id("launch_projectile"))
    e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.enderman.scream", 1, 1.7)
}

function timer(e) {
    if (e.id == id("launch_projectile")) {
        var projectile = entityShoot({
            x: e.npc.x, y: e.npc.y + 1, z: e.npc.z
        }, {
            speed: .4,
            itemid: "minecraft:orange_dye",
            isArrow: 0,
            canBePickedUp: 0,
            deviation: 1,
            spins: 0,
            size: 15,
            trailenum: 1,
            pitch: -90,
            render3d: 1,
            glows: 1,
            rotation: GetAngleTowardsEntity(e.npc, current_target),
            damage: 0
        })
        try {
            projectile.enableEvents()
        } catch (error) {
        }
        e.npc.world.spawnParticle("falling_honey", e.npc.x, e.npc.y + 2, e.npc.z, .2, .2, .2, 0, 50)
        e.npc.timers.forceStart(id("launch_projectile"), getRandomInt(20, 40), false)
        e.npc.world.playSoundAt(e.npc.pos, "create:fwoomp", 1, .6)
    }
    if (e.id == id("stop_launching_projectiles")) {
        if (!e.npc.getAttackTarget()) {
            e.npc.timers.stop(id("launch_projectile"))
            e.npc.timers.stop(id("switch_retaliate_mode"))
        }
    }
    if (e.id == id("switch_retaliate_mode")) {
        e.npc.timers.forceStart(id("switch_retaliate_mode"), getRandomInt(0, 40), false)
        e.npc.ai.setRetaliateType(getRandomInt(0, 1))
        e.npc.updateClient()
    }
}




/**
 * @param {ProjectileEvent.ImpactEvent} e
 */
function projectileImpact(e) {
    var nE = e.projectile.world.getNearbyEntities(e.projectile.pos, 3, 5)
    for (var i = 0; i < nE.length; i++) {
        if (nE[i] == npc) continue
        nE[i].knockback(3, GetAngleTowardsEntity(e.projectile, nE[i]))
        nE[i].setMotionY(.5)
        nE[i].damage(calculateDamage(3, nE[i], e.projectile))
    }
    spawnCircularParticles(e.projectile.world, "falling_honey", 3, 1, 1, e.projectile.x, e.projectile.y - 1, e.projectile.z)
    spawnCircularParticles(e.projectile.world, "crit", 3, 1, 1, e.projectile.x, e.projectile.y - 1, e.projectile.z)
    spawnCircularParticles(e.projectile.world, "cloud", 1, 1, 1, e.projectile.x, e.projectile.y - 1, e.projectile.z)
    e.projectile.world.playSoundAt(e.projectile.pos, "minecraft:entity.puffer_fish.sting", 1, .6)
    e.projectile.world.playSoundAt(e.projectile.pos, "minecraft:entity.slime.jump", 1, .6)
}