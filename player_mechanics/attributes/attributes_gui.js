var GUI_STATS
var statsStringArray = ["Charm", "Empathy", "Suggestion", "Grit", "Brawn", "Deftness", "Logic", "Perception", "Knowledge"]
var xPos = [16, 79, 142]
var yPos = [15, 35, 54]

var unsavedChangesMode = false

function createStatsScreen(e) {
    GUI_STATS = e.API.createCustomGui(id("STATS_GUI"), 256, 256, false, e.player)
    GUI_STATS.setBackgroundTexture("iob:textures/customgui/statsscreen.png")
    createScores(e)
    createValues()
    if (getScore("AttrPoints") > 0 || unsavedChangesMode) {
        if (!unsavedChangesMode) {
            for (var i = 0; i < statsStringArray.length; i++) {
                temporary_stat_values[statsStringArray[i]] = getScore(statsStringArray[i] + "Base")
                e.player.storeddata.put("originalAttPts", getScore("AttrPoints"))
            }
        }
        createUpgradeButtons()
    }
    GUI_STATS.addButton(12, "View Perks", 260, 25, 50, 20)
    for (var i = 0; i < 5; i++) {
        GUI_STATS.addTexturedRect(104 + i, "iob:textures/customgui/perks/good/barter.png", 15, 135 + (i * 22), 256, 256).setScale(.070)
        GUI_STATS.addButton(204 + i, "", 18, 138 + (i * 22), 12, 12).setHoverText("Guess I'm OOGLI goo")
    }
    for (var i = 0; i < 5; i++) {
        GUI_STATS.addTexturedRect(350 + i, "iob:textures/customgui/perks/empty_active_slot.png", 100, 135 + (i * 22), 256, 256).setScale(.070)
    }
    for (var i = 0; i < 5; i++) {
        GUI_STATS.addTexturedRect(360 + i, "iob:textures/customgui/perks/empty_dampener_active_slot.png", 130, 135 + (i * 22), 256, 256).setScale(.070)
    }
    e.player.showCustomGui(GUI_STATS)
    e.player.playSound("minecraft:item.book.page_turn", 1, .8)
}

function returnAttString(val) {
    return "iob:textures/customgui/att_level_" + val + ".png"

}

function createScores(e) {
    var L_Stat = 500

    updateStats(e)
    var x_pos = -1
    var y_pos = 0
    for (var i = 0; i < 9; i++) {
        if (i % 3 == 0) {
            y_pos = 0
            x_pos += 1
        }
        L_Stat++

        var value = getScore(statsStringArray[i] + "Base")
        if (unsavedChangesMode) value = temporary_stat_values[statsStringArray[i]]

        for (var j = 0; j < value; j++) {
            L_Stat++
            GUI_STATS.addTexturedRect(L_Stat, "iob:textures/customgui/attribute_point.png", xPos[x_pos] + (j * 9), yPos[y_pos], 256, 256).setScale(.031)
        }
        for (var j = value; j < 5; j++) {
            L_Stat++
            GUI_STATS.addTexturedRect(L_Stat, "iob:textures/customgui/perks/empty_slot.png", xPos[x_pos] + (j * 9), yPos[y_pos], 256, 256).setScale(.031)
        }

        L_Stat++
        if (value < 10) {
            GUI_STATS.addTexturedRect(L_Stat, "iob:textures/customgui/numbers.png", xPos[x_pos] + 45, yPos[y_pos] + 9, 25, 25, 25 * (getScore(statsStringArray[i])), 0).setScale(.3)
        }
        else {
            var digit_array = value.toString()
            GUI_STATS.addTexturedRect(L_Stat, "iob:textures/customgui/numbers.png", xPos[x_pos] + 38, yPos[y_pos] + 9, 25, 25, 25 * parseInt(digit_array[0]), 0).setScale(.3)
            L_Stat++
            GUI_STATS.addTexturedRect(L_Stat, "iob:textures/customgui/numbers.png", xPos[x_pos] + 48, yPos[y_pos] + 9, 25, 25, 25 * parseInt(digit_array[1]), 0).setScale(.3)
        }



        y_pos += 1
    }
    var swim_x = 66
    var swim_y = 97
    for (var swim_speed = 0; swim_speed < getScore("swmspd"); swim_speed++) {
        L_Stat++
        if (swim_speed >= 5) {
            swim_x = 66 - (9 * 5)
            swim_y = 87
        }
        GUI_STATS.addTexturedRect(L_Stat, "iob:textures/customgui/aquatic_point.png", swim_x + (swim_speed * 9), swim_y, 256, 256).setScale(.031)
    }
    for (var empty_swim_speed = getScore("swmspd"); empty_swim_speed < 10; empty_swim_speed++) {
        L_Stat++
        if (empty_swim_speed >= 5) {
            swim_x = 66 - (9 * 5)
            swim_y = 87
        }
        GUI_STATS.addTexturedRect(L_Stat, "iob:textures/customgui/perks/empty_slot.png", swim_x + (empty_swim_speed * 9), swim_y, 256, 256).setScale(.031)
    }
    var lung_x = 145
    var lung_y = 97
    for (var lung_cap = 0; lung_cap < player.storeddata.get("airDecreaseRate"); lung_cap++) {
        L_Stat++
        if (lung_cap >= 5) {
            lung_x = 145 - (9 * 5)
            lung_y = 87
        }
        GUI_STATS.addTexturedRect(L_Stat, "iob:textures/customgui/aquatic_point.png", lung_x + (lung_cap * 9), lung_y, 256, 256).setScale(.031)
    }
    for (var empty_lung_cap = player.storeddata.get("airDecreaseRate"); empty_lung_cap < 10; empty_lung_cap++) {
        L_Stat++
        if (empty_lung_cap >= 5) {
            lung_x = 145 - (9 * 5)
            lung_y = 87
        }
        GUI_STATS.addTexturedRect(L_Stat, "iob:textures/customgui/perks/empty_slot.png", lung_x + (empty_lung_cap * 9), lung_y, 256, 256).setScale(.031)
    }
}

