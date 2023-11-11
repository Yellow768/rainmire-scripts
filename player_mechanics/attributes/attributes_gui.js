var GUI_STATS
var statsStringArray = ["Charm", "Empathy", "Suggestion", "Brawn", "Grit", "Deftness", "Intellect", "Perception", "Aptitude"]
var xPos = [18, 100, 180]
var yPos = [42, 62, 84]

function createStatsScreen(e) {
    GUI_STATS = e.API.createCustomGui(id("STATS_GUI"), 256, 256, false, e.player)
    GUI_STATS.setBackgroundTexture("iob:textures/customgui/statsscreen.png")
    createScores(e)
    createValues()
    if (getScore("AttrPoints") > 0) {
        createUpgradeButtons()
    }
    GUI_STATS.addButton(12, "View Perks", 260, 25, 50, 20)
    e.player.showCustomGui(GUI_STATS)
}

function returnAttString(val) {
    return "iob:textures/customgui/att_level_" + val + ".png"

}

function createScores(e) {
    var L_Stat = 0

    updateStats(e)
    GUI_STATS.addTexturedRect(L_Stat + 1, returnAttString(getScore("Charm")), xPos[0], yPos[0], 70, 8)
    GUI_STATS.addTexturedRect(L_Stat + 2, returnAttString(getScore("Empathy")), xPos[0], yPos[1], 70, 8)
    GUI_STATS.addTexturedRect(L_Stat + 3, returnAttString(getScore("Suggestion")), xPos[0], yPos[2], 70, 8)

    GUI_STATS.addTexturedRect(L_Stat + 4, returnAttString(getScore("Brawn")), xPos[1], yPos[0], 70, 8)
    GUI_STATS.addTexturedRect(L_Stat + 5, returnAttString(getScore("Grit")), xPos[1], yPos[1], 70, 8)
    GUI_STATS.addTexturedRect(L_Stat + 6, returnAttString(getScore("Deftness")), xPos[1], yPos[2], 70, 8)

    GUI_STATS.addTexturedRect(L_Stat + 7, returnAttString(getScore("Intellect")), xPos[2], yPos[0], 70, 8)
    GUI_STATS.addTexturedRect(L_Stat + 8, returnAttString(getScore("Perception")), xPos[2], yPos[1], 70, 8)
    GUI_STATS.addTexturedRect(L_Stat + 9, returnAttString(getScore("Aptitude")), xPos[2], yPos[2], 70, 8)

}

function createValues() {
    var xpThreshold = 0
    for (var i = 0; i < player.getExpLevel(); i++) {
        xpThreshold += 50 + ((i) * 50)
    }

    var speedAttribute = (.04 + (getScore("Deftness") * .03)) * 43.1
    var speedString = speedAttribute.toString()

    var swimSpeed = 5.612 * (1 + (0.5 * getScore("swmspd")))
    var swimString = swimSpeed.toString()

    GUI_STATS.addLabel(30, player.getExpLevel(), 45, 113, 1, 1, 16777215)
    GUI_STATS.addLabel(31, player.world.storeddata.get(player.name + "totalExperiencePoints") + "/" + xpThreshold, 45, 133, 1, 1, 16777215)
    GUI_STATS.addLabel(52, getScore("AttrPoints"), 220, 117, 1, 1, 16777215)
    GUI_STATS.addLabel(53, getScore("max_perk_power"), 220, 137, 1, 1, 16777215)



    GUI_STATS.addLabel(500, player.getMaxHealth(), 54, 184, 1, 1, 16777215)
    GUI_STATS.addLabel(401, speedString.substr(0, 4) + " m/s", 58, 204, 1, 1, 16777215)
    GUI_STATS.addLabel(90, -3 + getScore("Brawn") * 2, 58, 224, 1, 1, 16777215)

    GUI_STATS.addLabel(91, (16 / player.storeddata.get("airDecreaseRate")).toFixed(2) + "s", 220, 184, 1, 1, 16777215)
    GUI_STATS.addLabel(92, swimString.substr(0, 4) + " m/s", 220, 204, 1, 1, 16777215)
    GUI_STATS.addLabel(93, 10 * getScore("Aptitude") + "%", 220, 224, 1, 1, 16777215)
}

function createUpgradeButtons() {
    var xint = 0
    var yint = 0
    for (var i = 0; i < 9; i++) {
        if (getScore(statsStringArray[i] + "Base") < 5) {
            GUI_STATS.addTexturedButton(20 + i, '', xPos[xint] + 55, yPos[yint] - 1, 8, 9, "iob:textures/customgui/add.png")
        }
        if (yint < 2) { yint++ }
        else {
            xint++
            yint = 0
        }
    }
}



function customGuiButton(e) {
    if (e.player.getCustomGui() != GUI_STATS) {
        perkGuiButton(e)
        aquacustomGuiButton(e)
        return
    }
    for (var i = 0; i < 9; i++) {
        if (e.buttonId == 20 + i) {
            addToScore(statsStringArray[i] + "Base", 1)
            addToScore("AttrPoints", -1)
            createStatsScreen(e)
        }
    }
    if (e.buttonId == 12) {
        createPerkGui(e, (e.player.gamemode == 1), true)
    }
}