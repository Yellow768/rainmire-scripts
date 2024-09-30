function redstone(e) {
    if (e.power != 0) {
        e.block.timers.start(1, 60, false)
    }
}


function timer(e) {
    var nP = e.block.world.getNearbyEntities(e.block.pos, 32, 1)
    for (var i = 0; i < nP.length; i++) {
        nP[i].finishQuest(12)
        if (nP[i].hasActiveQuest(12)) {
            nP[i].stopQuest(12)
        }
        if (!nP[i].hasActiveQuest(13) && !nP[i].hasFinishedQuest(13)) {
            nP[i].startQuest(13)
            nP[i].message("&b[Mind] - The pipe opened, but no water came out... should see what's going on.")
        }
    }

}