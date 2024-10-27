var GUI_STATS
var xPos = [35, 104, 171]
var yPos = [30, 38, 54]

var unsavedChangesMode = false
var statsStringArray = ["Heart", "Body", "Mind"]

load(api.getLevelDir() + "/scripts/ecmascript/player/attributes/perks/perks_gui.js");


function keyPressed(e) {
    var keyBinds = JSON.parse(e.player.storeddata.get("keyBindsJSON"))
    if (e.openGui) return
    if (e.key != keyBinds.key_stats) return
    e.player.tempdata.put("canEditPerks", e.player.gamemode == 1)
    createStatsScreen(e, true)
}

function createStatsScreen(e, withSound) {
    if (!withSound) withSound = false
    if (withSound) e.player.playSound("minecraft:item.book.page_turn", 1, .8)
    _IDS = {
        counter: 1,
        ids: {},
        lookup: {}
    }
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

    e.player.showCustomGui(GUI_STATS)
    e.player.timers.start(id("perkGUIDelay"), 0, false)
}

function returnAttString(val) {
    return "iob:textures/customgui/att_level_" + val + ".png"

}

function createScores(e) {
    var L_Stat = 500
    updateStats(e)
    var x_pos = -1
    for (var i = 0; i < 3; i++) {
        x_pos += 1
        L_Stat++

        var value = getScore(statsStringArray[i] + "Base")
        if (unsavedChangesMode) value = temporary_stat_values[statsStringArray[i]]

        for (var j = 0; j < value; j++) {
            var current_stat_y = yPos[0]
            var current_stat_x = xPos[x_pos]
            if (j >= 5) {
                current_stat_y = yPos[1]
                current_stat_x -= 45
            }
            L_Stat++
            GUI_STATS.addTexturedRect(id("stat_point" + L_Stat), "iob:textures/customgui/attribute_point.png", current_stat_x + (j * 9), current_stat_y, 256, 256).setScale(.031)
        }
        for (var j = value; j < 10; j++) {
            var current_stat_y = yPos[0]
            var current_stat_x = xPos[x_pos]
            if (j >= 5) {
                current_stat_y = yPos[1]
                current_stat_x -= 45
            }
            L_Stat++
            GUI_STATS.addTexturedRect(id("stat_point" + L_Stat), "iob:textures/customgui/perks/empty_slot.png", current_stat_x + (j * 9), current_stat_y, 256, 256).setScale(.031)
        }

        L_Stat++
        if (value < 10) {
            GUI_STATS.addTexturedRect(id("stat_point" + L_Stat), "iob:textures/customgui/numbers.png", xPos[x_pos] + 36, yPos[0] - 10, 25, 25, 25 * (getScore(statsStringArray[i])), 0).setScale(.3)
        }
        else {
            var digit_array = value.toString()

            GUI_STATS.addTexturedRect(id("stat_point" + L_Stat), "iob:textures/customgui/numbers.png", xPos[x_pos] + 38, yPos[0] + 9, 25, 25, 25 * parseInt(digit_array[0]), 0).setScale(.3)
            L_Stat++
            GUI_STATS.addTexturedRect(id("stat_point" + L_Stat), "iob:textures/customgui/numbers.png", xPos[x_pos] + 48, yPos[0] + 9, 25, 25, 25 * parseInt(digit_array[1]), 0).setScale(.3)
        }
    }
    var swim_x = 58
    var swim_y = 60
    for (var swim_speed = 0; swim_speed < getScore("swmspd"); swim_speed++) {
        L_Stat++
        if (swim_speed >= 5) {
            swim_x = 58 - (9 * 5)
            swim_y = 69
        }
        GUI_STATS.addTexturedRect(id("stat_point" + L_Stat), "iob:textures/customgui/aquatic_point.png", swim_x + (swim_speed * 9), swim_y, 256, 256).setScale(.031)
    }
    for (var empty_swim_speed = getScore("swmspd"); empty_swim_speed < 10; empty_swim_speed++) {
        L_Stat++
        if (empty_swim_speed >= 5) {
            swim_x = 58 - (9 * 5)
            swim_y = 69
        }
        GUI_STATS.addTexturedRect(id("stat_point" + L_Stat), "iob:textures/customgui/perks/empty_slot.png", swim_x + (empty_swim_speed * 9), swim_y, 256, 256).setScale(.031)
    }
    var lung_x = 152
    var lung_y = 60
    for (var lung_cap = 0; lung_cap < player.storeddata.get("airDecreaseRate"); lung_cap++) {
        L_Stat++
        if (lung_cap >= 5) {
            lung_x = 152 - (9 * 5)
            lung_y = 69
        }
        GUI_STATS.addTexturedRect(id("stat_point" + L_Stat), "iob:textures/customgui/aquatic_point.png", lung_x + (lung_cap * 9), lung_y, 256, 256).setScale(.031)
    }
    for (var empty_lung_cap = player.storeddata.get("airDecreaseRate"); empty_lung_cap < 10; empty_lung_cap++) {
        L_Stat++
        if (empty_lung_cap >= 5) {
            lung_x = 152 - (9 * 5)
            lung_y = 69
        }
        GUI_STATS.addTexturedRect(id("stat_point" + L_Stat), "iob:textures/customgui/perks/empty_slot.png", lung_x + (empty_lung_cap * 9), lung_y, 256, 256).setScale(.031)
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
    var swimSpeed = 5.612 * (1 + (0.5 * getScore("swmspd")))
    var swimString = swimSpeed.toString()

    var percentage = (player.storeddata.get("totalExperiencePoints") - previousXPThreshold) / (xpThreshold - previousXPThreshold)
    if (player.getExpLevel() < 10) {
        GUI_STATS.addTexturedRect(id("level_number"), "iob:textures/customgui/large_numbers/" + player.getExpLevel() + ".png", 116, 77, 255, 256).setScale(.1)
    }
    else {
        var digit_array = player.getExpLevel().toString()
        GUI_STATS.addTexturedRect(id("level_number"), "iob:textures/customgui/large_numbers/" + digit_array[0] + ".png", 108, 77, 256, 256).setScale(.1)
        GUI_STATS.addTexturedRect(id("level_number2"), "iob:textures/customgui/large_numbers/" + digit_array[1] + ".png", 122, 77, 256, 256).setScale(.1)
    }
    GUI_STATS.addTexturedRect(id("level_bar_empty"), "iob:textures/customgui/empty_level_bar.png", 113, 107, 256, 256).setScale(0.3)
    GUI_STATS.addTexturedRect(id("level_bar"), "iob:textures/customgui/full_level_bar.png", 113, 107, 104 * percentage, 256).setScale(0.3)
    GUI_STATS.addLabel(id("level_bat_hover"), "    ", 206, 60, 25, 10).setHoverText(player.storeddata.get("totalExperiencePoints") + " / " + xpThreshold)


}

var temporary_stat_values = {}

function createUpgradeButtons() {
    var xint = 0
    var yint = 0
    GUI_STATS.addTexturedRect(id("att_points_avail"), "iob:textures/customgui/attribute_points_available.png", -70, 30, 256, 256).setScale(.3)

    if (getScore("AttrPoints") < 10) {
        GUI_STATS.addTexturedRect(id("att_point_num"), "iob:textures/customgui/numbers.png", -40, 42, 25, 25, 25 * getScore("AttrPoints"), 0).setScale(0.5)
    }
    else {
        var digit_array = getScore("AttrPoints").toString()
        GUI_STATS.addTexturedRect(id("att_point_num"), "iob:textures/customgui/numbers.png", -45, 42, 25, 25, 25 * parseInt(digit_array[0]), 0).setScale(0.5)
        GUI_STATS.addTexturedRect(id("att_point_num2"), "iob:textures/customgui/numbers.png", -37, 42, 25, 25, 25 * parseInt(digit_array[1]), 0).setScale(0.5)
    }
    for (var i = 0; i < 3; i++) {
        if (temporary_stat_values[statsStringArray[i]] < 10 && getScore("AttrPoints")) {
            GUI_STATS.addTexturedButton(id("add" + i), '', xPos[xint] + 45, yPos[yint], 8, 8, "iob:textures/customgui/add.png", 0, 8)
        }
        if (temporary_stat_values[statsStringArray[i]] > getScore(statsStringArray[i] + "Base")) {
            GUI_STATS.addTexturedButton(id("subtract" + i) + 1000, '', xPos[xint] + 54, yPos[yint], 8, 8, "iob:textures/customgui/minus.png", 0, 8)
        }
        xint++
    }
    if (unsavedChangesMode) {
        GUI_STATS.addTexturedButton(id("confirm"), "Confirm", -65, 65, 65, 30, "iob:textures/customgui/confirm_changes.png")

    }
}



function attributes_customGuiButton(e) {
    if (e.player.getCustomGui() != GUI_STATS) {
        aquacustomGuiButton(e)
        return
    }

    for (var i = 0; i < 3; i++) {
        if (e.buttonId == id("add" + i)) {
            temporary_stat_values[statsStringArray[i]] += 1
            addToScore("AttrPoints", -1)
            unsavedChangesMode = true
            createStatsScreen(e)

        }
        if (e.buttonId == id("subtract" + i) + 1000) {
            temporary_stat_values[statsStringArray[i]] -= 1
            addToScore("AttrPoints", 1)
            if (getScore("AttrPoints") == e.player.storeddata.get("originalAttPts")) {
                unsavedChangesMode = false
            }

            createStatsScreen(e)

        }
    }
    if (e.buttonId == id("confirm")) {
        e.player.storeddata.put("originalAttPts", 0)
        for (var i = 0; i < 3; i++) {
            setScore(statsStringArray[i] + "Base", temporary_stat_values[statsStringArray[i]])
        }
        temporary_stat_values = {}

        unsavedChangesMode = false
        createStatsScreen(e)
    }
}
