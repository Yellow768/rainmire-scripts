function State(name) {
    this.name = name
    this.enter = function (e) { }
    this.exit = function (e) { }
}


var StateMachine = {
    states: [],
    current_state: undefined,
    default_state: undefined,
    setState: function (state) {
        StateMachine.current_state = state
    },
    transitionToState: function (to, e) {
        StateMachine.current_state.exit(e)
        StateMachine.current_state = to
        to.enter(e)

    },
    addState: function (state) {
        StateMachine.states.push(state)
    }

}