var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/npcs/boiler/fsm.js')
load(api.getLevelDir() + '/scripts/ecmascript/boiler/commonFunctions.js')

//The purpose of this script is to give every NPC the ability to respond to status effects.

var npc
var state_idle = new State("state_idle")
var state_dead = new State("state_dead")

StateMachine.default_state = state_idle



var state_paralyzed = new State("state_paralyzed")

state_paralyzed.enter = function (e) {
    state_paralyzed.applyParalyzedEffects(e)
}

state_paralyzed.applyParalyzedEffects = function (e) {

    npc.world.playSoundAt(npc.pos, "upgrade_aquatic:entity.jellyfish.death", 1, 1)
    npc.world.playSoundAt(npc.pos, "minecraft:entity.turtle.egg_break", 1, 1)
    npc.executeCommand("/particle upgrade_aquatic:yellow_jelly_blob ~ ~1 ~ .5 .5 .5 .02 30 force")
    npc.timers.forceStart(1, e.arguments[1], false)
    npc.display.setHitboxState(2)
    npc.ai.setWalkingSpeed(0)
    npc.ai.setRetaliateType(3)
    npc.getDisplay().setTint(0xffff00)
    npc.updateClient()
}

state_paralyzed.timer = function (e) {
    state_paralyzed.defaultParalyzedTimer(e)
}

state_paralyzed.defaultParalyzedTimer = function (e) {
    if (e.id == 768001) {
        StateMachine.transitionToState(StateMachine.default_state, e)
    }

}

state_paralyzed.revertToDefault = function (e) {
    var default_settings = JSON.parse(npc.storeddata.get("default_settings"))
    npc.display.setTint(default_settings.Tint)
    npc.ai.setRetaliateType(default_settings.Retaliate)
    npc.ai.setNavigationType(default_settings.Navigation)
    npc.display.setHitboxState(default_settings.Hitbox)
    npc.ai.setWalkingSpeed(default_settings.Speed)
    npc.updateClient()
}

state_paralyzed.exit = function (e) {
    state_paralyzed.revertToDefault()
}


var state_panicking = new State("state_panicking")

state_panicking.enter = function (e) {
    state_panicking.applyPanickingEffects(e)
}

state_panicking.applyPanickingEffects = function (e) {

    npc.world.playSoundAt(npc.pos, "upgrade_aquatic:entity.jellyfish.death", 1, 1)
    npc.world.playSoundAt(npc.pos, "minecraft:entity.turtle.egg_break", 1, 1)

    npc.executeCommand("/particle upgrade_aquatic:purple_jelly_blob ~ ~1 ~ .5 .5 .5 .02 30 force")
    npc.timers.forceStart(768001, e.arguments[1], false)
    npc.timers.forceStart(768002, getRandomInt(90, 120), false)
    npc.timers.forceStart(768003, getRandomInt(20, 40), false)
    state_panicking.chooseNewTarget()
    npc.ai.setRetaliateType(1)
    npc.getDisplay().setTint(0xff55ff)
    npc.updateClient()
}

state_panicking.timer = function (e) {
    state_panicking.defaultPanickingTimer(e)
}

state_panicking.defaultPanickingTimer = function (e) {
    if (e.id == 768001) {
        StateMachine.transitionToState(StateMachine.default_state, e)
    }
    if (e.id == 76002) {
        switch (e.npc.ai.getRetaliateType()) {

            case 1:
                state_panicking.chooseNewTarget()
                e.npc.ai.setRetaliateType(0)
                break;
            case 0:
                e.npc.ai.setRetaliateType(1)
                break;
        }
        e.npc.timers.forceStart(768002, getRandomInt(90, 200), false)
    }
    if (e.id == 768003) {
        e.npc.jump()
        e.npc.timers.start(768003, getRandomInt(20, 40), false)
    }
}

state_panicking.chooseNewTarget = function () {
    var nE = npc.world.getNearbyEntities(npc.pos, npc.stats.getAggroRange(), 5)
    var newTarget = getRandomElement(nE)
    npc.setAttackTarget(newTarget)
}

state_panicking.revertToDefault = function () {

    var default_settings = JSON.parse(npc.storeddata.get("default_settings"))
    npc.display.setTint(default_settings.Tint)
    npc.ai.setRetaliateType(default_settings.Retaliate)
    npc.timers.stop(768002)
    npc.updateClient()
}
state_panicking.exit = function (e) {
    state_panicking.revertToDefault()
}

StateMachine.addState(state_idle)
StateMachine.addState(state_paralyzed)
StateMachine.addState(state_panicking)
StateMachine.addState(state_dead)
function init(e) {
    npc = e.npc
    if (!e.npc.storeddata.has("current_state")) {
        StateMachine.setState(StateMachine.default_state)
        e.npc.storeddata.put("current_state", StateMachine.default_state.name)
    }
    else {
        for (var i = 0; i < StateMachine.states.length; i++) {

            if (StateMachine.states[i].name == e.npc.storeddata.get("current_state")) {
                StateMachine.setState(StateMachine.states[i])
            }
        }
    }
    if (StateMachine.current_state.init != undefined) StateMachine.current_state.init(e)
}

function timer(e) {
    if (StateMachine.current_state.timer != undefined) StateMachine.current_state.timer(e)
}

function target(e) {
    if (StateMachine.current_state.target != undefined) StateMachine.current_state.target(e)
}

function targetLost(e) {
    if (StateMachine.current_state.targetLost != undefined) StateMachine.current_state.targetLost(e)
}

function damaged(e) {
    if (StateMachine.current_state.damaged != undefined) StateMachine.current_state.damaged(e)
}

function collide(e) {
    if (StateMachine.current_state.collide != undefined) StateMachine.current_state.collide(e)
}


function died(e) {
    StateMachine.transitionToState(state_dead, e)
}

function trigger(e) {
    if (!npc.storeddata.has("default_settings")) {
        saveDefaultSettings()
    }
    if (e.id == 123401) {
        StateMachine.transitionToState(state_paralyzed, e)
    }
    if (e.id == 123402) {
        StateMachine.transitionToState(state_panicking, e)
    }
    if (e.id == 123403) {
        npc.setBurning(e.arguments[1])
        npc.executeCommand("/particle upgrade_aquatic:red_jelly_blob ~ ~1 ~ .5 .5 .5 .02 30 force")
    }
}


function saveDefaultSettings() {
    var default_settings = {
        Tint: npc.display.tint,
        Retaliate: npc.ai.getRetaliateType(),
        Navigation: npc.ai.getNavigationType(),
        Speed: npc.ai.getWalkingSpeed(),
        Hitbox: npc.display.getHitboxState()
    }
    npc.storeddata.put("default_settings", JSON.stringify(default_settings))
}
/*
How should Jellies work.
There should be more restrictionis on them, both to make it easier to code but also to make their interactions make a little more sense.

Paralyzing and Panicking jelly are mutually exclusive. Applying one will cancel the other if it is active.

The duration of the effect is based off of Mind maybe?

Jellies should only give 1 strike, but applying multiple will stack it if the player wishes too.

Instead of having two hold two things in your hands, maybe just right click the jelly, and then it puts you into "jelly applying mode"

and the next item you right click gets the jelly applied.

*/