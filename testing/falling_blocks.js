var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(API.getLevelDir() + '/scripts/ecmascript/boiler/commonFunctions.js')

function interact(e) {
    var pos = {
        x: getRandomInt(1640, 1580),
        y: 56,
        z: getRandomInt(2520, 2547)
    }
    summonFallingBlockCircle(e.player.world, pos)
}

function summonFallingBlockCircle(world, pos) {
    for (var x = -3; x < 3; x++) {
        for (var z = -3; z < 3; z++) {
            var chance_to_not_summon = getRandomInt(0, 100)
            if (chance_to_not_summon < 15) continue
            API.executeCommand(world, '/summon falling_block ' + (pos.x + x) + ' ' + pos.y + ' ' + (pos.z + z) + ' {BlockState:{Name:"minecraft:stone"},Time:1,HurtEntities:true,FallHurtMax:20,FallHurtAmount:1f,CancelDrop:true}')
        }
    }

}