var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/npcs/boiler/base_npc_script.js')



var large_animation = "animation.pufferfish.large"
var small_animation = "animation.pufferfish.small"
var puffer_skin = "minecraft:textures/entity/fish/pufferfish.png"
var empty_skin = "iob:textures/skins/empty.png"

var state_small = new State("state_small")
var state_large = new State("state_large")

StateMachine.default_state = state_small

state_small.enter = function (e) {
    e.npc.getModelData().setWidth(.4)
    e.npc.getModelData().setHeight(.4)
    e.npc.updateClient()
    e.npc.setGeckoIdleAnimation(small_animation)
    e.npc.setGeckoWalkAnimation(small_animation)
    if (npc.getAttackTarget()) {
        npc.timers.start(1, getRandomInt(20, 60), false)
    }
}

state_small.target = function (e) {
    e.npc.timers.forceStart(1, getRandomInt(20, 60), false)
}
state_small.timer = function (e) {
    if (e.id == 1 && e.npc.getAttackTarget()) {
        StateMachine.transitionToState(state_large, e)
    }
}

state_small.died = function (e) {
    var drop = e.npc.world.createItem("minecraft:pufferfish", 1)
    e.npc.dropItem(drop)
}

state_small.exit = function (e) {
    npc.storeddata.put("prev_health", npc.health)
}

state_large.enter = function (e) {
    e.npc.getModelData().setWidth(1)
    e.npc.getModelData().setHeight(1)
    e.npc.updateClient()
    e.npc.setGeckoIdleAnimation(large_animation)
    e.npc.setGeckoWalkAnimation(large_animation)
    e.npc.timers.start(1, getRandomInt(60, 90), false)
    e.npc.setMaxHealth(1)
    e.npc.setHealth(1)
    e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.puffer_fish.blow_up", 1, 1)
    e.npc.world.spawnParticle("supplementaries:air_burst", e.npc.x, e.npc.y, e.npc.z, .4, .4, .4, 0, 20)
}


state_large.timer = function (e) {
    if (e.id == 1) {
        StateMachine.transitionToState(state_small, e)
    }
}

state_large.died = function (e) {
    state_large.explode(e)
}

state_large.meleeAttack = function (e) {
    e.npc.kill()
}

state_large.explode = function (e) {
    e.npc.world.spawnParticle("supplementaries:air_burst", e.npc.x, e.npc.y, e.npc.z, .2, .2, .2, 1, 100)
    e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.puffer_fish.blow_out", 15, 1)
    e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.shulker.shoot", 15, 1)
    e.npc.world.playSoundAt(e.npc.pos, "minecraft:block.shroomlight.break", 15, 1)
    e.npc.display.setSkinTexture(empty_skin)
    e.npc.updateClient()
    var nE = e.npc.world.getNearbyEntities(e.npc.pos, 7, 5)
    for (var i = 0; i < nE.length; i++) {
        DoKnockback(e.npc, nE[i], 5, (e.npc.y - nE[i].y))
    }
    breakBreakableWalls(e)
}

state_large.exit = function (e) {
    if (e.npc.isAlive()) {
        e.npc.setMaxHealth(10)
        e.npc.setHealth(e.npc.storeddata.get("prev_health"))
        e.npc.world.spawnParticle("supplementaries:air_burst", e.npc.x, e.npc.y, e.npc.z, .4, .4, .4, .3, 6)
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.puffer_fish.blow_out", 1, 1)
    }
}



state_dead.exit = function (e) {
    e.npc.display.setSkinTexture(puffer_skin)
    e.npc.updateClient()
    e.npc.setMaxHealth(10)
    e.npc.setHealth(10)
}





function breakBreakableWalls(e) {
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
}



state_panicking.enter = function (e) {
    state_panicking.applyPanickingEffects(e)
    npc.getModelData().setWidth(1)
    npc.getModelData().setHeight(1)
    npc.updateClient()
    npc.setGeckoIdleAnimation(large_animation)
    npc.setGeckoWalkAnimation(large_animation)

}

state_panicking.collide = function (e) {
    e.npc.kill()
}

state_panicking.died = function (e) {
    state_large.explode(e)
}

state_panicking.exit = function (e) {
    state_large.exit(e)
}