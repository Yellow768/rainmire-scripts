function init(e) {
    e.block.setBlockModel("minecraft:oak_door")
}

function interact(e) {
    if (e.block.storeddata.has("picked")) return
    if (e.player.getMainhandItem().getDisplayName().indexOf("Lockpick") != -1) {
        e.block.storeddata.put("picked", 1)
        return
    }
    e.player.showDialog(190, "Door")
    e.setCanceled(true)

}