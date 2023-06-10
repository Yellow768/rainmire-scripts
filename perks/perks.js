var GROUNDPOUND_VALIDITY_TIMER = 768050
var LEVITATE_TIMER = 768060
var LEVITATE_DAMAGE_TIMER = 768061
var RESURFACE_TIMER = 768070
var REMOVE_RESURFACED_TIMER = 768071
var REHYDRATE_TIMER = 768080
var DASH_TIMER = 768090
var HURRICANE_TIMER = 768100
var HURRICANE_TIMER_EFFECT = 768101
var ANIMAL_LOVER_TIMER = 768110
var ANIMAL_LOVER_PARTICLE_TIMER = 768111
var SUBTRACT_USING = 768120
var OXYGENATE_TIMER = 768130
var ICICLE_TAG_TIMER = 768140

var doPerks = false
var perkReplenishingThreshold = 5
var currentReplensihingLevel = 0


var selected_perk_array = []
var collected_perk_array = []
var selected_bad_perk_array = []
var collected_bad_perk_array = []

var player



var p_groundPound = { id: "groundpound", type: 0, name: "Ground Pound", cost: 3, description: "Does a ground pound!" }
var p_dash = { id: "dash", type: 0, name: "Dash", cost: 3, description: "Does a dash!" }
var p_levitate = { id: "levitate", type: 0, name: "Levitation", cost: 1, description: "While held, levitate!" }
var p_resurface = { id: "resurface", type: 0, name: "Resurface", cost: 1, description: "Expell all your air for a quick boost upward while in water" }
var p_low_health_damage = { id: "low_health_damage", type: 1, name: "What Doesn't Kill You...", cost: 4, description: "Your damage is increased the lower your health is." }
var p_barter = { id: "barter", type: 0, name: "Bartering", cost: 4, description: "Manipulate the emotions of a target trader, using your heart skills to net lower costs, and more rewards." }
var p_summon = { id: "summon", type: 0, name: "Summon Water Creature", cost: 6, description: "Form a warrior made of water. Sends enemies flying back, but can't survive much damage." }
var p_companion_buff = { id: "companion_buff", type: 0, name: "Encouragement!", cost: 12, description: "Scraaaeam out a battle cry and rally your friends! Give your companions a health boost. The cost is lowered depending on your Heart Skills." }
var p_blood_cost = { id: "blood_cost", type: 1, name: "Blood Cost", cost: 0, description: "When out of hydration, supplement your own blood to use perks. You take damage equivalent to the cost." }
var p_far_thrower = { id: "far_thrower", type: 0, name: "Water Propulsion", cost: 2, description: "Launch thrown items farther by blasting it with water" }
var p_animal_lover = { id: "animal_lover", type: 0, name: "Animal Lover", cost: 6, description: "Secrete phermones that make wild animals trust you. It's duration is affected by your §cCharm" }
var p_repair = { id: "repair", type: 0, name: "Repair", cost: 4, description: "Once per item, use your soul's regenerative power to restore some durability" }
var p_early_bird = { id: "early_bird", type: 1, name: "Early Bird", cost: 6, description: "During the day, you conserve energy and suffer a -1 to all stats, but gain a +1 during the night" }
var p_night_owl = { id: "night_owl", type: 1, name: "Night Owl", cost: 6, description: "During the night, you conserve energy and suffer a -1 to all stats, but gain a +1 during the day" }
var p_not_yet = { id: "not_yet", type: 1, name: "Not Yet", cost: 6, description: "You store a reserve of blessed water. Once per revive, defy death and restore half of your heatlh, and send out a blast of water to push enemies away" }
var p_hurricane = { id: "hurricane", type: 0, name: "Hurricane", cost: 10, description: "Create a small hurricane, that sucks in enemies nearby" }
var p_oxygenate = { id: "reoxygenate", type: 0, name: "Re-oxygenate", cost: 6, description: "Filter the air out of your hydration, and use it to refill half of your air" }
var p_electric_eel = { id: "electric_eel", type: 0, name: "Drop Impact", cost: 6, description: "While in water, send electricty out and shock nearby entities." }
var p_revenge_attack = { id: "revenge_attack", type: 0, name: "Kinetic Splash", cost: 0, description: "When active, one hydration is used every time you take damage. Once deactivated, the total amount of hydration used is added to your next attack's damage" }
var p_flood_lockpick = { id: "flood_lockpick", type: 0, name: "Flood Lockpick", cost: 2, description: "Activate, and then interact with a locked object to pick the lock. The percentage picked is based on the sum of Deftness, Aptitude, and Intellect" }
var p_broken_rage = { id: "broken_rage", type: 1, name: "Broken Rage", cost: 4, description: "Whenever a weapon breaks, you gain +1 Deftness and +1 Brawn for 10 seconds." }
var p_lifesteal = { id: "life_steal", type: 0, name: "Water of Life", cost: 2, description: "While active, taking damage instead heals you by half the amount damaged for." }
var p_invisibility = { id: "refraction", type: 0, name: "Refraction", cost: 2, description: "While active, you use water to refract light around you, rendering you invisible" }
var p_conservationist = { id: "conservationist", type: 1, name: "Conservationist", cost: 6, description: "At the cost of losing 6 hydration, all powers cost 50% less." }
var p_ripple_effect = { id: "ripple_effect", type: 0, name: "Ripple Effect", cost: 4, description: "When in water, send out a large ripple, pushing enemies back and slightly damaging them" }
var p_birthday_armor = { id: "birthday_armor", type: 1, name: "Birthday armor", cost: 8, description: "You do +2 damage for each empty slot of armor" }
var p_icicle = { id: "icicle", type: 0, name: "Icicile", cost: 6, description: "If a suitable ceiling is above you by (Deftness*4) blocks or less, form an icicle that you latch on to." }


