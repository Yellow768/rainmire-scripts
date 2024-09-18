var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/npcs/boiler/base_npc_script.js')


var state_normal = new State("state_normal")
var state_growing = new State("state_growing")

StateMachine.default_state = state_normal


state_normal.init = function (e) {
    e.npc.timers.forceStart(2, 1, true)
    e.npc.timers.forceStart(3, 1, true)
}

state_normal.enter = function (e) {
    npc.ai.setWalkingSpeed(5)
    npc.ai.setRetaliateType(0)
    e.npc.timers.forceStart(2, 1, true)
    e.npc.timers.forceStart(3, 1, true)
    if (e.npc.getAttackTarget()) {
        e.npc.timers.forceStart(4, getRandomInt(120, 200), false)
    }
}

state_normal.target = function (e) {
    e.npc.timers.forceStart(1, getRandomInt(60, 90), false)
    e.npc.timers.forceStart(4, getRandomInt(120, 200), false)
    e.npc.timers.forceStart(5, getRandomInt(20, 40), false)
}

state_normal.timer = function (e) {
    if (e.id == 1) {
        switch (e.npc.ai.getRetaliateType()) {
            case 0:
                e.npc.ai.setRetaliateType(1)
                e.npc.setMoveStrafing(0)
                e.npc.setMoveForward(0)
                e.npc.timers.stop(5)
                break;
            case 1:
                e.npc.ai.setRetaliateType(0)
                e.npc.timers.forceStart(5, getRandomInt(20, 40), false)
                break;
        }
        e.npc.timers.forceStart(1, getRandomInt(60, 90), false)
    }
    if (e.id == 2) {
        createSlime(e)
    }
    if (e.id == 3) {
        visualSlugEffects(e)
    }
    if (e.id == 4) {
        StateMachine.transitionToState(state_growing, e)
    }
    if (e.id == 5) {
        e.npc.setMoveStrafing(getRandomElement([-0.2, 0, .2]))
        if (e.npc.getMoveStrafing() != 0) {
            e.npc.setMoveForward(-.5)
        }
        e.npc.timers.forceStart(5, getRandomInt(20, 40), false)
    }
}
function createSlime(e) {
    e.npc.executeCommand('/summon area_effect_cloud ' + npc.x + ' ' + (npc.y) + ' ' + npc.z + ' {Particle:"dust ' + color_rgb[0] + ' ' + color_rgb[1] + ' ' + color_rgb[2] + ' ' + color_rgb[3] + '",Radius:1,Duration:100,Effects:[{Id:' + effect_id + ',Duration:20,Amplifier:4,ShowParticles:0b}]}')
}

state_normal.exit = function (e) {
    npc.timers.stop(1)
    npc.timers.stop(2)
    npc.timers.stop(3)
    npc.timers.stop(5)
    npc.setMoveStrafing(0)
}

state_growing.enter = function (e) {
    e.npc.ai.setWalkingSpeed(0)
    e.npc.ai.setRetaliateType(3)
    e.npc.timers.forceStart(1, 20, false)
    e.npc.timers.forceStart(4, 60, false)
    e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.silverfish.death", 1, .5)
    e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.spider.death", 1, .2)
    e.npc.executeCommand("/particle supplementaries:air_burst ~ ~ ~ .5 .5 .5 0 10 force")
}

state_growing.timer = function (e) {
    if (e.id == 1) {
        //initial growth
        e.npc.display.setSize(e.npc.display.getSize() + 2)
        e.npc.updateClient()
        e.npc.timers.forceStart(2, 2, false)
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.puffer_fish.blow_out", 1, .5)
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:item.honey_bottle.drink", 1, .5)
    }
    if (e.id == 2) {
        //shrink for effect
        e.npc.display.setSize(e.npc.display.getSize() - 3)
        e.npc.updateClient()
        e.npc.timers.forceStart(3, 2, false)
    }
    if (e.id == 3) {
        //go back to new size
        e.npc.display.setSize(e.npc.display.getSize() + 3)
        e.npc.updateClient()
        e.npc.timers.forceStart(1, 15, false)
    }
    if (e.id == 4) {
        //end the growth animation
        state_growing.release(e)
        StateMachine.transitionToState(state_normal, e)
    }
}

state_growing.release = function (e) {
    e.npc.display.setSize(5)
    e.npc.updateClient()
    e.npc.executeCommand('/summon area_effect_cloud ' + npc.x + ' ' + (npc.y) + ' ' + npc.z + ' {Particle:"dust ' + color_rgb[0] + ' ' + color_rgb[1] + ' ' + color_rgb[2] + ' ' + color_rgb[3] + '",Radius:5,Duration:100,Effects:[{Id:' + effect_id + ',Duration:20,Amplifier:4,ShowParticles:0b}]}')
    e.npc.world.spawnParticle("upgrade_aquatic:" + color_name + "_jelly_blob", npc.x + .5, npc.y, npc.z + .5, 3, .1, 3, 0, 40)
    e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.puffer_fish.sting", 1, .8)
    e.npc.world.playSoundAt(e.npc.pos, "minecraft:block.honey_block.fall", 1, .8)
    e.npc.world.spawnParticle("upgrade_aquatic:" + color_name + "_jelly_blob", npc.x + .5, npc.y, npc.z + .5, .2, .1, .2, .6, 100)
    e.npc.world.spawnParticle("cloud", npc.x + .5, npc.y, npc.z + .5, 3, .1, 3, 0, 4)
    var nE = e.npc.world.getNearbyEntities(e.npc.pos, 4, 5)
    for (var i = 0; i < nE.length; i++) {
        DoKnockback(e.npc, nE[i], 1, .3)
    }
}

state_growing.exit = function (e) {
    npc.timers.stop(1)
    npc.timers.stop(2)
    npc.timers.stop(3)
    npc.timers.stop(4)
}

state_panicking.enter = function (e) {
    state_panicking.applyPanickingEffects(e)
    npc.timers.forceStart(30, 2, true)
}

state_panicking.timer = function (e) {
    state_panicking.defaultPanickingTimer(e)
    if (e.id == 30) {
        createSlime(e)
    }
}
