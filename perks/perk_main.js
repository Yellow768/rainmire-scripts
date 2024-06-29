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
var INVISIBILITY_TIMER = 768150
var PERK_VISUAL_FEEDBACK_TIMER = 768040

var doPerks = false
var perkReplenishingThreshold = 5
var currentReplensihingLevel = 0


var selected_powers = {
    0: null,
    1: null,
    2: null,
    3: null,
    4: null
}
var collected_powers = []
var selected_dampeners = {
    0: null,
    1: null,
    2: null,
    3: null,
    4: null
}
var collected_dampeners = []

var player
var reduce = false
var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + "/scripts/ecmascript/boiler/id_generator.js");



/*
Okay, I hate the way this is made, how can we do it better

The collected powers and dampeners can remain in an array
Selected powers should be an object that knows which slot it is.
timers should eval activate a <name_of_perk>_timers function


*/

function init(e) {

    player = e.player


    if (!e.player.storeddata.has("selected_powers")) {
        e.player.storeddata.put("selected_powers", JSON.stringify(selected_powers))
        e.player.storeddata.put("collected_powers", "[]")
        e.player.storeddata.put("selected_dampeners", JSON.stringify(selected_dampeners))
        e.player.storeddata.put("collected_dampeners", "[]")
    }
    selected_powers = JSON.parse(e.player.storeddata.get("selected_powers"))
    selected_dampeners = JSON.parse(e.player.storeddata.get("selected_dampeners"))
    collected_powers = JSON.parse(e.player.storeddata.get("collected_powers"))
    collected_dampeners = JSON.parse(e.player.storeddata.get("collected_dampeners"))

    e.player.storeddata.put("selected_powers", JSON.stringify(selected_powers))
    e.player.storeddata.put("selected_dampeners", JSON.stringify(selected_dampeners))
    e.player.storeddata.put("collected_powers", JSON.stringify(collected_powers))
    e.player.storeddata.put("collected_dampeners", JSON.stringify(collected_dampeners))
    setUpVals(e)
    e.player.timers.forceStart(PERK_VISUAL_FEEDBACK_TIMER, 0, true)

}

function trigger(e) {
    if (e.id == 200) /*Establish Perk Arays*/ {
        selected_powers = JSON.parse(player.storeddata.get("selected_powers"))
        selected_dampeners = JSON.parse(player.storeddata.get("selected_dampeners"))
        collected_powers = JSON.parse(player.storeddata.get("collected_powers"))
        collected_dampeners = JSON.parse(player.storeddata.get("collected_dampeners"))
    }
    if (e.id == 210) /*Grant New Perk*/ {
        if (eval("good_perks." + e.arguments[0]) != undefined) {
            if (collected_powers.indexOf(e.arguments[0]) != -1) {
                player.message("&eYou have already found this power")
                return
            }
            collected_powers.push(e.arguments[0])
            player.storeddata.put("collected_powers", JSON.stringify(collected_powers))
            return
        }
        player.message(e.arguments[0] + " does not exist")
    }


    if (e.id == 220) /*Grant New Bad Perk*/ {
        if (eval("dampening_perks." + e.arguments[0]) != undefined) {
            if (collected_dampeners.indexOf(e.arguments[0]) != -1) {
                player.message("&5You have already found this dampening perk")
                return
            }
            collected_dampeners.push(e.arguments[0])
            player.storeddata.put("collected_dampeners", JSON.stringify(collected_dampeners))
            return

        }
        player.message(e.arguments[0] + " does not exist or the player already has this perk. No perk was added")
    }
    if (e.id == 20) {
        removeNpcFromArray(e, e.arguments[0])
    }
}


function doesNotHavePerk(perk) {
    for (var i = 0; i < collected_powers.length; i++) {
        if (collected_powers[i].id == perk.id) {
            return false
        }
    }
    for (var i = 0; i < collected_dampeners.length; i++) {
        if (collected_dampeners[i].id == perk.id) {
            return false
        }
    }
    return true
}