var d_extra_fall_damage = { id: "extra_fall_damage", cost: 2, name: "Fragile Feet", description: "You take additional damage when you fall" }
var d_bow_malfunction = { id: "bow_malfunction", cost: 2, name: "Frail Fingers", description: "Your grip on the bow string occasionally falters." }
var d_social_anxiety = { id: "social_anxiety", cost: 4, name: "Social Anxiety", description: "-1 to all attributes while in dialog" }
var d_winded = { id: "winded", name: "Winded", cost: 4, description: "Your sprint is slower" }
var d_pescetarian = { id: "pescetarian", cost: 3, name: "Pescetarian", description: "Fish is the only food that restores health and hydration" }
var d_reckless = { id: "reckless", cost: 4, name: "Reckless", description: "You don't hanlde your tools with care. Items take extra durability damage" }
var d_sloth = { id: "sloth", cost: 4, name: "Sloth", description: "Your limbs feel a little heavier. Your attack speed is lowered." }
var d_glass_frame = { id: "glass_frame", cost: 10, name: "Glass Frame", description: "A gust of wind would tear you down. Your grit is always set to 1" }
var d_bouncy = { id: "bouncy", cost: 5, name: "Bouncy", description: "Getting damaged causes additional knockback to you" }
var d_hydrophobic = { id: "hydrophobic", cost: 10, name: "Hydrophobic", description: "Damage caused by drowning is doubled." }
var d_ugly_mug = { id: "ugly_mug", cost: 6, name: "Ugly Mug", description: "Shopkeepers will increase prices." }
var d_vegetarian = { id: "Vegetarian", cost: 8, name: "Vegetarian", description: "Meat based food items provide no healing or hydration" }
var d_dilution = { id: "dilution", cost: 4, name: "Dilution", description: "Item can only have 2 jelly strikes." }
var d_cannibal = { id: "cannibal", cost: 12, name: "Cannibal", description: "If it isn't human flesh, you can't eat it." }
var d_weighed_down = { id: "weighed_down", cost: 7, name: "Weighed Down", description: "Each piece of armor slows you down" }
var d_water_weight = { id: "water_weight", cost: 4, name: "Water Weight", description: "You fall slightly faster" }
var d_uninspiring = { id: "uninspiring", cost: 10, name: "Uninspiring", description: "Your followers just, feel unmotivated around you. Companions have lower health." }



var all_good_perks
var all_bad_perks = [d_extra_fall_damage, d_bow_malfunction, d_social_anxiety, d_winded, d_pescetarian]


