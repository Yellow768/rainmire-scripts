var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(API.getLevelDir() + "/scripts/ecmascript/boiler/id_generator.js");

var esca_interval = 0


function livingEntityUseItemEventFinish(event) {
    var player = API.getIEntity(event.event.entity)
    esca_interval++
    if (esca_interval >= 4) { esca_interval = 0 }
    else { return }
    if (player.getCustomGui() && esca_interval == 0) {
        API.executeCommand(player.world, '/summon minecraft:item ' + player.x + ' ' + player.y + ' ' + player.z + ' {Item:{id:cobblestone,tag:{display:{Name:\'["",{"text":"         Remnant Vessel","italic":false,"bold":true,"color":"light_purple"}]\',Lore:[\'["",{"text":"     Holds supernatural power","italic":false,"color":"yellow"}]', '[""]', '["",{"text":"Consume to enhance aquatic traits","italic":false,"color":"aqua"}]', '[""]', '["",{"text":" ","italic":false}]\']}},Count:1}}')
    }

    var item = API.getIItemStack(event.event.item)
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