function createValues() {
    var xpThreshold = 0
    var previousXPThreshold = 0
    for (var i = 0; i < player.getExpLevel(); i++) {
        xpThreshold += 50 + ((i) * 50)
        if (i != 0) {
            previousXPThreshold += 50 + ((i - 1) * 50)
        }
    }

    var speedAttribute = (.04 + (getScore("Deftness") * .03)) * 43.1
    var speedString = speedAttribute.toString()

    var swimSpeed = 5.612 * (1 + (0.5 * getScore("swmspd")))
    var swimString = swimSpeed.toString()

    var percentage = (player.storeddata.get("totalExperiencePoints") - previousXPThreshold) / (xpThreshold - previousXPThreshold)
    if (player.getExpLevel() < 10) {
        GUI_STATS.addTexturedRect(200, "iob:textures/customgui/numbers.png", 207, 28, 25, 25, 25 * player.getExpLevel(), 0)
    }
    else {
        var digit_array = player.getExpLevel().toString()
        GUI_STATS.addTexturedRect(200, "iob:textures/customgui/numbers.png", 203, 28, 25, 25, 25 * parseInt(digit_array[0]), 0)
        GUI_STATS.addTexturedRect(256, "iob:textures/customgui/numbers.png", 213, 28, 25, 25, 25 * parseInt(digit_array[1]), 0)
    }
    GUI_STATS.addTexturedRect(201, "iob:textures/customgui/empty_level_bar.png", 205, 65, 256, 256).setScale(0.3)
    GUI_STATS.addTexturedRect(202, "iob:textures/customgui/full_level_bar.png", 205, 65, 104 * percentage, 256).setScale(0.3)
    GUI_STATS.addLabel(203, "    ", 206, 60, 25, 10).setHoverText(player.storeddata.get("totalExperiencePoints") + " / " + xpThreshold)


}

var temporary_stat_values = {}

function createUpgradeButtons() {
    var xint = 0
    var yint = 0
    GUI_STATS.addTexturedRect(900, "iob:textures/customgui/attribute_points_available.png", -70, 30, 256, 256).setScale(.3)

    if (getScore("AttrPoints") < 10) {
        GUI_STATS.addTexturedRect(901, "iob:textures/customgui/numbers.png", -40, 42, 25, 25, 25 * getScore("AttrPoints"), 0).setScale(0.5)
    }
    else {
        var digit_array = getScore("AttrPoints").toString()
        GUI_STATS.addTexturedRect(901, "iob:textures/customgui/numbers.png", -45, 42, 25, 25, 25 * parseInt(digit_array[0]), 0).setScale(0.5)
        GUI_STATS.addTexturedRect(906, "iob:textures/customgui/numbers.png", -37, 42, 25, 25, 25 * parseInt(digit_array[1]), 0).setScale(0.5)
    }
    for (var i = 0; i < 9; i++) {
        if (temporary_stat_values[statsStringArray[i]] < 5 && getScore("AttrPoints")) {
            GUI_STATS.addTexturedButton(20 + i, '', xPos[xint] + 45, yPos[yint], 8, 8, "iob:textures/customgui/add.png", 0, 0)
        }
        if (temporary_stat_values[statsStringArray[i]] > getScore(statsStringArray[i] + "Base")) {
            GUI_STATS.addTexturedButton(30 + i, '', xPos[xint] + 54, yPos[yint], 8, 8, "iob:textures/customgui/minus.png", 0, 0)
        }
        if (yint < 2) { yint++ }
        else {
            xint++
            yint = 0
        }
    }
    if (unsavedChangesMode) {
        GUI_STATS.addButton(902, "Confirm Changes", -70, 60, 40, 20)
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
            temporary_stat_values[statsStringArray[i]] += 1
            addToScore("AttrPoints", -1)
            unsavedChangesMode = true
            createStatsScreen(e)
        }
        if (e.buttonId == 30 + i) {
            temporary_stat_values[statsStringArray[i]] -= 1
            addToScore("AttrPoints", 1)
            if (getScore("AttrPoints") == e.player.storeddata.get("originalAttPts")) {
                unsavedChangesMode = false
            }

            createStatsScreen(e)

        }
    }
    if (e.buttonId == 902) {
        e.player.storeddata.put("originalAttPts", 0)
        for (var i = 0; i < 9; i++) {
            setScore(statsStringArray[i] + "Base", temporary_stat_values[statsStringArray[i]])
        }
        temporary_stat_values = {}

        unsavedChangesMode = false
        createStatsScreen(e)
    }
    if (e.buttonId == 12) {
        createPerkGui(e, (e.player.gamemode == 1), true)
    }
}
