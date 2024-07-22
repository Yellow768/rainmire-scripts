var locked_player
function init(e) {
    e.npc.timers.forceStart(1, 0, true)
}

function interact(e) {
    if (locked_player == e.player) {
        locked_player = null
        e.npc.say("No longer my player")
        e.npc.executeCommand("/attribute " + e.player.name + " forge:entity_gravity base set 0.08")
        return
    }
    locked_player = e.player
    e.npc.display.setSkinPlayer(e.player.name)
    e.npc.updateClient()
    e.npc.say("My locked player")
    e.npc.executeCommand("/attribute " + e.player.name + " forge:entity_gravity base set 0")
}

function timer(e) {
    if (locked_player && locked_player.gamemode != 1) {
        e.npc.executeCommand("tp " + locked_player.name + " ~ ~ ~")
        locked_player.setMotionX(0)
        locked_player.setMotionY(0)
        locked_player.setMotionZ(0)
        locked_player.addPotionEffect(14, 1, 1, false)
        if (locked_player.rotation > e.npc.rotation + 50) { e.npc.executeCommand("tp " + locked_player.name + " ~ ~ ~ " + (e.npc.rotation + 50) + " " + locked_player.pitch) }
        if (locked_player.rotation < e.npc.rotation - 50) { e.npc.executeCommand("tp " + locked_player.name + " ~ ~ ~ " + (e.npc.rotation - 50) + " " + locked_player.pitch) }
        if (locked_player.pitch > 70) { e.npc.executeCommand("tp " + locked_player.name + " ~ ~ ~ " + locked_player.rotation + " " + 70) }
        var pitch_sub = 180 + locked_player.pitch
        if (pitch_sub > 190) pitch_sub = 190
        e.npc.getJob().getPart(0).setRotation(pitch_sub, 180 - (e.npc.rotation - locked_player.rotation), 180)
        e.npc.updateClient()
    }
}