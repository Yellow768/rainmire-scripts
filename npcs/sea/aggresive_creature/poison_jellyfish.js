function meleeAttack(e) {
    e.npc.ai.setRetaliateType(3)
    e.npc.ai.setWalkingSpeed(0)
    e.npc.timers.forceStart(15, 40, false)
    e.npc.world.playSoundAt(e.npc.pos, "upgrade_aquatic:entity.jellyfish.cooldown_end", 1, .4)
    e.npc.world.spawnParticle("upgrade_aquatic:green_jelly_blob", e.npc.x, e.npc.y, e.npc.z, .4, .4, .4, 0, 30)
    e.npc.display.setSize(6)
}

function target(e) {
    if (e.npc.storeddata.get("hasStatusEffect") == 1) return
    e.npc.ai.setWalkingSpeed(6)
    e.npc.ai.setRetaliateType(0)
}

function timer(e) {
    if (e.id == 15 && e.npc.storeddata.get("hasStatusEffect") != 1) {
        e.npc.world.spawnParticle("upgrade_aquatic:green_jelly_blob", e.npc.x, e.npc.y, e.npc.z, .4, .4, .4, .4, 30)
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.squid.squirt", 1, 1)
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.slime.squish", 1, .4)
        e.npc.display.setSize(5)
        e.npc.executeCommand("/summon area_effect_cloud ~ ~ ~ {Particle:entity_effect,Color:8439583,Potion:poison,Radius:2,Duration:200}")
        e.npc.executeCommand("/summon area_effect_cloud ~ ~-.5 ~ {Particle:entity_effect,Color:8439583,Potion:poison,Radius:3,Duration:200}")
        e.npc.executeCommand("/summon area_effect_cloud ~ ~.5 ~ {Particle:entity_effect,Color:8439583,Potion:poison,Radius:3,Duration:200}")
        e.npc.timers.forceStart(16, 120, false)
        e.npc.ai.setWalkingSpeed(6)
        e.npc.ai.setRetaliateType(2)
    }
    if (e.id == 16 && e.npc.storeddata.get("hasStatusEffect") != 1) {
        e.npc.ai.setWalkingSpeed(4)
        e.npc.ai.setRetaliateType(0)
    }

}