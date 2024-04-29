var API = Java.type('noppes.npcs.api.NpcAPI').Instance();

var esca_interval = 0


function livingEntityUseItemEventFinish(event) {
    var player = API.getIEntity(event.event.entity)
    esca_interval++
    if (esca_interval >= 4) { esca_interval = 0 }
    else { return }
    if (player.getCustomGui() && esca_interval == 0) {
        API.executeCommand(player.world, '/summon minecraft:item ' + player.x + ' ' + player.y + ' ' + player.z + ' {Item:{id:"aquamirae:esca",Count:1b,tag:{display:{Lore:[\'{"italic":false,"color":"white","extra":[{"text":""},{"color":"dark_aqua","text":"Use at a Power or Dampening Remnant"}],"text":""}\', \'{"italic":false,"color":"white","extra":[{"text":""},{"color":"dark_aqua","text":"to obtain a perk. Or ingest it to"}],"text":""}\', \'{"italic":false,"color":"white","extra":[{"text":""},{"color":"dark_aqua","text":"enhance your aquatic abilities"}],"text":""}\'],Name:\'{"italic":false,"extra":[{"text":""},{"underlined":true,"obfuscated":true,"color":"aqua","text":"a"},{"underlined":true,"color":"aqua","text":"Remnant Vessel"},{"underlined":true,"obfuscated":true,"color":"aqua","text":"K"}],"text":""}\'}}}}')
    }

    var item = API.getIItemStack(event.event.item)
    if (item.name.indexOf("esca") != -1) player.trigger(7, [])
    if (item.name == "minecraft:potion") {
        var nbt = item.getItemNbt()
        var potion_type = nbt.getCompound("tag").getString("Potion")
        if (potion_type == "minecraft:water") {
            addToScore(player, "perk_power", 4)
            setScore(player, "restore_hydrate", 1)
            player.timers.forceStart(768080, 4, false)
            if (getScore(player, "perk_power") > getScore(player, "max_perk_power")) {
                setScore(player, "perk_power", getScore(player, "max_perk_power"))
            }
        }

    }
}


var SCOREBOARD = API.getIWorld("overworld").getScoreboard()

function getScore(player, objective) {
    if (SCOREBOARD.hasObjective(objective) && SCOREBOARD.hasPlayerObjective(player.name, objective)) {
        return API.getIWorld("overworld").getScoreboard().getPlayerScore(player.name, objective)
    }
    else {
        return 0
    }

}

function setScore(player, objective, value) {
    API.getIWorld("overworld").getScoreboard().setPlayerScore(player.name, objective, value)
}

function addToScore(player, objective, amount) {
    API.getIWorld("overworld").getScoreboard().setPlayerScore(player.name, objective, getScore(player, objective) + amount)
}