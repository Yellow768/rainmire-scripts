var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/npcs/boiler/base_npc_script.js')


var state_normal = new State("state_normal")
var state_growing = new State("state_growing")

state_normal.init = function (e) {
    e.npc.timers.forceStart(2, 1, true)
}

state_normal.enter = function (e) {
    npc.ai.setWalkingSpeed(5)
    npc.ai.setRetaliateType(0)
}

state_normal.target = function (e) {
    e.npc.timers.start(1, getRandomInt(60, 90), false)
    e.npc.timers.start(2, getRandomInt(120, 200), false)
}

state_normal.timer = function (e) {
    if (e.id == 1) {
        switch (e.npc.ai.getRetaliateType()) {
            case 0:
                e.npc.ai.setRetaliateType(1)
                break;
            case 1:
                e.npc.ai.setRetaliateType(0)
                break;
        }
        e.npc.timers.forceStart(1, getRandomInt(60, 90), false)
    }
    if (e.id == 2) {

    }
    if (e.id == 3) {
        StateMachine.transitionToState(state_growing, e)
    }
}

state_normal.exit = function (e) {
    e.npc.timers.stop(1)
    e.npc.timers.stop(2)
}

state_growing.enter = function (e) {
    e.npc.ai.setWalkingSpeed(0)
    e.npc.ai.setRetaliateType(3)
    e.npc.timer.forceStart(1, 20, false)
    e.npc.timer.forceStart(4, 100, false)
}

state_growing.timer = function (e) {
    if (e.id == 1) {
        e.npc.display.setSize(e.npc.getSize() + 2)
        e.npc.timers.start(2, 10, false)
    }
    if (e.id == 2) {
        e.npc.display.setSize(e.npc.getSize() - 1)
        e.npc.timers.start(3, 10, false)
    }
    if (e.id == 3) {
        e.npc.display.setSize(e.npc.getSize() + 1)
        e.npc.timers.start(1, 30, false)
    }
    if (e.id == 4) {
        StateMachine.transitionToState(state_normal, e)
    }
}

state_growing.release = function (e) {

}

state_growing.exit = function (e) {
    e.npc.timers.stop(1)
    e.npc.timers.stop(2)
    e.npc.timers.stop(3)
    e.npc.timers.stop(4)
}