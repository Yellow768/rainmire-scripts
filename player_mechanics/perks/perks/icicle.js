function perk_icicle(e, cost) {
    var blockAbovePos = findBlockAbove(e)
    if (blockAbovePos == null) {
        title(e, "No valid block above you", '#00FFFF')
        playFailure(e)
        return
    }
    if (!attemptToUsePerkPower(e, cost)) {
        return
    }
    blockAbovePos = blockAbovePos.down(1)
    e.player.world.setBlock(blockAbovePos, "quark:blue_corundum_cluster")

    if (e.player.tempdata.has("iciclePos")) {
        breakIcicle(e, e.player.tempdata.get("iciclePos"))
    }
    e.player.tempdata.put("iciclePos", blockAbovePos.down(1))
    e.player.timers.forceStart(ICICLE_TAG_TIMER, 1, true)
    e.player.timers.forceStart(ICICLE_TAG_TIMER + 2, 60, false)
    e.player.setMotionX(0)
    e.player.setMotionY(0)
    e.player.setMotionY(100)
    var command = "/particle minecraft:dust .2 .7 1 1 " + blockAbovePos.x + " " + blockAbovePos.y + " " + blockAbovePos.z + " .4 .4 .4 .01 10"
    executeCommand(String(command))
    e.player.world.playSoundAt(blockAbovePos, "minecraft:entity.snow_golem.death", 1, 1)
    e.player.world.playSoundAt(blockAbovePos, "minecraft:block.glass.break", 1, .01)

}

function findBlockAbove(e) {
    for (var i = 0; i < getScore("Deftness") * 4; i++) {
        var pos = e.player.pos.up(i + 1)
        var name = e.player.world.getBlock(pos).name
        if (name != "minecraft:air" && name != "minecraft:water" && name != "quark:blue_corundum_cluster" && name.indexOf("ladder") == -1) {
            return pos
        }
    }
    return null
}

function breakIcicle(e, pos) {
    e.player.removeTag("onIcicle")
    e.player.world.setBlock(pos.up(1), "air")
    e.player.world.playSoundAt(pos, "minecraft:block.glass.break", 1, 1)
    var command = "/particle block quark:blue_corundum_cluster " + pos.x + " " + pos.y + " " + pos.z + " .2 .2 .2 1 100"
    executeCommand(String(command))
    e.player.tempdata.remove("iciclePos")
}