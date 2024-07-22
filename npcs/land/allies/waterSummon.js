var player

function init(e) {
    e.npc.timers.forceStart(1, 300, false)
}

function timer(e) {
    e.npc.damage(100)
}

function trigger(e) {
    if (e.id == 1) {
        player = e.arguments[0]
    }
}

function tick(e) {
    e.npc.world.spawnParticle("minecraft:falling_water", e.npc.x, e.npc.y, e.npc.z, .2, .5, .2, .1, 10)

    if (e.npc.inWater()) {
        e.npc.damage(100)
        e.npc.display.setSize(1)
    }
}

function damaged(e) {
    e.npc.world.spawnParticle("minecraft:falling_water", e.npc.x, e.npc.y, e.npc.z, .2, .5, .2, .1, 100)
}

function died(e) {
    e.npc.world.spawnParticle("minecraft:falling_water", e.npc.x, e.npc.y, e.npc.z, .2, .5, .2, .1, 1000)
    player.trigger(20, [e.npc])
}


function meleeAttack(e) {
    e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.player.splash", 1, 1)
    e.npc.world.spawnParticle("minecraft:falling_water", e.target.x, e.target.y, e.target.z, .2, .5, .2, .1, 100)
    e.npc.say(e.npc.storeddata.has("panicked"))
    if (e.npc.storeddata.has("panicked")) {
        applyStatusEffect(e, e.target, 2)
    }
    if (e.npc.storeddata.has("paralyzed")) {
        applyStatusEffect(e, e.target, 1)
    }
}

function rangedLaunched(e) {
    e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.player.splash", 1, 1)
    e.npc.world.spawnParticle("minecraft:falling_water", e.target.x, e.target.y, e.target.z, .2, .5, .2, .1, 100)
    e.npc.say(e.npc.storeddata.has("panicked"))
    if (e.npc.storeddata.has("panicked")) {
        applyStatusEffect(e, e.target, 2)
    }
    if (e.npc.storeddata.has("paralyzed")) {
        applyStatusEffect(e, e.target, 1)
    }
}


function applyStatusEffect(e, target, type) {
    var statusNPC
    if (target.storeddata.get("hasStatusEffect") == 1) {
        var nE = e.npc.world.getNearbyEntities(player.pos, 100, 2)
        for (var i = 0; i < nE.length; i++) {
            if (nE[i].storeddata.get("uuid") == target.getUUID()) {
                statusNPC = nE[i]
            }
        }
    }
    else {
        statusNPC = e.API.clones.spawn(target.x, target.y, target.z, 9, "Status NPC", target.world)
    }

    statusNPC.trigger(type, [target])
}