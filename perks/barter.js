

function perk_barter(e, cost) {

    switch (e.player.hasTag("readyToBarter")) {
        case true:
            e.player.removeTag("readyToBarter")
            addToScore("perk_power", cost)
            e.player.message("Bartering turned off")
            e.player.world.playSoundAt(e.player.pos, "minecraft:block.beehive.exit", 1, 1)


            break;
        case false:
            if (!attemptToUseHydration(e, cost)) {
                return
            }
            e.player.addTag("readyToBarter")
            e.player.message("&dReady to barter")
            e.player.world.playSoundAt(e.player.pos, "minecraft:entity.witch.drink", 1, 1)
            break;
    }

}


function attemptToConvince(e) {
    e.setCanceled(true)
    if (e.target.getPotionEffect(31) == 1 && !e.target.hasTag("hasBeenBartered")) {
        e.player.message("&bThis trader is still immune to your perk")
        return
    }
    if (e.target.hasTag("hasBeenBartered")) {
        e.player.message("&bThis trader has already been affected")
        return
    }


    var charmChance = Math.floor(Math.random() * 100)
    var suggestionChance = Math.floor(Math.random() * 100)
    var buffAmount = 5
    var charmResult = false
    var suggestionResult = false
    var resultSentence = ''


    if (charmChance < getScore("Charm") * 25) {
        charmResult = true
    }
    if (suggestionChance < getScore("Suggestion") * 20) {
        suggestionResult = true
    }


    var resultChance = Math.random() * 50
    var empathyChance = Math.random() * 100
    resultChance += getScore("Empathy") * 5
    if (empathyChance < getScore("Empathy") * 20) {
        resultChance *= 2
    }
    if (resultChance < 100) {
        buffAmount = 5
    }
    if (resultChance < 85) {
        buffAmount = 4
    }
    if (resultChance < 70) {
        buffAmount = 3
    }
    if (resultChance < 55) {
        buffAmount = 2
    }
    if (resultChance < 40) {
        buffAmount = 1
    }

    if (charmResult) {
        resultSentence += "&cCharmed! &rThis trader will give you &l" + buffAmount + "&r extra item(s)"
        if (suggestionResult) {
            resultSentence += " + "
        }
        succesful(e)
    }
    if (suggestionResult) {

        resultSentence += "&cConvinced!&r This trader's prices are lowered by &l" + buffAmount * 10 + "&r percent"
        succesful(e)


    }
    if (!charmResult && !suggestionResult) {
        resultSentence = "&bYour heart skills could not convince this trader. They are immune to your perk for 5 minutes."
        e.target.executeCommand("/particle minecraft:squid_ink ~ ~1 ~ .5 .5 .5 .05 6")
        e.player.world.playSoundAt(e.player.pos, "minecraft:entity.guardian.hurt", 1, 1)
        e.target.addPotionEffect(31, 300, 1, true)
    }
    e.player.message(resultSentence)
    e.target.trigger(50, [charmResult, suggestionResult, buffAmount])
    e.player.removeTag("readyToBarter")




}


function succesful(e) {
    e.target.executeCommand("/particle minecraft:happy_villager ~ ~1 ~ .5 .5 .5 .1 10")
    e.target.executeCommand("/particle minecraft:falling_water ~ ~1 ~ .5 .5 .5 .005 100")
    e.player.world.playSoundAt(e.player.pos, "minecraft:item.trident.return", 1, 1)
    e.player.world.playSoundAt(e.player.pos, "minecraft:entity.dolphin.splash", 1, 1)
    e.target.addTag("hasBeenBartered")
}