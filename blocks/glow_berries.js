var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/boiler/commonFunctions.js')

function init(e) {
    e.block.setRotation(180, 180, 0)
    e.block.setIsPassible(true)
    e.block.setGeckoModel("iob:geo/block/plant_generic.geo.json")
    if (!e.block.timers.has(1)) { replenishBerries(e) }
}


function replenishBerries(e) {
    e.block.setGeckoTexture("minecraft:textures/block/cave_vines_lit.png")
    e.block.setLight(12)
}
function interact(e) {
    if (e.block.timers.has(1)) return
    e.block.setGeckoTexture("minecraft:textures/block/cave_vines.png")
    e.block.world.playSoundAt(e.block.pos, "minecraft:block.cave_vines.pick_berries", 1, getRandomFloat(.2, .8))
    e.block.setLight(0)
    for (var i = 0; i < getRandomInt(1, 3); i++) {
        var glowberry_itemstack = e.block.world.createItem("glow_berries", 1)
        var item_entity = e.block.world.createEntity("item")
        item_entity.setItem(glowberry_itemstack)
        item_entity.pos = e.block.pos
        e.player.world.spawnEntity(item_entity)
        item_entity.setMotionY(.2)
        item_entity.setMotionX(getRandomFloat(-0.1, .1))
        item_entity.setMotionZ(getRandomFloat(-0.1, .1))

    }

    e.block.timers.start(1, 3600, false)
}

function timer(e) {
    e.block.setGeckoTexture("minecraft:textures/block/cave_vines_lit.png")
    e.block.setLight(12)
}
