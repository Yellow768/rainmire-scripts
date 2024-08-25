/*Used to make bottomless pits*/


var scale = [1, 1, 1]
var block

function init(e) {
    if (e.block.storeddata.has("scalex")) scale[0] = e.block.storeddata.get("scalex")
    if (e.block.storeddata.has("scaley")) scale[1] = e.block.storeddata.get("scaley")
    if (e.block.storeddata.has("scalez")) scale[2] = e.block.storeddata.get("scalez")
    if (!e.block.storeddata.has("show")) e.block.storeddata.put("show", 0)
    block = e.block

    block.timers.forceStart(1, 5, true)
    block.setModel("quark:red_crystal_lamp")
}

var GUI
var display_text = ["Show Display", "Hide Display"]

function interact(e) {
    GUI = e.API.createCustomGui(1, 256, 256, false, e.player)
    GUI.addLabel(2, "Scale", 39, 10, 1, 1, 0xffffff)
    GUI.addTextField(3, 40, 20, 50, 15).setCharacterType(3).setText(scale[0]).setOnChange(function (gui, t) {

        scale[0] = t.getFloat()
        saveScale()

    })
    GUI.addTextField(4, 100, 20, 50, 15).setCharacterType(3).setText(scale[1]).setOnChange(function (gui, t) {
        scale[1] = t.getFloat()
        saveScale()
    })
    GUI.addTextField(5, 160, 20, 50, 15).setCharacterType(3).setText(scale[2]).setOnChange(function (gui, t) {
        scale[2] = t.getFloat()
        saveScale()
    })
    GUI.addButton(6, display_text[e.block.storeddata.get("show")], 40, 60, 160, 20).setOnPress(function (gui, t) {
        if (!e.block.storeddata.get("show")) {
            e.block.executeCommand('/summon block_display ~ ~1 ~ {transformation:{left_rotation:[0f,0f,0f,1f],right_rotation:[0f,0f,0f,1f],scale:[' + scale[0] + 'f,' + scale[1] + 'f,' + scale[2] + 'f],translation:[' + -(scale[0] / 2) + 'f,0f,' + -(scale[2] / 2) + 'f]},block_state:{Name:red_stained_glass},Tags:["' + e.block.x + e.block.y + e.block.z + '"]}')
            e.block.storeddata.put("show", 1)
        }
        else {
            e.block.executeCommand("/kill @e[type=minecraft:block_display,tag=" + e.block.x + e.block.y + e.block.z + "]")
            e.block.storeddata.put("show", 0)
        }
        t.setLabel(display_text[e.block.storeddata.get("show")])
        GUI.update()
    })
    e.player.showCustomGui(GUI)
}

function saveScale() {
    var show = block.storeddata.get("show")
    block.storeddata.put("scalex", scale[0])
    block.storeddata.put("scaley", scale[1])
    block.storeddata.put("scalez", scale[2])
    if (show) {
        block.executeCommand("/kill @e[type=minecraft:block_display,tag=" + block.x + block.y + block.z + "]")
        block.executeCommand('/summon block_display ~ ~1 ~ {transformation:{left_rotation:[0f,0f,0f,1f],right_rotation:[0f,0f,0f,1f],scale:[' + scale[0] + 'f,' + scale[1] + 'f,' + scale[2] + 'f],translation:[' + -(scale[0] / 2) + 'f,0f,' + -(scale[2] / 2) + 'f]},block_state:{Name:red_stained_glass},Tags:["' + block.x + block.y + block.z + '"]}')
    }

}



function timer(e) {
    var radius = Math.max(scale[0], scale[1], scale[2])
    var entities = e.block.world.getNearbyEntities(e.block.pos, radius, 5)
    for (var i = 0; i < entities.length; i++) {
        if (entities[i].x < e.block.x - (scale[0] / 2) || entities[i].x > e.block.x + (scale[0] / 2)) {
            continue
        }
        if (entities[i].z < e.block.z - (scale[2] / 2) || entities[i].z > e.block.z + (scale[2] / 2)) {
            continue
        }
        if (entities[i].y < e.block.y - (scale[1] / 2) || entities[i].y > e.block.y + (scale[1] / 2)) {
            continue
        }
        if (entities[i].type == 1 && entities[i].gamemode != 2) {
            continue
        }
        entities[i].kill()
    }
}

function harvested(e) {
    block.executeCommand("/kill @e[type=minecraft:block_display,tag=" + block.x + block.y + block.z + "]")
}