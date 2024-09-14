
var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/npcs/boiler/base_npc_script.js')
var projectile_array = []
var npc
var state_normal = new State("normal")
StateMachine.default_state = state_normal
state_normal.init = function (e) {
    e.npc.getTimers().forceStart(1, 0, true)
    npc = e.npc
}

state_normal.rangedLaunched = function (e) {
    for (var i = 0; i < e.projectiles.length; i++) {
        e.projectiles[i].storeddata.put("time", 0)
        e.projectiles[i].tempdata.put("direction", [e.projectiles[i].getMotionX(), e.projectiles[i].getMotionY(), e.projectiles[i].getMotionZ()])
        projectile_array.push(e.projectiles[i])
        e.projectiles[i].enableEvents()
    }

}

state_normal.timer = function (e) {
    if (e.id == 1) {
        for (var i = 0; i < projectile_array.length; i++) {
            var p = projectile_array[i]
            p.setMotionX(p.tempdata.get("direction")[0])
            p.setMotionY(p.tempdata.get("direction")[1])
            p.setMotionZ(p.tempdata.get("direction")[2])
            if (p.storeddata.get("time") >= 30 || !p.inWater()) {
                p.kill()
                projectile_array.splice(i, 1)
                return
            }
            p.storeddata.put("time", p.storeddata.get("time") + 1)
        }
    }
}


state_panicking.timer = function (e) {
    state_panicking.defaultPanickingTimer(e)
    state_normal.timer(e)
}
state_paralyzed.timer = function (e) {
    state_paralyzed.defaultParalyzedTimer(e)
    state_normal.timer(e)
}
/**
* @param {ProjectileEvent.UpdateEvent} e
*/
function projectileTick(e) {
    if (projectile_array.indexOf(e.projectile) == -1) {
        projectile_array.push(e.projectile)
        npc.getTimers().forceStart(1, 0, true)
    }
    /*This attempts to prevent an unlikely exploit, whereby reloading scripts can cause the projectiles to stop moving and never despawn.
    A player could theoretically, run the command OR simply quit and rejoin the world. It would be an incredibly tedious and cumbersome exploit,
    but it could be done, so this prevents it*/
}