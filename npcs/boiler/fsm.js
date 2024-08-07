function State(name) {
    this.name = name
    this.enter = function (e) { }
    this.exit = function (e) { }
}


var StateMachine = {
    states: {},
    current_state: "",
    setState: function (state) {
        StateMachine.current_state = StateMachine.states[state]
    },
    transitionToState: function (from, to, e) {
        StateMachine.current_state = StateMachine.states[to]
        StateMachine.states[from].exit(e)
        StateMachine.states[to].enter(e)

    },
    addState: function (state) {
        StateMachine.states[state.name] = state
    }

}