var API = Java.type('noppes.npcs.api.NpcAPI').Instance();

var esca_interval = 0


function livingEntityUseItemEventFinish(event) {
    var player = API.getIEntity(event.event.entity)
    esca_interval++
    if (player.getCustomGui() && esca_interval == 0) {
        API.executeCommand(player.world, '/summon minecraft:item ' + player.x + ' ' + player.y + ' ' + player.z + ' {Item:{id:"aquamirae:esca",Count:1b,tag:{display:{Lore:[\'{"italic":false,"color":"white","extra":[{"text":""},{"color":"dark_aqua","text":"Use at a Power or Dampening Remnant"}],"text":""}\', \'{"italic":false,"color":"white","extra":[{"text":""},{"color":"dark_aqua","text":"to obtain a perk. Or ingest it to"}],"text":""}\', \'{"italic":false,"color":"white","extra":[{"text":""},{"color":"dark_aqua","text":"enhance your aquatic abilities"}],"text":""}\'],Name:\'{"italic":false,"extra":[{"text":""},{"underlined":true,"obfuscated":true,"color":"aqua","text":"a"},{"underlined":true,"color":"aqua","text":"Remnant Vessel"},{"underlined":true,"obfuscated":true,"color":"aqua","text":"K"}],"text":""}\'}}}}')
    }
    if (esca_interval >= 4) { esca_interval == 0 }
    if (API.getIItemStack(event.event.item).name.indexOf("esca" != -1)) player.trigger(7, [])
}


