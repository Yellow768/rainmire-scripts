var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/boiler/commonFunctions.js')
load(api.getLevelDir() + '/scripts/ecmascript/npcs/boiler/fsm.js')
load(api.getLevelDir() + '/scripts/ecmascript/npcs/bosses/shilo_fish/states/idle_state.js')
load(api.getLevelDir() + '/scripts/ecmascript/npcs/bosses/shilo_fish/states/shooting_target_state.js')
load(api.getLevelDir() + '/scripts/ecmascript/npcs/bosses/shilo_fish/states/choose_new_attack.js')
load(api.getLevelDir() + '/scripts/ecmascript/npcs/bosses/shilo_fish/states/rolling_state.js')
load(api.getLevelDir() + '/scripts/ecmascript/npcs/bosses/shilo_fish/states/crush_jumping.js')
load(api.getLevelDir() + '/scripts/ecmascript/npcs/bosses/shilo_fish/states/jump_cascade.js')



var player, npc


var state_dead = new State("state_dead")

state_dead.enter = function (e) {
    e.npc.timers.stop(1)
    e.npc.timers.stop(2)
    e.npc.timers.stop(3)
    e.npc.timers.stop(4)
    e.npc.timers.stop(5)
    e.npc.timers.stop(6)
    attackTarget = null
}

StateMachine.addState(state_idle)
StateMachine.addState(state_shooting_target)
StateMachine.addState(state_rolling)
StateMachine.addState(state_choose_new_attack)
StateMachine.addState(state_crush_jumping)
StateMachine.addState(state_jump_cascade)
StateMachine.addState(state_dead)
StateMachine.setState("idle")


function init(e) {
    npc = e.npc
    if (StateMachine.current_state.init != undefined) StateMachine.current_state.init(e)
}

function timer(e) {
    if (StateMachine.current_state.timer != undefined) StateMachine.current_state.timer(e)
}

function target(e) {
    e.setCanceled(true)
    if (StateMachine.current_state.target != undefined) StateMachine.current_state.target(e)
}

function targetLost(e) {
    if (StateMachine.current_state.targetLost != undefined) StateMachine.current_state.targetLost(e)
}

function damaged(e) {
    if (e.source && e.source.name == "Falling Stone") {
        e.setCanceled(true)
    }
    if (StateMachine.current_state.damaged != undefined) StateMachine.current_state.damaged(e)
}

function collide(e) {
    if (StateMachine.current_state.collide != undefined) StateMachine.current_state.collide(e)
    //e.entity.damage(5)
}


function died(e) {
    StateMachine.transitionToState(StateMachine.current_state.name, "state_dead")
}

