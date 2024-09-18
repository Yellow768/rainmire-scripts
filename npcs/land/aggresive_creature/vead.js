var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/npcs/boiler/base_npc_script.js')
global_functions.meleeAttack = function (e) {
    explode(e)
}

state_panicking.enter = function (e) {
    explode(e)
}

function explode(e) {
    npc.updateClient()
    npc.executeCommand("/particle minecraft:campfire_signal_smoke ~ ~.2 ~ .7 .7 .7 0.1 200")
    npc.world.explode(npc.x, npc.y, npc.z, 2, false, false)
    npc.kill()

}