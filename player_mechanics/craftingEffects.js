
function isItemValidForJelly(e, item) {

    if (item.type == 4 || item.name == "minecraft:bow" || item.displayName.indexOf("Bomb") != -1 || item.name == "minecraft:crossbow") {
        return true
    }
    e.player.message("&eNot a valid item")
    return false
}

function colorCode(type) {
    var symbol = "r"
    switch (type) {
        case "Paralyzing ":
            symbol = "e"
            break;
        case "Flammable ":
            symbol = "c"
            break;
        case "Panicking ":
            symbol = "d"
            break;

    }
    return symbol
}


function applyJellyLore(e, item, type, amount) {
    var effectLore = "§" + colorCode(type) + "" + amount + " " + type + "Strikes"
    var currentLore = item.getLore()
    var newLore = []
    var nbt = item.getNbt()
    if (amount == 0) {
        var newI = 0
        for (var i = 0; i < currentLore.length; i++) {
            if (currentLore[i].indexOf(type) == -1) {
                newLore[newI] = currentLore[i]
                newI++
            }
        }
        currentLore = newLore
    }
    else if (nbt.getInteger(type) != 0 && nbt.getInteger(type) != undefined) {
        for (var i = 0; i < currentLore.length; i++) {
            if (currentLore[i].indexOf(type) != -1) {
                currentLore[i] = effectLore
            }
        }
    }

    else {
        newLore[0] = effectLore
        for (var i = 0; i < currentLore.length; i++) {
            newLore[i + 1] = currentLore[i]
        }
        currentLore = newLore
    }

    item.setLore(currentLore)
}


function produceJellyParticles(e, type, pos, amount) {
    var angle = e.player.getRotation()
    var dx = -Math.sin(angle * Math.PI / 180)
    var dz = Math.cos(angle * Math.PI / 180)
    var dy = -Math.tan(e.player.getPitch() / 90)
    var pitch = (90 - (Math.abs(e.player.getPitch()))) * 0.011
    if (dy < 0) {
        dy = 0
    }
    var color
    if (type == "Paralyzing ") { color = "yellow" }
    if (type == "Panicking ") { color = "purple" }
    if (type == "Flammable ") { color = "red" }
    e.player.world.spawnParticle("upgrade_aquatic:" + color + "_jelly_blob", e.player.x + (dx * pitch), e.player.y + 1.5 + dy, e.player.z + (dz * pitch), .2, .2, .2, 0.02, 30)
}


function applyJelly(e, item) {
    if (isItemValidForJelly(e, item)) {
        var amount = 5
        if (e.player.hasTag("dilution")) {
            amount = 2
        }
        var offItem = e.player.getOffhandItem().getDisplayName()
        var index = offItem.indexOf("Jelly")
        var type = e.player.getOffhandItem().getDisplayName().substr(0, index)
        if (item.displayName.indexOf("Bomb") == -1) {
            applyJellyLore(e, item, type, amount)
            item.nbt.setInteger(type, amount)
            e.player.message("&" + colorCode(type) + type + "Jelly &rapplied to your weapon")

            item.setDamage(item.getDamage() + 1)

            e.player.world.playSoundAt(e.player.pos, "minecraft:block.honey_block.fall", 1, 1)
        }
        else {
            applyJellyToBomb(e, type)
        }

    }
    e.player.removeItem(e.player.getOffhandItem(), 1)
    produceJellyParticles(e, type, e.player.pos, 10)
}

function applyJellyToBomb(e, type) {

    var heldBomb = e.player.getMainhandItem()
    if (heldBomb.displayName.indexOf(type) != -1) {
        e.player.message("Jelly already applied to this bomb")
        return
    }
    var jelliedBomb = e.player.world.createItemFromNbt(heldBomb.getItemNbt())
    jelliedBomb.nbt.setInteger(type, 1)
    jelliedBomb.setStackSize(1)
    heldBomb.setStackSize(heldBomb.getStackSize() - 1)
    e.player.setMainhandItem(heldBomb)
    jelliedBomb.setCustomName("§" + colorCode(type) + type + "§f" + jelliedBomb.displayName)
    jelliedBomb.setStackSize(1)
    e.player.giveItem(jelliedBomb)
    e.player.message("&" + colorCode(type) + type + "Jelly &rapplied to your bomb")
    e.player.world.playSoundAt(e.player.pos, "minecraft:block.honey_block.fall", 1, 1)
}