function init(e) {

    player = e.player

    //e.player.storeddata.put("selected_bad_perk_array", "[]")
    //e.player.storeddata.put("collected_bad_perk_array", "[]")
    if (e.player.storeddata.get("selected_perk_array") == undefined) {
        e.player.storeddata.put("selected_perk_array", "[]")
        e.player.storeddata.put("collected_perk_array", "[]")
        e.player.storeddata.put("selected_bad_perk_array", "[]")
        e.player.storeddata.put("collected_bad_perk_array", "[]")
    }
    selected_perk_array = JSON.parse(e.player.storeddata.get("selected_perk_array"))
    selected_bad_perk_array = JSON.parse(e.player.storeddata.get("selected_bad_perk_array"))
    collected_perk_array = JSON.parse(e.player.storeddata.get("collected_perk_array"))
    collected_bad_perk_array = JSON.parse(e.player.storeddata.get("collected_bad_perk_array"))

    e.player.storeddata.put("selected_perk_array", JSON.stringify(selected_perk_array))
    e.player.storeddata.put("selected_bad_perk_array", JSON.stringify(selected_bad_perk_array))
    e.player.storeddata.put("collected_perk_array", JSON.stringify(collected_perk_array))
    e.player.storeddata.put("collected_bad_perk_array", JSON.stringify(collected_bad_perk_array))
    setUpVals(e)
    p_companion_buff = { id: "companion_buff", type: 0, name: "Encouragement!", cost: 12 - Math.floor((getScore("Charm") + getScore("Empathy") + getScore("Suggestion"))) / 2, description: "Scream out a battle cry and rally your friends! Give your companions a health boost. The cost is lowered depending on your Heart Skills. Cost: " + String(12 - Math.floor((getScore("Charm") + getScore("Empathy") + getScore("Suggestion")) / 2)) }
    all_good_perks = [p_icicle, p_groundPound, p_dash, p_levitate, p_resurface, p_low_health_damage, p_barter, p_summon, p_companion_buff, p_hurricane, p_blood_cost, p_animal_lover, p_oxygenate, p_electric_eel]
}

function trigger(e) {
    if (e.id == 200) /*Establish Perk Arays*/ {
        selected_perk_array = JSON.parse(player.storeddata.get("selected_perk_array"))
        collected_perk_array = JSON.parse(player.storeddata.get("collected_perk_array"))
        selected_bad_perk_array = JSON.parse(player.storeddata.get("selected_bad_perk_array"))
        collected_bad_perk_array = JSON.parse(player.storeddata.get("collected_bad_perk_array"))
    }
    if (e.id == 210) /*Grant New Perk*/ {
        for (var i = 0; i < all_good_perks.length; i++) {
            if (all_good_perks[i].id == e.arguments[0]) {
                if (!doesNotHavePerk(all_good_perks[i])) {
                    player.message("&eYou have already found this power")
                    return
                }
                collected_perk_array.push(all_good_perks[i])
                player.storeddata.put("collected_perk_array", JSON.stringify(collected_perk_array))
                return
            }
        }
        player.message(e.arguments[0] + " does not exist")
    }
    if (e.id == 220) /*Grant New Bad Perk*/ {
        for (var i = 0; i < all_bad_perks.length; i++) {
            if (all_bad_perks[i].id == e.arguments[0]) {
                if (!doesNotHavePerk(all_bad_perks[i])) {
                    player.message("&5You have already found this dampening perk")
                    return
                }
                collected_bad_perk_array.push(all_bad_perks[i])
                player.storeddata.put("collected_bad_perk_array", JSON.stringify(collected_bad_perk_array))
                return
            }
        }
        player.message(e.arguments[0] + " does not exist or the player already has this perk. No perk was added")
    }
    if (e.id == 20) {
        removeNpcFromArray(e, e.arguments[0])
    }
}

function doesNotHavePerk(perk) {
    for (var i = 0; i < collected_perk_array.length; i++) {
        if (collected_perk_array[i].id == perk.id) {
            return false
        }
    }
    for (var i = 0; i < collected_bad_perk_array.length; i++) {
        if (collected_bad_perk_array[i].id == perk.id) {
            return false
        }
    }
    return true
}

