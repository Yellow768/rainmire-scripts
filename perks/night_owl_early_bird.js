function checkNightOwl(e) {
    if (!e.player.hasTag("night_owl") || getScore("good_perk_debt") > getScore("bad_perk_debt")) {
        if (e.player.hasTag("nightOwlBoost")) {
            negativeModifier(e)
            e.player.removeTag("nightOwlBoost")
        }
        if (e.player.hasTag("nightOwlNerf")) {
            positiveModifier(e)
            e.player.removeTag("nightOwlNerf")
        }
    }
    if (e.player.hasTag("night_owl")) {
        if (getScore("good_perk_debt") > getScore("bad_perk_debt")) {
            return
        }
        if (e.player.world.isDay()) {
            if (e.player.hasTag("nightOwlBoost")) {
                negativeModifier(e)
                e.player.removeTag("nightOwlBoost")
            }
            if (!e.player.hasTag("nightOwlNerf")) {
                negativeModifier(e)
                e.player.addTag("nightOwlNerf")
                e.player.message("&cThe sunlight drains you")
            }
        }

        else {
            if (!e.player.hasTag("nightOwlBoost")) {
                positiveModifier(e)
                e.player.addTag("nightOwlBoost")
                e.player.message("&bThe moon light fills you with energy")
            }
            if (e.player.hasTag("nightOwlNerf")) {
                positiveModifier(e)
                e.player.removeTag("nightOwlNerf")
            }
        }
    }


}

function checkEarlyBird(e) {
    if (!e.player.hasTag("early_bird") || getScore("good_perk_debt") > getScore("bad_perk_debt")) {
        if (e.player.hasTag("earlyBirdBoost")) {
            negativeModifier(e)
            e.player.removeTag("earlyBirdBoost")
        }
        if (e.player.hasTag("earlyBirdNerf")) {
            positiveModifier(e)
            e.player.removeTag("earlyBirdNerf")
        }
    }
    if (e.player.hasTag("early_bird")) {
        if (getScore("good_perk_debt") > getScore("bad_perk_debt")) {
            return
        }
        if (!e.player.world.isDay()) {
            if (e.player.hasTag("earlyBirdBoost")) {
                negativeModifier(e)
                e.player.removeTag("earlyBirdBoost")
                e.player.message("&cThe moonlight drains you")
            }
            if (!e.player.hasTag("earlyBirdNerf")) {
                negativeModifier(e)
                e.player.addTag("earlyBirdNerf")
            }
        }
        else {
            if (!e.player.hasTag("earlyBirdBoost")) {
                positiveModifier(e)
                e.player.addTag("earlyBirdBoost")
                e.player.message("&aThe sunlight fills you with energy")
            }
            if (e.player.hasTag("earlyBirdNerf")) {
                positiveModifier(e)
                e.player.removeTag("earlyBirdNerf")
            }
        }
    }


}




function negativeModifier(e) {
    var statsStringArray = ["Charm", "Empathy", "Suggestion", "Brawn", "Grit", "Deftness", "Logic", "Perception", "Knowledge"]
    for (var stat in statsStringArray) {
        addToScore(statsStringArray[stat] + "Mod", -1)
    }
}

function positiveModifier(e) {
    var statsStringArray = ["Charm", "Empathy", "Suggestion", "Brawn", "Grit", "Deftness", "Logic", "Perception", "Knowledge"]
    for (var stat in statsStringArray) {
        addToScore(statsStringArray[stat] + "Mod", 1)
    }
}