var radius, current_target, command, GUI, block, explosion_size, model, revealed


function init(e) {
    e.block.setIsPassible(true)
    block = e.block

    if (!e.block.storeddata.has("uuid")) {
        e.block.storeddata.put("uuid", e.API.clones.get(1, "Fish", e.block.world).generateNewUUID())
    }
    if (!e.block.storeddata.has("radius")) {
        e.block.storeddata.put("radius", 0)
        e.block.storeddata.put("model", "quark:stone_lamp")
        e.block.storeddata.put("target", 0)
        e.block.storeddata.put("revealed", 0)
        e.block.storeddata.put("activated", 0)
        e.block.storeddata.put("command", "")
        e.block.storeddata.put("explosion_size", 0)
    }
    radius = e.block.storeddata.get("radius")
    model = e.block.storeddata.get("model")
    current_target = e.block.storeddata.get("target")
    revealed = e.block.storeddata.get("revealed")
    command = e.block.storeddata.get("command")
    explosion_size = e.block.storeddata.get("explosion_size")

    revealed || e.block.storeddata.get("activated") ? e.block.setModel(model) : e.block.setModel("barrier")
    e.block.setLight(revealed)
}

function interact(e) {
    GUI = e.API.createCustomGui(1, 256, 256, false, e.player)
    GUI.addTextField(1, 100, 0, 50, 20).setCharacterType(1).setText(radius)
    GUI.addTextField(2, 100, 40, 150, 20).setText(model)
    GUI.addTextField(3, 100, 80, 50, 20).setCharacterType(1).setText(current_target)
    GUI.addTextField(4, 100, 120, 150, 20).setText(explosion_size)
    GUI.addTextField(5, 100, 160, 300, 20).setText(command)
    GUI.addLabel(6, "Radius", 0, 0, 155, 20, 0xffffff)
    GUI.addLabel(7, "Model", 0, 45, 150, 20, 0xffffff)
    GUI.addLabel(8, "Target", 0, 80, 155, 20, 0xffffff)
    GUI.addLabel(9, "Explosion Size", 0, 125, 150, 20, 0xffffff)
    GUI.addLabel(10, "Command", 0, 165, 150, 20, 0xffffff)
    GUI.addButton(11, "Save", 0, 200, 150, 20)
    GUI.addButton(12, "Reset", 220, -5, 60, 20)
    e.player.showCustomGui(GUI)

}

function tick(e) {
    if (e.block.world.storeddata.get("observationBlocksVisible") == 1) {
        e.block.setModel("quark:stone_lamp")
        e.block.setLight(10)
    }
    else {
        revealed && !e.block.storeddata.get("activated") ? e.block.setModel(model) : e.block.setModel("barrier")
        e.block.setLight(revealed)
    }
    var scoreboard = e.block.world.scoreboard
    var nE = e.block.world.getNearbyEntities(e.block.pos, radius, 1)
    if (revealed || e.block.storeddata.get("activated")) return
    for (var i = 0; i < nE.length; i++) {
        var validPlayer = true
        if (!nE[i].storeddata.has("encounteredTrapBlocks")) nE[i].storeddata.put("encounteredTrapBlocks", "[]")
        var allEncounteredTrapBlocks = JSON.parse(nE[i].storeddata.get("encounteredTrapBlocks"))

        if (allEncounteredTrapBlocks.indexOf(e.block.storeddata.get("uuid")) != -1) {
            validPlayer = false
        }
        if (nE[i].gamemode == 1) {
            validPlayer = false
        }
        if (validPlayer) {
            var die_1 = getRandomInt(1, 7)
            var die_2 = getRandomInt(1, 7)
            var perception = scoreboard.getPlayerScore(nE[i].name, "Perception")
            if (current_target <= die_1 + die_2 + perception) {
                revealed = 1
                e.block.storeddata.put("revealed", revealed)
                e.block.setModel(model)
                e.block.setLight(1)
                e.block.executeCommand('/tellraw @a {"text":"' + nE[i].name + ' noticed a trap! (' + dice[die_1] + ' + ' + dice[die_2] + ' + ' + perception + ' >= ' + current_target + ')","color":"aqua"}')
                e.block.executeCommand('xp add ' + nE[i].name + ' ' + current_target * 2)
                e.block.executeCommand("/particle alexsmobs:worm_portal ~ ~ ~ .2 .2 .2 .2 10")
                e.block.world.playSoundAt(e.block.pos, "iob:ui.trap_disabled", 1, 1)
            }
            //nE[i].message(command.replace(/player/g, nE[i].name))
            allEncounteredTrapBlocks.push(e.block.storeddata.get("uuid"))
            nE[i].storeddata.put("encounteredTrapBlocks", JSON.stringify(allEncounteredTrapBlocks))
        }
        //
    }


}

var dice = ['☍', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅']

function collide(e) {
    if (e.block.storeddata.get("activated")) return
    if (command) e.block.executeCommand(command)
    if (explosion_size) {
        e.block.world.explode(e.block.x, e.block.y, e.block.z, explosion_size, false, false)
    }
    e.block.storeddata.put("activated", 1)
    e.block.setModel("barrier")
    e.block.executeCommand('/tellraw @a {"text":"' + e.entity.name + ' failed to notice a trap","color":"red"}')
}


function customGuiButton(e) {
    if (e.buttonId == 12) {
        block.storeddata.put("uuid", e.API.clones.get(1, "Fish", block.world).generateNewUUID())
        block.storeddata.put("revealed", 0)
        revealed = 0
        block.setModel("barrier")
        block.setLight(0)
        block.storeddata.put("activated", 0)
        return
    }
    block.storeddata.put("radius", GUI.getComponent(1).getInteger())
    block.storeddata.put("model", GUI.getComponent(2).getText())
    block.storeddata.put("target", GUI.getComponent(3).getInteger())
    block.storeddata.put("explosion_size", GUI.getComponent(4).getText())
    block.storeddata.put("command", GUI.getComponent(5).getText())
    radius = block.storeddata.get("radius")
    model = block.storeddata.get("model")
    current_target = block.storeddata.get("target")
    explosion_size = block.storeddata.get("explosion_size")
    command = block.storeddata.get("command")
    block.setModel(model)
    GUI.close()
}