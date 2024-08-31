var state_idle = new State("idle")

state_idle.init = function (e) {
    e.npc.timers.stop(1)
    e.npc.timers.stop(2)
    e.npc.timers.stop(3)
}

state_idle.target = function (e) {
    StateMachine.transitionToState("shooting_target", e)
}


