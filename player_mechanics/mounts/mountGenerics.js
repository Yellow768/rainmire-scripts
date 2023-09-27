function handleMountInput(e) {
    if (!e.player.storeddata.has("currentMount")) {
        e.player.storeddata.put("currentMount", 0)
    }
    switch (e.isShiftPressed) {
        case true:
            switchMount(e)
            break;
        case false:
            summonMount(e)
            break;
    }

}

function switchMount(e) {
    if (getScore("soulBoundHorse")) {
        switch (e.player.storeddata.get("currentMount")) {
            case 0:
                e.player.storeddata.put("currentMount", 1)
                title(e, "Mount switched to Phantom", "blue")
                break;
            case 1:
                e.player.storeddata.put("currentMount", 0)
                title(e, "Mount switched to Evergrow Boat", "green")
                break;
        }
    }
}

function summonMount(e) {

    switch (e.player.storeddata.get("currentMount")) {
        case 0:
            toggleEvergrowBoat(e)
            break;
        case 1:
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