function timer(e) {
    switch (e.id) {
        case SUBTRACT_USING:
            if (getScore("using") > 0) {
                addToScore("perk_power", -1)
                addToScore("using", -1)
            }
            break;
        case GROUNDPOUND_VALIDITY_TIMER:
            if (isGroundPoundValid(e)) {
                activateGroundPound(e)
                e.player.timers.stop(768051)
            }
            break;
        case LEVITATE_TIMER:
            perk_levitate(e, p_levitate.cost)
            break;
        case LEVITATE_DAMAGE_TIMER:
            e.player.removeTag("noLevitateFallDamage")
            break;

        case RESURFACE_TIMER:
            if (isSurfaceValid(e)) {
                applyUpwardMotion(e)
            }
            else {
                stopSurfacing(e)
            }
            break;
        case REMOVE_RESURFACED_TIMER:
            e.player.removeTag("resurfaced")
            break;
        case REHYDRATE_TIMER:
            setScore("restore_hydrate", 0)
            break;
        case DASH_TIMER:
            e.player.removeTag("isDashing")
            //e.player.world.playSoundAt(e.player.pos, "minecraft:weather.rain", .2, 1)
            break;
        case HURRICANE_TIMER:
            e.player.removeTag("hurricaneActive")
            e.player.timers.stop(HURRICANE_TIMER_EFFECT)
            executeCommand("/stopsound @a voice minecraft:item.elytra.flying")
            break;
        case HURRICANE_TIMER_EFFECT:
            hurricaneEffects(e)
            break;
        case ANIMAL_LOVER_TIMER:
            e.player.addFactionPoints(13, -550)
            e.player.addFactionPoints(14, -550)
            e.player.timers.stop(ANIMAL_LOVER_PARTICLE_TIMER)
            executeCommand('/title ' + e.player.name + ' actionbar {"text":"Your pheromones run dry","color":"#CCF84C"}')
            e.player.world.playSoundAt(e.player.pos, "minecraft:entity.mooshroom.milk", .2, 1)
            e.player.world.playSoundAt(e.player.pos, "minecraft:entity.puffer_fish.blow_out", .2, 1)

            break;
        case ANIMAL_LOVER_PARTICLE_TIMER:
            executeCommand("/particle minecraft:dust 0 1 .5 .7 " + e.player.x + " " + (e.player.y + 1) + " " + e.player.z + " .6 .6 .6 .01 20")
            break;
        case OXYGENATE_TIMER:
            e.player.removeTag("oxygenated")
            title(e, "You can oxygenate once more", "blue")
            break;
        case ICICLE_TAG_TIMER:
            if (!e.player.tempdata.has("iciclePos")) {
                e.player.timers.stop(ICICLE_TAG_TIMER)
                e.player.removeTag("onIcicle")

                break;
            }
            if (e.player.pos.distanceTo(e.player.tempdata.get("iciclePos")) <= .8) {
                e.player.addTag("onIcicle")
                e.player.timers.forceStart(ICICLE_TAG_TIMER, 1, true)
                e.player.setMotionY(0)

            }
            if (e.player.hasTag("onIcicle")) {
                if (e.player.isSprinting()) {
                    breakIcicle(e, e.player.tempdata.get("iciclePos"))
                    e.player.knockback(2, e.player.rotation)
                    e.player.timers.start(ICICLE_TAG_TIMER + 1, 1, false)
                    e.player.timers.stop(ICICLE_TAG_TIMER)
                    break;
                }
                if (e.player.isSneaking()) {
                    breakIcicle(e, e.player.tempdata.get("iciclePos"))
                    break;
                }
                if (e.player.pos.distanceTo(e.player.tempdata.get("iciclePos")) > 1.4) {
                    breakIcicle(e, e.player.tempdata.get("iciclePos"))
                }
            }
            break;
        case ICICLE_TAG_TIMER + 1:
            e.player.setMotionY(.3)
            break;
        case ICICLE_TAG_TIMER + 2:
            if (e.player.tempdata.has("iciclePos")) {
                if (e.player.pos.distanceTo(e.player.tempdata.get("iciclePos")) > 1.4) {
                    breakIcicle(e, e.player.tempdata.get("iciclePos"))
                }
            }
    }
}


function attemptToUsePerkPower(e, cost) {
    if (e.player.gamemode == 1) {
        return true
    }
    if (getScore("perk_power") < cost) {
        if (e.player.hasTag("blood_cost")) {
            var cdamage = cost - getScore("perk_power")
            if (getScore("perk_power") > 0) {
                addToScore("using", getScore("perk_power"))
            }
            e.player.damage(cdamage / 2)
            e.player.world.spawnParticle("falling_lava", e.player.x, e.player.y + 1, e.player.z, .3, .4, .3, 1, 200)
            e.player.playSound("upgrade_aquatic:entity.pike.death", 1, 1)
            return true
        }
        displayNotEnoughpower(e, cost)
        return false
    }
    addToScore("using", cost)


    return true
}

