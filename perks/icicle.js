function perk_icicle(e, cost) {
    var blockAbovePos = findBlockAbove(e)
    if (blockAbovePos == null) {
        displayTitle(e, "No valid block above you", '#00FFFF')
        playFailure(e)
        return
    }
    if (!attemptToUseHydration(e, cost)) {
        return
    }
    if (e.player.tempdata.has("iciclePos")) {
        breakIcicle(e, e.player.tempdata.get("iciclePos"))
        return
    }
    blockAbovePos = blockAbovePos.down(1)
    e.player.world.setBlock(blockAbovePos, "customnpcs:npcscripted")
    try {
        var nbt = e.player.world.getBlock(blockAbovePos).getBlockEntityNBT()
        var s1 = e.API.stringToNbt('{}');
        s1.putString("Script", "");
        s1.setList("Console", []);
        nbt.setList("Scripts", [s1]);

        var scripts = nbt.getList("Scripts", nbt.getListType("Scripts"))[0];
        var sl = [];
        var requiredScripts = ["blocks/icicle_block.js"]; // scripts from your folder

        for (var i = 0; i < requiredScripts.length; i++) {
            var test = e.API.stringToNbt('{}');
            test.putString('Line', requiredScripts[i]);
            sl.push(test);
        }

        scripts.setList("ScriptList", sl);
        nbt.setByte("ScriptEnabled", 1);

        e.player.world.getBlock(blockAbovePos.getX(), blockAbovePos.getY(), blockAbovePos.getZ()).setTileEntityNBT(nbt);

        // when updated
        var sdata = e.player.world.getBlock(blockAbovePos.getX(), blockAbovePos.getY(), blockAbovePos.getZ()).getStoreddata();
        sdata.put("updated", Date.now());
        e.player.world.getBlock(blockAbovePos.getX(), blockAbovePos.getY(), blockAbovePos.getZ()).setModel("quark:blue_corundum_cluster")
        e.player.world.getBlock(blockAbovePos.getX(), blockAbovePos.getY(), blockAbovePos.getZ()).setIsPassible(true)

        e.player.world.getBlock(blockAbovePos.getX(), blockAbovePos.getY(), blockAbovePos.getZ()).setLight(15)
    }

    catch (er) {
        e.player.message("§cError: §r" + er);
    }


    e.player.tempdata.put("iciclePos", blockAbovePos.down(1))
    e.player.timers.forceStart(ICICLE_TAG_TIMER, 0, true)
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
    var command = "/particle block quark:blue_corundum_cluster " + pos.x + " " + (pos.y + 1) + " " + pos.z + " .2 .2 .2 1 100"
    executeCommand(String(command))
    e.player.tempdata.remove("iciclePos")
}

function icicle_timers(e) { }