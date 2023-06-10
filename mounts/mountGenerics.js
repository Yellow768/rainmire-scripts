function summonMount(e) {
    switch (e.player.inWater()) {
        case true:
            toggleEvergrowBoat(e)
            break;
        case false:
            togglePhantom(e)
            break;
    }
}

function logout(e) {
    removePhantom(e, false)
    removePhantom(e, true)
    deleteBoat(e, false)
    deleteBoat(e, true)
}
