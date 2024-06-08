

var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
//load(api.getLevelDir() + "/scripts/ecmascript/boiler/id_generator.js");
var EntitiesType = Java.type('noppes.npcs.api.constants.EntitiesType')

function meleeAttack(e) {
    e.setCanceled(true)
}

/**
 * @param {NpcEvent.CollideEvent} e
 */
function collide(e) {

    var melee = e.npc.getStats().getMelee()
    if (melee.getStrength() == 0) return
    if (e.npc.getAttackTarget() == e.entity && !e.npc.getTimers().has(id("lowerMeleeRangeDelay"))) {
        var distance = TrueDistanceCoord(e.npc.x, e.npc.y, e.npc.z, e.entity.x, e.entity.y, e.entity.z)

        if (distance < 1.2) {
            e.entity.damage(calculateDamage(melee.getStrength(), e.entity))
            e.npc.getTimers().start(id("lowerMeleeRangeDelay"), melee.getDelay(), false)
            DoKnockback(e.npc, e.entity, melee.getKnockback() + 1, .2)
            e.entity.addPotionEffect(melee.getEffectType(), melee.getEffectTime(), melee.getEffectStrength(), false)

        }
        else {
            var d = FrontVectors(e.npc, GetPlayerRotation(e.npc, e.entity), 0, distance / e.npc.getAi().getWalkingSpeed())
            e.npc.setMotionX(d[0])
            e.npc.setMotionZ(d[2])
        }
    }
}