function timer(e) {
    for (var i = 0; i < Object.keys(selected_powers).length; i++) {
        if (selected_powers[i] != null) {
            eval(selected_powers[i] + "_timers(e)")
        }
    }
    switch (e.id) {
        case PERK_VISUAL_FEEDBACK_TIMER:
            if (getScore("using") > 0) {
                switch (reduce) {
                    case false:
                        reduce = true
                        break;
                    case true:
                        addToScore("perk_power", -1)
                        addToScore("using", -1)
                        reduce = false
                        break;
                }
                if (getScore("using") == 0) {
                    reduce = false
                }
            }

            if (e.player.hasTag("levitating")) {
                e.player.setMotionY(0)
                e.player.world.spawnParticle("falling_water", e.player.x, e.player.y - 2, e.player.z, 0.1, .7, 0.1, 1, 50)
                e.player.world.spawnParticle("bubble_pop", e.player.x, e.player.y, e.player.z, 0.3, .2, 0.3, .01, 100)
                e.player.getMCEntity().f_19789_ = 0
            }
            if (e.player.hasTag("isDashing")) {
                var angle = e.player.getRotation()
                var dx = -Math.sin(angle * Math.PI / 180)
                var dz = Math.cos(angle * Math.PI / 180)
                // e.player.world.spawnParticle("cloud", e.player.x, e.player.y + 1, e.player.z, 0.1, .1, 0.1, .01, 5)
                e.player.world.spawnParticle("bubble_pop", e.player.x - dx, e.player.y + 1, e.player.z - dz, 0.1, .1, 0.1, .01, 50)
                e.player.world.spawnParticle("falling_water", e.player.x - dx, e.player.y + 1, e.player.z - dz, 0.1, .2, 0.1, 1, 5)
            }
            if (e.player.hasTag("onIcicle")) {
                e.player.setMotionY(0)
            }
            break;

        case LEVITATE_TIMER:
            perk_levitate(e, good_perks.levitate.cost)
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
            executeCommand("/particle minecraft:dust 0 1 .5 .7 " + e.player.x + " " + (e.player.y + 1) + " " + e.player.z + " .6 .6 .6 .01 20 force")
            break;
        case OXYGENATE_TIMER:
            e.player.removeTag("oxygenated")
            displayTitle(e, "You can oxygenate once more", "blue")
            break;
        case ICICLE_TAG_TIMER:

            if (!e.player.tempdata.has("iciclePos")) {
                e.player.timers.stop(ICICLE_TAG_TIMER)
                e.player.removeTag("onIcicle")

                break;
            }
            var iciclePos = e.player.tempdata.get("iciclePos")

            var distanceToIcicle = TrueDistanceCoord(e.player.x, e.player.y, e.player.z, iciclePos.x, iciclePos.y, iciclePos.z)
            if (distanceToIcicle <= .8) {
                e.player.addTag("onIcicle")
                e.player.timers.forceStart(ICICLE_TAG_TIMER, 0, true)
                e.player.setMotionY(0)

            }

            if (e.player.hasTag("onIcicle")) {
                if (e.player.isSprinting()) {
                    breakIcicle(e, e.player.tempdata.get("iciclePos"))
                    e.player.knockback(2, e.player.rotation)
                    e.player.timers.start(ICICLE_TAG_TIMER + 1, 0, false)
                    e.player.timers.stop(ICICLE_TAG_TIMER)
                    break;
                }
                if (e.player.isSneaking()) {
                    breakIcicle(e, e.player.tempdata.get("iciclePos"))
                    break;
                }
                if (distanceToIcicle > .8) {
                    breakIcicle(e, e.player.tempdata.get("iciclePos"))
                }
                else {
                    e.player.setMotionY(0)
                }
            }
            break;
        case ICICLE_TAG_TIMER + 1:
            e.player.setMotionY(.3)
            break;
        case ICICLE_TAG_TIMER + 2:
            if (e.player.tempdata.has("iciclePos")) {
                if (distanceToIcicle > .8) {
                    breakIcicle(e, e.player.tempdata.get("iciclePos"))
                }
            }
            break;
        case INVISIBILITY_TIMER:
            perk_invisibility(e, good_perks.invisibility.cost)
            break;
    }
}


function attemptToUseHydration(e, cost) {
    if (e.player.hasTag("conservationist") && getScore("good_perk_debt") >= getScore("bad_perk_debt")) {
        cost = Math.floor(cost / 2)
    }
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
    if (selected_powers[index] == undefined) {
        return
    }
    if (getScore("good_perk_debt") > getScore("bad_perk_debt")) {
        executeCommand('/title ' + e.player.name + ' actionbar {"text":"Remnants imbalanced. Add a dampening perk, or remove a power perk","color":"red"}')
        e.player.world.playSoundAt(e.player.pos, "minecraft:entity.guardian.hurt", .4, 1)
        return
    }
    var cost = eval("good_perks." + selected_powers[index] + ".cost")
    eval("perk_" + good_perks[selected_powers[index]].id + "(e,cost)")
    switch (eval("good_perks." + selected_powers[index] + ".id")) {
        case "levitate":
            perk_levitate(e, cost)
            e.player.timers.forceStart(LEVITATE_TIMER, 20, true)
            break;
        case "revenge_attack":
            e.player.addTag("collectingRevenge")
            displayTitle(e, "Collecting Backsplash", 'blue')
            e.player.world.playSoundAt(e.player.pos, "minecraft:item.bucket.fill_lava", 1, 1.4)
            break;
        case "lifesteal":
            switch (e.player.hasTag("lifesteal")) {
                case true:
                    e.player.removeTag("lifesteal")
                    displayTitle(e, "Attacks returned to normal", 'red')
                    break;
                case false:
                    e.player.addTag("lifesteal")
                    displayTitle(e, "Siphon their blood!", 'red')
                    break;
            }
            break;
    }
}



