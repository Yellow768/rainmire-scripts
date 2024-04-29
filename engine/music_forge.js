var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
function worldOut(text) {
    return API.getIWorld("overworld").broadcast(text);
}


function livingSetAttackTargetEvent(e) {
    if (e.entity.getAttackTarget() == null) { return }
    worldOut(e.entity.getAttackTarget().type)



}