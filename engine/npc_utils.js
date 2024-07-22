var selected_npc
var player
/**
 * @param {PlayerEvent.InteractEvent} e
 */
function useNPCTool(e) {
    var tool = e.player.getMainhandItem().getDisplayName()
    switch (tool) {
        case "Mover":
            moverFunctions(e)
            break;
        case "Spawner":
            spawnerFunctions(e)
            break;
        case "Eraser":
            eraserFunctions(e)
            break;
    }
}

function moverFunctions(e) {
    if (e.type == 0) {
        if (e.player.isSneaking()) {
            selected_npc = null
            e.player.message("&dMover: &eSelection cleared")
            return
        }
        else {
            if (!selected_npc) return
            var rt = e.player.rayTraceBlock(6, true, true)
            if (!rt) return
            var pos = rt.getBlock().getPos().offset(rt.getSideHit())
            selected_npc.setHome(pos.x, pos.y, pos.z)
            selected_npc.setPos(pos)
            e.player.message("&dMover: &e" + selected_npc.name + " moved to " + pos.x + " " + pos.y + " " + pos.z)
            return
        }
    }
    if (e.type == 1) {
        if (!selected_npc && e.target.type == 2) {
            selected_npc = e.target
            e.player.message("&dMover: &e" + e.target.name + " &aselected")
            return
        }
        if (selected_npc == e.target) {
            selected_npc = null
            e.player.message("&dMover: &e" + e.target.name + " &cunselected")
            return
        }

    }
    if (e.type == 2 && selected_npc) {
        var rt = e.player.rayTraceBlock(20, false, true)
        var pos = rt.getBlock().getPos().offset(rt.getSideHit())
        selected_npc.setHome(pos.x, pos.y, pos.z)
        selected_npc.setPos(pos)
        e.player.message("&dMover: &e" + selected_npc.name + " moved to " + pos.x + " " + pos.y + " " + pos.z)
    }
}


var CLONER_GUI
function spawnerFunctions(e) {
    e.setCanceled(true)
    player = e.player
    if (e.type == 0) {
        var rt = e.player.rayTraceBlock(6, true, true)
        if (!rt) { openClonerGui(e); return }
        var pos = rt.getBlock().getPos().offset(rt.getSideHit())
        if (e.player.storeddata.has("clone_name")) {
            e.API.clones.spawn(pos.x, pos.y, pos.z, e.player.storeddata.get("clone_tab"), e.player.storeddata.get("clone_name"), e.player.world)
        }
        e.player.message("&aCloner: &eSpawned clone")
    }
    if (e.type == 2) {
        var rt = e.player.rayTraceBlock(6, true, true)
        var pos = rt.getBlock().getPos().offset(rt.getSideHit())
        if (e.player.storeddata.has("clone_name")) {
            e.API.clones.spawn(pos.x, pos.y, pos.z, e.player.storeddata.get("clone_tab"), e.player.storeddata.get("clone_name"), e.player.world)
        }
        e.player.message("&aCloner: &eSpawned clone")
    }
}

function openClonerGui(e) {
    CLONER_GUI = e.API.createCustomGui(1, 256, 256, false, e.player)
    CLONER_GUI.addTextField(id("clone_name"), 50, 50, 250, 25)
    CLONER_GUI.addTextField(id("clone_tab"), 50, 80, 100, 25)
    CLONER_GUI.addLabel(id("clone_name_label"), "Name", 0, 50, 1, 1)
    CLONER_GUI.addLabel(id("clone_tab_label"), "Tab", 0, 80, 1, 1)
    CLONER_GUI.addButton(id("set_button"), "Set", 50, 120, 50, 15).setOnPress(function (gui, t) { setCloneName() })
    e.player.showCustomGui(CLONER_GUI)
}


function setCloneName(e) {
    player.storeddata.put("clone_name", CLONER_GUI.getComponent(id("clone_name")).getText())
    player.storeddata.put("clone_tab", CLONER_GUI.getComponent(id("clone_tab")).getText())
    player.closeGui()
}

function eraserFunctions(e) {
    e.setCanceled(true)
    if (e.type == 1 && e.target.type == 2) {
        e.target.despawn()
        e.player.message("&cEraser: &eErased NPC")
    }
}