function applyJellyToWaterSummon(e) {
    var jelly = e.player.getMainhandItem().getDisplayName()
    var index = jelly.indexOf("Jelly")
    var type = e.player.getMainhandItem().getDisplayName().substr(0, index)
    e.player.message(type)
    if (type == "Paralyzing ") {
        applyStatusEffect(e, e.target, 1)
    }
    if (type == "Panicking ") {
        applyStatusEffect(e, e.target, 2)
    }

}

function checkForJellyEffect(e, target, type, removeDurability) {

    if (target.getInteger(type) > 0) {
        target.setInteger(type, target.getInteger(type) - 1)

        if (removeDurability) {
            applyJellyLore(e, e.player.getMainhandItem(), type, target.getInteger(type))
        }
        return true
    }
    return false
}

var arrowTracked = false

function applyEffectToArrow(e) {
    arrowTracked = false
    var nearbyArrows = e.player.world.getNearbyEntities(e.player.pos, 12, 10)
    var trackedArrows = []
    if (nearbyArrows.length > 0) {
        for (var i = 0; i < nearbyArrows.length; i++) {
            if (!nearbyArrows[i].hasTag("alreadyFired")) {
                nearbyArrows[i].addTag("alreadyFired")
                trackedArrows.push(nearbyArrows[i])
                arrowTracked = true
            }
        }
    }
    if (trackedArrows.length < 1) {
        return
    }

    if (checkForJellyEffect(e, e.player.getMainhandItem().nbt, "Flammable ", true)) {
        for (var curarrow = 0; curarrow < trackedArrows.length; curarrow++) {
            trackedArrows[curarrow].nbt.setInteger("Flammable ", 1)
        }
    }
    if (checkForJellyEffect(e, e.player.getMainhandItem().nbt, "Paralyzing ", true)) {
        for (var curarrow = 0; curarrow < trackedArrows.length; curarrow++) {
            trackedArrows[curarrow].nbt.setInteger("Paralyzing ", 1)
        }
    }
    if (checkForJellyEffect(e, e.player.getMainhandItem().nbt, "Panicking ", true)) {
        for (var curarrow = 0; curarrow < trackedArrows.length; curarrow++) {
            trackedArrows[curarrow].nbt.setInteger("Panicking ", 1)
        }
    }
}




function rangedLaunched(e) {

    e.player.timers.forceStart(900, 2, false)

}


function applyStatusToTarget(e) {
    var nbt
    var doDurability = false
    if (e.target.type != 2) {
        return
    }
    if (e.damageSource.isProjectile()) {
        var arrow = e.damageSource.getImmediateSource()
        nbt = arrow.nbt
        if (!arrowTracked) {
            nbt = e.player.getMainhandItem().nbt
            doDurability = true

        }
    }
    if (!e.damageSource.isProjectile()) {
        nbt = e.player.getMainhandItem().nbt
        doDurability = true
    }

    if (checkForJellyEffect(e, nbt, "Flammable ", doDurability)) {
        applyStatusEffect(e, e.target, 3, 100)
    }
    if (checkForJellyEffect(e, nbt, "Paralyzing ", doDurability)) {
        applyStatusEffect(e, e.target, 1, 100)
        e.damage *= .75

    }
    if (checkForJellyEffect(e, nbt, "Panicking ", doDurability)) {
        applyStatusEffect(e, e.target, 2, 100)
    }
}


function craftingTriggers(e) {
    if (e.id == 10) {
        applyStatusEffect(e.arguments[0], e.arguments[1], e.arguments[2], e.arguments[3])
    }
    if (e.id == 510105) {
        applyEffectToPlayer(e.arguments[0], e.arguments[1])
    }
}


function applyStatusEffect(e, target, type, length) {

    var statusNPC
    if (target.storeddata.get("hasStatusEffect") == 1) {
        var nE = player.world.getNearbyEntities(player.pos, 100, 2)
        for (var i = 0; i < nE.length; i++) {
            if (nE[i].storeddata.get("uuid") == target.getUUID()) {
                statusNPC = nE[i]
            }
        }
    }
    else {
        statusNPC = e.API.clones.spawn(target.x, target.y, target.z, 9, "Status NPC", target.world)
    }

    statusNPC.trigger(type, [target, length])
    player.getMainhandItem().setDamage(player.getMainhandItem().getDamage() + 2)
}



function applyEffectToPlayer(type, length) {
    switch (type) {
        case 1:
            if (!player.hasTag("paralyzed")) {
                player.addTag("paralyzed")
                player.addPotionEffect(18, length / 20, 1, true)
            }
            player.timers.forceStart(510001, length, false)
            executeCommand('/title ' + player.name + ' actionbar {"text":"' + "Paralyzed!" + '","color":"' + "yellow" + '"}')
            break;
    }
}