var api = Java.type('noppes.npcs.api.NpcAPI').Instance();

load(api.getLevelDir() + "/scripts/ecmascript/boiler/id_generator.js");
load(api.getLevelDir() + "/scripts/ecmascript/boiler/commonFunctions.js");
load(api.getLevelDir() + "/scripts/ecmascript/boiler/title_generator.js");
load(api.getLevelDir() + "/scripts/ecmascript/boiler/scoreboard.js");
load(api.getLevelDir() + "/scripts/ecmascript/player/mounts/evergrowBoat.js");
load(api.getLevelDir() + "/scripts/ecmascript/player/mounts/phantom.js");

function init(e) {
    e.player.timers.forceStart(id("handlePhantom"), 40, false)
    registerScoreboardPlayer(e)
}

function timers(e) {
    switch (e.id) {
        case id("handlePhantom"):
            savePhantom(e)
            removePhantom(e, false)
            break;
        case 768201:
            deleteBoat(e, false)
            break;
    }
}

function tick(e) {
    removePhantom(e, false)
    deleteBoat(e, false)
}

function interact(e) {
    if (e.type == 1) {
        checkPhantomInteractions(e)
        if (e.player.getOffhandItem().name.indexOf("shield") != -1 && e.target.type == 2 && e.target.getAttackTarget() == e.player) {
            e.setCanceled(true)
        }
        if (e.target.name.indexOf("Boat") != -1 && (e.target.getRiders().length > 0 && e.target.getRiders()[0].type == 2)) {
            e.setCanceled(true)
            e.player.message("This boat is occupied")
        }
    }
}

function keyPressed(e) {
    var keyBinds = JSON.parse(e.player.storeddata.get("keyBindsJSON"))
    if (e.key != keyBinds.key_summonMount) return
    if (e.openGui) return
    handleMountInput(e)
}

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
                displayTitle(e, "Mount switched to Phantom", "blue")
                break;
            case 1:
                e.player.storeddata.put("currentMount", 0)
                displayTitle(e, "Mount switched to Evergrow Boat", "green")
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