var selected_npc
var player
/**
 * @param {PlayerEvent.InteractEvent} e
 */
function useNPCTool(e) {
    var tool = e.player.getMainhandItem().getNbt().getString("Tool")
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
            e.player.message("&bMover: &eSelection cleared")
            return
        }
        else {
            if (!selected_npc) return
            var rt = e.player.rayTraceBlock(6, true, true)
            if (!rt) return
            var pos = rt.getBlock().getPos().offset(rt.getSideHit())
            selected_npc.setHome(pos.x + .5, pos.y, pos.z + .5)
            selected_npc.x = pos.x + .5
            selected_npc.y = pos.y
            selected_npc.z = pos.z + .5
            e.player.message("&bMover: &e" + selected_npc.name + " moved to " + pos.x + " " + pos.y + " " + pos.z)
            return
        }
    }
    if (e.type == 1) {
        if (!selected_npc && e.target.type == 2) {
            selected_npc = e.target
            e.player.message("&bMover: &e" + e.target.name + " &aselected")
            return
        }
        if (selected_npc == e.target) {
            selected_npc = null
            e.player.message("&bMover: &e" + e.target.name + " &cunselected")
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
    if (e.type != 1) {
        var rt = e.player.rayTraceBlock(6, true, true)
        if (!rt) { openClonerGui(e); return }
        var pos = rt.getBlock().getPos().offset(rt.getSideHit())
        if (e.player.storeddata.has("clone_name")) {
            e.API.clones.spawn(pos.x + .5, pos.y, pos.z + .5, e.player.storeddata.get("clone_tab"), e.player.storeddata.get("clone_name"), e.player.world)
        }
        e.player.message("&aCloner: &eSpawned clone")
    }
}

function openClonerGui(e, page) {
    if (!page) {
        if (e.player.storeddata.has("clone_tab")) {
            page = e.player.storeddata.get("clone_tab")
        }
        else {
            page = 1
        }
    }
    var current_list = []
    for (var i = 0; i < e.API.getClones().getClones(page).length; i++) {
        current_list.push(e.API.getClones().getClones(page)[i])
    }

    CLONER_GUI = e.API.createCustomGui(1, 256, 256, false, e.player)
    CLONER_GUI.addLabel(id("current_tab"), "Tab " + page, -45, 0, 1, 1, 0xffffff)
    CLONER_GUI.addEntityDisplay(id("entity_clone"), 220, 150, e.player.world.createEntity("cow")).setScale(2)
    CLONER_GUI.addScroll(id("scroll_clones"), 0, 0, 150, 250, current_list)
        .setOnClick(function (gui, t) {
            try {
                gui.getComponent(id("entity_clone")).setEntity(e.API.clones.get(page, current_list[t.getSelection()[0]], e.player.world))
                gui.update()
            } catch (error) {
                player.message(error)
            }
        })
    if (e.player.storeddata.has("clone_name") && page == e.player.storeddata.get("clone_tab")) {
        CLONER_GUI.getComponent(id("scroll_clones")).setSelection([current_list.indexOf(e.player.storeddata.get("clone_name"))])
        CLONER_GUI.getComponent(id("entity_clone")).setEntity(e.API.clones.get(page, e.player.storeddata.get("clone_name"), e.player.world))
    }
    for (var i = 1; i <= 9; i++) {
        var current_number = i
        CLONER_GUI.addButton(id("tab_" + i), "Tab " + i, -50, 0 + (22 * i), 45, 20).setOnPress(function (gui, t) {
            try {
                openClonerGui(e, Number(t.getLabel().replace("Tab ", "")))
            } catch (error) {
                player.message(error)
            }
        })
    }
    CLONER_GUI.addButton(id("set_clone"), "Select", 170, 200, 100, 20).setOnPress(function (gui, t) {
        e.player.storeddata.put("clone_tab", page)
        e.player.storeddata.put("clone_name", current_list[gui.getComponent(id("scroll_clones")).getSelection()[0]])
        e.player.message("&aCloner: &eClone set to " + current_list[gui.getComponent(id("scroll_clones")).getSelection()[0]])
        e.player.closeGui()
        e.player.getMainhandItem().setCustomName("§aSpawner: " + e.player.storeddata.get("clone_name"))

    })





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
        e.player.message("&cEraser: &eErased " + e.target.name)
    }
}