function displayNotEnoughpower(e) {
    e.player.world.spawnParticle("supplementaries:air_burst", e.player.x, e.player.y, e.player.z, .4, .2, .4, .07, 8)
    e.player.world.spawnParticle("minecraft:squid_ink", e.player.x, e.player.y, e.player.z, .2, .2, .2, .07, 4)
    e.player.world.playSoundAt(e.player.pos, "minecraft:entity.puffer_fish.sting", .4, 1)
    e.player.world.playSoundAt(e.player.pos, "minecraft:entity.guardian.hurt", .4, 1)
    executeCommand('/title ' + e.player.name + ' actionbar {"text":"Not Enough Water!","bold":true,"italic":true,"color":"#D060A8"}')
}


function keyPressed(e) {
    var keyBinds = JSON.parse(e.player.world.storeddata.get(e.player.name + "keyBindsJSON"))
    if (e.key == 87) { isMovingForward = true }
    if (e.key == 65) { isMovingLeft = true }
    if (e.key == 83) { isMovingBackwards = true }
    if (e.key == 68) { isMovingRight = true }

    if (!e.openGui && e.player.world.storeddata.get(e.player.name + "togglePerks") && getScore("using") == 0) {
        switch (e.key) {
            case keyBinds.key_perk1:
                executePerk(e, 0)
                break;
            case keyBinds.key_perk2:
                executePerk(e, 1)
                break;
            case keyBinds.key_perk3:
                executePerk(e, 2)
                break;
            case keyBinds.key_perk4:
                executePerk(e, 3)
                break;
            case keyBinds.key_perk5:
                executePerk(e, 4)
                break;
        }

    }
}

var isMovingForward = false
var isMovingLeft = false
var isMovingRight = false
var isMovingBackwards = false

function keyReleased(e) {
    var keyBinds = JSON.parse(e.player.world.storeddata.get(e.player.name + "keyBindsJSON"))
    if (e.key == 87) { isMovingForward = false }
    if (e.key == 65) { isMovingLeft = false }
    if (e.key == 83) { isMovingBackwards = false }
    if (e.key == 68) { isMovingRight = false }
    if (!e.openGui && e.player.world.storeddata.get(e.player.name + "togglePerks")) {
        switch (e.key) {
            case keyBinds.key_perk1:
                disablePerk(e, 0)
                break;
            case keyBinds.key_perk2:
                disablePerk(e, 1)
                break;
            case keyBinds.key_perk3:
                disablePerk(e, 2)
                break;
            case keyBinds.key_perk4:
                disablePerk(e, 3)
                break;
            case keyBinds.key_perk5:
                disablePerk(e, 4)
                break;
        }

    }
}

function executePerk(e, index) {
    if (selected_perk_array[index] == undefined) {
        return
    }
    if (getScore("good_perk_debt") > getScore("bad_perk_debt")) {
        executeCommand('/title ' + e.player.name + ' actionbar {"text":"Remnants imbalanced. Add a dampening perk, or remove a power perk","color":"red"}')
        e.player.world.playSoundAt(e.player.pos, "minecraft:entity.guardian.hurt", .4, 1)
        return
    }
    var cost = selected_perk_array[index].cost
    switch (selected_perk_array[index].id) {
        case "groundpound":
            perk_groundPound(e, cost)
            break;
        case "dash":
            perk_dash(e, cost)
            break;
        case "levitate":
            perk_levitate(e, cost)
            e.player.timers.forceStart(LEVITATE_TIMER, 20, true)
            break;
        case "resurface":
            perk_resurface(e, cost)
            break;
        case "barter":
            perk_barter(e, cost)
            break;
        case "summon":
            perk_summon(e, cost)
            break;
        case "companion_buff":
            perk_companion_buff(e, cost)
            break;
        case "hurricane":
            perk_hurricane(e, cost)
            break;
        case "animal_lover":
            perk_animal_lover(e, cost)
            break;
        case "reoxygenate":
            perk_oxygenate(e, cost)
            break;
        case "electric_eel":
            perk_electric_eel(e, cost)
            break;
        case "icicle":
            perk_icicle(e, cost)
            break;
    }
}

