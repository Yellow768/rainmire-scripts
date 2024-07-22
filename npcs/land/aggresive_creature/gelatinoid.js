var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + "/scripts/ecmascript/boiler/id_generator.js");
load(api.getLevelDir() + "/scripts/ecmascript/boiler/commonFunctions.js");
load(api.getLevelDir() + "/scripts/ecmascript/boiler/proper_damage.js");

function init(e) {
    e.npc.timers.forceStart(id("start_jumping"), getRandomInt(20, 50), false)
}




function timer(e) {

    var deviation = getRandomInt(-20, 20)
    var d = FrontVectors(e.npc, deviation, 0, .3, true)
    e.npc.jump()
    e.npc.setMotionX(d[0])
    e.npc.setMotionZ(d[2])
    e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.slime.squish", .7, getRandomInt(0.2, .2))
    e.npc.timers.forceStart(id("start_jumping"), getRandomInt(20, 50), false)
}

function meleeAttack(e) {
    e.setCanceled(true)
}

function collide(e) {
    if (e.entity == e.npc.getAttackTarget() && !isOnGround(e.npc) && canSeeEntity(e.npc, e.entity, 90)) {
        var damage = calculateDamage(e.npc.getStats().getMelee().getStrength(), e.entity, e.npc)
        if (!damage) return
        e.entity.damage(damage)
        e.entity.knockback(1, GetAngleTowardsEntity(e.npc, e.entity))

    }
}