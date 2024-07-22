
function init(e) {
    e.block.setIsLadder(true)
    e.block.setIsPassible(true)
    e.block.setModel("chain")
}

var chain_noise = true

function collide(e) {
    if (chain_noise) {
        e.block.world.playSoundAt(e.entity.pos, "block.chain.place", 1, 1)
        chain_noise = false
        e.block.timers.forceStart(1, 60, false)
    }


}

function timer(e) {
    chain_noise = true
}