function disablePerk(e, index) {
    if (selected_perk_array[index] == undefined) {
        return
    }
    switch (selected_perk_array[index].id) {
        case "levitate":
            executeCommand("/attribute " + e.player.name + " forge:entity_gravity base set 0.08")
            e.player.timers.stop(LEVITATE_TIMER)
            e.player.removeTag("levitating")
            e.player.addTag("noLevitateFallDamage")
            e.player.timers.forceStart(LEVITATE_DAMAGE_TIMER, 8, false)
            executeCommand("stopsound " + e.player.name + " weather minecraft:weather.rain")
            break;
    }
}














function tick(e) {

    if (flyingUp) {
        e.player.world.spawnParticle("minecraft:bubble_pop", e.player.x, e.player.y, e.player.z, .2, .2, .2, .01, 15)
    }
    if (e.player.inWater()) {
        if (e.player.world.getBiomeName(e.player.x, e.player.z) == "minecraft:ocean") {
            perkReplenishingThreshold = 4
        }
        else {
            perkReplenishingThreshold = 2
        }
        currentReplensihingLevel++
        if (currentReplensihingLevel >= perkReplenishingThreshold && getScore("perk_power") < getScore("max_perk_power")) {
            addToScore("perk_power", 1)
            currentReplensihingLevel = 0
            setScore("restore_hydrate", 1)
            e.player.timers.forceStart(REHYDRATE_TIMER, 4, false)
        }
    }


}

function interact(e) {
    if (e.player.hasTag("readyToBarter") && e.type == 1)
        if (e.target.type == 2 && e.target.role.type == 1) {
            attemptToConvince(e)
        }
}

function damaged(e) {

    if (groundPounding) {
        e.setCanceled(true)
        if (e.damageSource.getType() == "fall") {
            activateGroundPound(e)
            if (jumpBoostLevel > -1) {
                e.player.addPotionEffect(8, 25555, jumpBoostLevel, true)
                jumpBoostLevel = -1
            }
        }
        else {
            e.player.setMotionY(.6)
            e.player.timers.forceStart(768050, 1, false)
        }


    }
    if (e.player.hasTag("noLevitateFallDamage") && e.damageSource.type == "fall") {
        e.setCanceled(true)
        return
    }
    if (e.player.hasTag("extra_fall_damage") && !groundPounding && e.damageSource.type == "fall") {
        e.player.damage(1)
        title(e, "Your bones crack", '#E441C3')
    }
}

function damagedEntity(e) {
    if (e.player.hasTag("low_health_damage")) {
        perk_low_health_damage(e)
    }
    if (summoned.length > 0 && e.target.name != "Water Summon") {
        for (var i = 0; i < summoned.length; i++) {
            summoned[i].setAttackTarget(e.target)
        }
    }
}

function rangedLaunched(e) {
    if (e.player.hasTag("bow_malfunction")) {
        if (Math.random() < .25) {
            e.setCanceled(true)
            e.player.playSound("quark:entity.toretoise.hurt", 1, 1)
            title(e, "Your finger slipped!", '#E441C3')
            summonArrowInFrontOfPlayer(e)
            e.player.removeItem("arrow", 1)
        }
    }
}
function summonArrowInFrontOfPlayer(e) {
    var angle = e.player.getRotation()
    var dx = -Math.sin(angle * Math.PI / 180)
    var dz = Math.cos(angle * Math.PI / 180)
    var dy = -Math.tan(e.player.getPitch() / 90)
    var pitch = (90 - (Math.abs(e.player.getPitch()))) * 0.011
    if (dy < 0) {
        dy = 0
    }
    var x = e.player.x + (dx * pitch)
    var y = e.player.y + 1 + dy
    var z = e.player.z + (dz * pitch)
    executeCommand("summon arrow " + x + " " + y + " " + z + " {pickup:1}")
}

function logout(e) {
    if (e.player.tempdata.has("iciclePos")) {
        breakIcicle(e, e.player.tempdata.has("iciclePos"))
    }
}

function died(e) {
    if (e.player.tempdata.has("iciclePos")) {
        breakIcicle(e, e.player.tempdata.has("iciclePos"))
    }

}