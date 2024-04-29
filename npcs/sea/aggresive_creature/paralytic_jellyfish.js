var ATTACK_TIMER = 10
var COOLDOWN_TIMER = 20

var canAttack = true

function init(e) {
    e.npc.stats.getMelee().setDelay(72000)
    e.npc.stats.ranged.setDelay(72000, 72000)
    e.npc.stats.ranged.setAccuracy(0)
    e.npc.stats.ranged.setRange(0)
    e.npc.inventory.setProjectile(e.npc.world.createItem("minecraft:scute", 1))
}

function timer(e) {
    if (e.npc.storeddata.get("hasStatusEffect") == 1) return
    switch (e.id) {
        case ATTACK_TIMER:
            e.npc.world.spawnParticle("aquamirae:shine", e.npc.x, e.npc.y, e.npc.z, .4, .4, .4, .4, 25)
            var nE = e.npc.world.getNearbyEntities(e.npc.pos, 2, -1)
            for (var entity in nE) {
                var validTarget = true
                if (nE[entity].type == 6 || nE[entity].type == 10 || nE[entity].type == 7 || nE[entity].type == 11) {
                    validTarget = false
                }
                if (nE[entity] == e.npc) {
                    validTarget = false
                }

                if (validTarget && nE[entity].type == 2) {
                    applyStatusEffect(e, nE[entity], 123401, 120)
                    nE[entity].damage(2)
                }

                if (validTarget && nE[entity].type == 1) {
                    nE[entity].trigger(510105, [1, 120])
                    nE[entity].damage(2)
                }


            }
            e.npc.world.playSoundAt(e.npc.pos, "upgrade_aquatic:entity.jellyfish.sting", 1, getRandomFloat(.09, 1.2))
            e.npc.ai.setWalkingSpeed(5)
            e.npc.ai.setRetaliateType(3)
            e.npc.timers.forceStart(COOLDOWN_TIMER, 120, false)
            e.npc.world.playSoundAt(e.npc.pos, "upgrade_aquatic:entity.jellyfish.death", 1, 1)
            e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.turtle.egg_break", 1, 1)
            canAttack = false
            e.npc.world.spawnParticle("aquamirae:electric", e.npc.x, e.npc.y, e.npc.z, .4, .4, .4, .4, 95)
            break;
        case COOLDOWN_TIMER:
            e.npc.ai.setWalkingSpeed(2)
            canAttack = true
            e.npc.ai.setRetaliateType(0)
    }
}

function tick(e) {
    if (e.npc.isAlive() && canAttack && e.npc.getAttackTarget() != null && e.npc.getAttackTarget().pos.distanceTo(e.npc.pos) < 3 && !e.npc.timers.has(ATTACK_TIMER)) {
        e.npc.ai.setWalkingSpeed(0)
        e.npc.timers.start(ATTACK_TIMER, 20, false)
        e.npc.world.spawnParticle("aquamirae:electric", e.npc.x, e.npc.y, e.npc.z, .4, .4, .4, .4, 95)
        e.npc.world.playSoundAt(e.npc.pos, "upgrade_aquatic:entity.jellyfish.ambient", 1, getRandomFloat(.09, 1.2))
    }
}


function applyStatusEffect(e, target, type, length) {

    target.trigger(450, [target])
    target.trigger(type, [target, length])
}

function trigger(e) {
    if (e.id == 1234768) {

    }
}