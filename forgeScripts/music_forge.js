var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
function worldOut(text) {
    return API.getIWorld("overworld").broadcast(text);
}


function livingSetAttackTargetEvent(e) {
    var player = e.entity.getAttackTarget()
    if (player != e.entity.tempdata.get("oldAttackTarget")) {

        if (e.entity.tempdata.get("oldAttackTarget") != null && e.entity.tempdata.get("oldAttackTarget").type == 1) {
            removeEntityFromCurrentOpponents(e.entity, e.entity.tempdata.get("oldAttackTarget"))
        }
    }
    if (player == null) return
    if (player.type != 1) { return }
    if (!player.tempdata.has("currentOpponents")) { player.tempdata.put("currentOpponents", []) }
    if (player.tempdata.get("currentOpponents").indexOf(e.entity) != -1) return
    var enemies = player.tempdata.get("currentOpponents")
    enemies.push(e.entity)
    player.tempdata.put("currentOpponents", enemies)
    e.entity.tempdata.put("oldAttackTarget", player)
}


function removeEntityFromCurrentOpponents(entity, player) {
    var enemies = player.tempdata.get("currentOpponents")
    var position = enemies.indexOf(entity)
    if (position == -1) return
    enemies.splice(position, 1)
    player.tempdata.put("currentOpponents", enemies)

}
