function remnantShard_interact(e) {
    if (e.player.getOffhandItem().getDisplayName().indexOf("Remnant Shard") != -1 && e.player.getMainhandItem().getDisplayName().indexOf("Remnant Shard") != -1) {
        e.player.getOffhandItem().setStackSize(e.player.getOffhandItem().getStackSize() - 1)
        e.player.getMainhandItem().setStackSize(e.player.getMainhandItem().getStackSize() - 1)
        executeCommand('/give ' + e.player.name + ' aquamirae:esca{display:{Lore:[\'{"italic":false,"color":"white","extra":[{"text":""},{"color":"dark_aqua","text":"Use at a Power or Dampening Remnant"}],"text":""}\', \'{"italic":false,"color":"white","extra":[{"text":""},{"color":"dark_aqua","text":"to obtain a perk. Or ingest it to"}],"text":""}\', \'{"italic":false,"color":"white","extra":[{"text":""},{"color":"dark_aqua","text":"enhance your aquatic abilities"}],"text":""}\'],Name:\'{"italic":false,"extra":[{"text":""},{"underlined":true,"obfuscated":true,"color":"aqua","text":"a"},{"underlined":true,"color":"aqua","text":"Remnant Vessel"},{"underlined":true,"obfuscated":true,"color":"aqua","text":"K"}],"text":""}\'}} 1')
        e.player.playSound("minecraft:item.totem.use", 1, 1)
        e.player.playSound("minecraft:entity.blaze.ambient", 1, .7)
        e.player.world.spawnParticle("aquamirae:electric", e.player.x, e.player.y + 1, e.player.z, .3, .4, .3, 1, 100)
        e.player.world.spawnParticle("aquamirae:ghost", e.player.x, e.player.y + 1, e.player.z, .3, .4, .3, 1, 100)
        e.player.world.spawnParticle("aquamirae:ghost_shine", e.player.x, e.player.y + 1, e.player.z, .3, .4, .3, 1, 100)
        displayTitle(e, "...Remnant Vessel Created...", "aqua")
    }
}