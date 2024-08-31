var state_choose_new_attack = new State("choose_new_attack")

state_choose_new_attack.enter = function (e) {
    var possible_states = ["jump_cascade", "rolling_state", "crush_jumping"]
    StateMachine.transitionToState(getRandomElement(possible_states), e)
}