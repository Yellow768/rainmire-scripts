function init(e) {
    e.block.timers.forceStart(1, 0, true)
    e.block.setModel("supplementaries:daub_frame")
    if (!e.block.world.getBlock(e.block.pos.down(1)).isAir() && e.block.storeddata.has("falling")) {
        e.block.world.playSoundAt(e.block.pos, "minecraft:block.gravel.fall", 1, 1)
        e.block.executeCommand("/particle minecraft:block supplementaries:daub_frame " + e.block.x + " " + (e.block.y + .2) + " " + e.block.z + " .6 .1 .6 .2 60")
        e.block.storeddata.remove("falling")
        if (e.block.world.getBlock(e.block.pos.down(1)).name.indexOf("water") != -1) {
            e.block.world.playSoundAt(e.block.pos, "minecraft:entity.player.splash", 1, getRandomFloat(.8, 1.2))
            e.block.world.spawnParticle("splash", e.block.x, e.block.y, e.block.z, .5, .5, .5, 1, 100)
        }
    }


}

function timer(e) {
    if (e.block.world.getBlock(e.block.pos.down(1)).isAir()) {
        moveBlock(e, 1, -1)
        e.block.world.playSoundAt(e.block.pos, "customnpcs:misc.swosh", .6, getRandomFloat(.1, .2))
        e.block.executeCommand("/particle cloud " + e.block.x + " " + e.block.y + " " + e.block.z + " .3 .1 .3 0 3")
    }
    if (e.block.world.getBlock(e.block.pos.down(1)).name.indexOf("water") != -1 && !e.block.storeddata.has("floating")) {
        moveBlock(e, 1, -1)
        e.block.world.playSoundAt(e.block.pos, "customnpcs:misc.swosh", .6, getRandomFloat(.1, .2))
        e.block.executeCommand("/particle cloud " + e.block.x + " " + e.block.y + " " + e.block.z + " .3 .1 .3 0 3")
    }
}

function interact(e) {
    if (e.side == 1 || e.side == 0) { return }
    var direction = -1
    if (e.player.isSneaking()) { direction = 1 }
    if (e.block.world.getBlock(e.block.pos.offset(e.side, direction)).isAir()) {
        moveBlock(e, e.side, direction)
        e.block.world.playSoundAt(e.block.pos, "supplementaries:block.sack.open", .7, getRandomFloat(.6, 1.2))
        var particle_pos = e.block.pos
        e.block.executeCommand("/particle minecraft:block supplementaries:daub_frame " + particle_pos.x + " " + particle_pos.y + " " + particle_pos.z + " .3 .1 .3 .2 30")
        e.block.executeCommand("/particle cloud " + particle_pos.x + " " + particle_pos.y + " " + particle_pos.z + " .3 .1 .3 0 3")
    }
    if (e.block.world.getBlock(e.block.pos.offset(e.side, direction)).name.indexOf("water") != -1) {
        moveBlock(e, e.side, direction)
        e.block.world.playSoundAt(e.block.pos, "minecraft:entity.player.swim", .5, getRandomFloat(.3, .7))
        e.block.world.spawnParticle("splash", e.block.x, e.block.y, e.block.z, .5, .5, .5, 0, 100)
        e.block.world.spawnParticle("bubble_pop", e.block.x + .5, e.block.y + .5, e.block.z + .5, .2, .2, .2, 0, 100)
    }
}


function moveBlock(e, direction, offset) {
    var place_pos = e.block.pos.offset(direction, offset)
    var isWater, waterLevel
    if (e.block.world.getBlock(place_pos).name.indexOf("water") != -1) {
        isWater = true
        waterLevel = e.block.world.getBlock(place_pos).getProperty("level")
    }
    if (e.block.storeddata.has("inSource")) {
        e.block.world.setBlock(e.block.pos, "water")
    }
    e.block.executeCommand("setblock " + place_pos.x + " " + place_pos.y + " " + place_pos.z + " customnpcs:npcscripted")
    try {
        var nbt = e.block.world.getBlock(place_pos).getBlockEntityNBT()
        var s1 = e.API.stringToNbt('{}');
        s1.putString("Script", "");
        s1.setList("Console", []);
        nbt.setList("Scripts", [s1]);

        var scripts = nbt.getList("Scripts", nbt.getListType("Scripts"))[0];
        var sl = [];
        var requiredScripts = ["blocks/pushable_block.js", "boiler/commonfunctions.js"]; // scripts from your folder

        for (var i = 0; i < requiredScripts.length; i++) {
            var test = e.API.stringToNbt('{}');
            test.putString('Line', requiredScripts[i]);
            sl.push(test);
        }

        scripts.setList("ScriptList", sl);
        nbt.setByte("ScriptEnabled", 1);
        var block = e.block.world.getBlock(place_pos.getX(), place_pos.getY(), place_pos.getZ())
        block.setTileEntityNBT(nbt);
        block.setModel("supplementaries:daub_frame")

        // when updated
        var sdata = e.block.world.getBlock(place_pos.getX(), place_pos.getY(), place_pos.getZ()).getStoreddata();
        sdata.put("updated", Date.now());
        if (direction == 1) {
            sdata.put("falling", 1)
        }
        if (isWater) {
            sdata.put("floating", 1)
        }
        if (waterLevel == 0) {
            sdata.put("inSource", 1)
        }


    }

    catch (er) {
        e.player.message("§cError: §r" + er);
    }
    e.block.remove()
}