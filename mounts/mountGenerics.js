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