function disablePerk(e, index) {
    if (selected_powers[index] == undefined) {
        return
    }
    switch (eval("good_perks." + selected_powers[index] + ".id")) {
        case "levitate":
            executeCommand("/attribute " + e.player.name + " forge:entity_gravity base set 0.08")
            e.player.timers.stop(LEVITATE_TIMER)
            e.player.removeTag("levitating")
            e.player.addTag("noLevitateFallDamage")
            e.player.timers.forceStart(LEVITATE_DAMAGE_TIMER, 8, false)
            executeCommand("stopsound " + e.player.name + " weather minecraft:weather.rain")
            break;
        case "refraction":
            if (!e.player.hasTag("refracting")) {
                return
            }
            e.player.timers.stop(INVISIBILITY_TIMER)
            e.player.world.spawnParticle("falling_water", e.player.x, e.player.y + 1, e.player.z, .3, .5, .3, .01, 5000)
            e.player.removeTag("refracting")
            executeCommand("/effect clear " + e.player.name + " minecraft:invisibility")
            e.player.world.playSoundAt(e.player.pos, "minecraft:ambient.underwater.exit", 1, .7)
            break;
        case "revenge_attack":
            e.player.removeTag("collectingRevenge")
            break;
    }
}














function tick(e) {

    if (flyingUp) {
        e.player.world.spawnParticle("minecraft:bubble_pop", e.player.x, e.player.y, e.player.z, .2, .2, .2, .01, 15)
    }
    if (e.player.inWater()) {
        if (e.player.world.getBiomeName(e.player.x, e.player.z) == "minecraft:ocean") {
            perkReplenishingThreshold = 2
        }
        else {
            perkReplenishingThreshold = 0
        }
        currentReplensihingLevel++
        if (currentReplensihingLevel >= perkReplenishingThreshold && getScore("perk_power") < getScore("max_perk_power")) {
            addToScore("perk_power", 1)
            currentReplensihingLevel = 0
            setScore("restore_hydrate", 1)
            e.player.timers.forceStart(REHYDRATE_TIMER, 4, false)
        }
    }
    if (e.player.hasTag("collectingRevenge")) {
        e.player.world.spawnParticle("upgrade_aquatic:blue_jelly_blob", e.player.x, e.player.y + 1, e.player.z, .2, .4, .2, .0002, 10)
    }
    checkEarlyBird(e)
    checkNightOwl(e)
}



function interact(e) {
    if (e.player.hasTag("readyToBarter") && e.type == 1)
        if (e.target.type == 2 && e.target.role.type == 1) {
            attemptToConvince(e)
        }
}

function damaged(e) {
    if (e.player.hasTag("noLevitateFallDamage") && e.damageSource.type == "fall") {
        e.setCanceled(true)
        return
    }
    if (e.damageSource.type == "fall") {
        if (e.player.getMCEntity().f_19789_ < 6) { e.player.tempdata.put("cancelFallDamage", true); e.setCanceled(true); e.API.executeCommand(e.player.world, "/stopsound " + e.player.name + " player minecraft:entity.player.hurt") }

        if (e.player.hasTag("extra_fall_damage") && !groundPounding) {
            e.player.damage(2)
            displayTitle(e, "Your bones crack", '#E441C3')
        }
    }
    if (e.player.hasTag("bouncy")) {
        e.player.knockback(1, e.player.rotation)
    }
    perk_revenge_attack(e, 1)
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
    perk_revenge_attack_damage(e)
    var weapon = e.player.getMainhandItem()

    if (weapon.isDamageable() && weapon.getDamage() >= weapon.getMaxDamage() - 1) {
        if (e.player.hasTag("broken_rage")) {
            e.player.addPotionEffect(3, 10, 1, false)
            e.player.addPotionEffect(5, 10, 1, false)
            e.player.addPotionEffect(1, 10, 1, false)
            e.player.world.playSoundAt(e.player.pos, "minecraft:entity.ender_dragon.growl", 1, .5)
        }
    }
    if (e.player.hasTag("lifesteal")) {
        perk_lifesteal(e)
    }
    if (e.player.hasTag("birthday_armor") && getScore("good_perk_debt") >= getScore("bad_perk_debt")) {
        for (var i = 0; i < 3; i++) {
            if (e.player.getArmor(i).name == "minecraft:air") {
                e.damage += 2
            }
        }
    }
}

function rangedLaunched(e) {
    if (e.player.hasTag("bow_malfunction")) {
        if (Math.random() < .25) {
            e.setCanceled(true)
            e.player.playSound("quark:entity.toretoise.hurt", 1, 1)
            displayTitle(e, "Your finger slipped!", '#E441C3')
            summonArrowInFrontOfPlayer(e)
            e.player.removeItem("arrow", 1)
        }
    }
    if (e.player.hasTag("perfectAimActive")) perfect_aim_ranged_launched(e)

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

function TrueDistanceCoord(x1, y1, z1, x2, y2, z2) {
    var dx = x1 - x2
    var dy = y1 - y2
    var dz = z1 - z2
    var R = Math.pow((dx * dx + dy * dy + dz * dz), 0.5)
    return R;
}