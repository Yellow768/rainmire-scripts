var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/npcs/boiler/fsm.js')
load(api.getLevelDir() + '/scripts/ecmascript/boiler/commonFunctions.js')

//The purpose of this script is to give every NPC the ability to respond to status effects.

var npc
var state_idle = new State("state_idle")
var state_paralyzed = new State("state_paralyzed")
var state_panicking = new State("state_panicking")

StateMachine.default_state = state_idle

StateMachine.addState(state_idle)
StateMachine.addState(state_paralyzed)
StateMachine.addState(state_panicking)


state_paralyzed.enter = function (e) {
    npc.timers.forceStart(1, e.arguments[0], false)
    npc.display.setHitboxState(2)
    npc.ai.setWalkingSpeed(0)
    npc.ai.setRetaliateType(3)
    npc.getDisplay().setTint(0xffff00)
}

state_paralyzed.exit = function (e) {
    var default_settings = JSON.parse(e.npc.storedata.get("default_settings"))
    e.npc.display.setTint(default_settings.Tint)
    e.npc.ai.setRetaliateType(default_settings.Retaliate)
    e.npc.ai.setNavigationType(default_settings.Navigation)
    e.npc.display.setHitboxState(default_settings.Hitbox)
    e.npc.ai.setWalkingSpeed(default_settings.Speed)
}

state_paralyzed.timer = function (e) {
    if (e.id == 1) {
        StateMachine.transitionToState(StateMachine.default_state, e)
    }

}


state_panicking.enter = function (e) {
    npc.timers.forceStart(1, e.arguments[0], false)
    npc.timers.forceStart(2, getRandomInt(20, 90), false)
    npc.ai.setRetaliateType(1)
    npc.getDisplay().setTint(0xff55ff)

}

state_panicking.exit = function (e) {
    var default_settings = JSON.parse(e.npc.storedata.get("default_settings"))
    e.npc.display.setTint(default_settings.Tint)
    e.npc.ai.setRetaliateType(default_settings.Retaliate)
    e.npc.timers.stop(2)
}

state_panicking.timer = function (e) {
    if (e.id == 1) {
        StateMachine.transitionToState(StateMachine.default_state, e)
    }
    if (e.id == 2) {
        switch (e.npc.ai.getRetaliateType()) {

            case 1:
                e.npc.ai.setRetaliateType(0)
                var nE = e.npc.world.getNearbyEntities(e.npc.pos, 5, e.npc.stats.getAggroRange())
                var newTarget = getRandomElement(nE)
                e.npc.setAttackTarget(newTarget)
                break;
            case 0:
                e.npc.ai.setRetaliateType(1)
                break;
        }
        e.npc.timers.forceStart(2, getRandomInt(90, 200), false)
    }
}

function init(e) {

    npc = e.npc
    if (!e.npc.storeddata.has("current_state")) {
        StateMachine.setState(StateMachine.default_state)
        e.npc.storeddata.put("current_state", StateMachine.default_state.name)
    }
    else {
        for (var i = 0; i < StateMachine.states; i++) {
            if (StateMachine.states[i] == e.npc.storeddata.get("current_state")) {
                StateMachine.setState(StateMachine.states[i])
            }
        }
    }
    if (!e.npc.storeddata.has("default_settings")) {
        saveDefaultSettings()
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
    if (e.id == 123401) {
        StateMachin.transitionToState(state_paralyzed, e)
    }
    if (e.id == 123402) {
        StateMachine.transitionToState(state_panicking, e)
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