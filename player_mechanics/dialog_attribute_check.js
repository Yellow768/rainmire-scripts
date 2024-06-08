var original_text
var check_dialog_id
var original_roll_id

var in_skillcheck_mode = false
var all_bonuses = 0
var attribute_paramaters
var attributeColorsDict = {
    "Empathy": "&c",
    "Suggestion": "&c",
    "Charm": "&c",
    "Deftness": "&e",
    "Grit": "&e",
    "Brawn": "&e",
    "Logic": "&b",
    "Perception": "&b",
    "Knowledge": "&b",
}
var roll_locked = false



function attributeCheck_Dialog(e) {
    original_text = e.dialog.text
    check_dialog_id = e.dialog.id
    var dialogJsonAsText = readFileAsString(e.API.getLevelDir() + "\\dialogs\\" + e.dialog.getCategory().getName() + "\\" + e.dialog.id + ".json")
    dialogJsonAsText = dialogJsonAsText.replace(/b,/g, ",")
    dialogJsonAsText = dialogJsonAsText.replace(/L,/g, ",")
    dialogJsonAsText = dialogJsonAsText.replace(/\n/g, "")
    var parsed_json = JSON.parse(dialogJsonAsText)
    if (e.dialog.getText().indexOf("<att check>") != -1) {
        roll_locked = false
        e.player.playSound("upgrade_aquatic:entity.thrasher.sonar_fire", .2, 3)
        all_bonuses = 0
        in_skillcheck_mode = true
        check_dialog_id = e.dialog.id
        original_roll_id = e.dialog.id
        attribute_paramaters = JSON.parse(e.dialog.getText().substr(11))
        var check_chance_string = "&6&lAttribute Roll"
        for (var i = 0; i < attribute_paramaters.attributes.length; i++) {
            check_chance_string += " &r&l| " + attributeColorsDict[attribute_paramaters.attributes[i]] + "&l" + attribute_paramaters.attributes[i] + " " + getScore(attribute_paramaters.attributes[i])
            all_bonuses += getScore(attribute_paramaters.attributes[i])
        }
        check_chance_string += "\n&d&lChance : 00%"

        if (attribute_paramaters.tag_modifiers != undefined) {

            for (var i = 0; i < attribute_paramaters.tag_modifiers.length; i++) {

                var ptag = JSON.parse(attribute_paramaters.tag_modifiers[i])
                if (e.player.hasTag(ptag.id)) {
                    if (check_chance_string.indexOf("&lBonuses: ") == -1) check_chance_string += "\n\n&7Bonuses:\n"
                    check_chance_string += "\n+ " + ptag.display + " (" + ptag.value + ")"
                    all_bonuses += ptag.value
                }
            }
        }
        if (attribute_paramaters.score_modifiers != undefined) {
            for (var i = 0; i < attribute_paramaters.score_modifiers.length; i++) {
                var pscore = JSON.parse(attribute_paramaters.score_modifiers[i])
                if (getScore(attribute_paramaters.score_modifiers[i].id) != 0) {
                    if (check_chance_string.indexOf("&lBonuses: ") == -1) check_chance_string += "\n\n&7Bonuses:\n"
                    check_chance_string += "\n+ " + pscore.display + " (" + pscore.value + ")"
                    all_bonuses += pscore.value
                }
            }
        }

        var target_chance = attribute_paramaters.target - all_bonuses
        var chance, color


        chance = probability_table[target_chance]
        if (target_chance > 12) chance = 2
        if (target_chance <= 1) chance = 98
        if (chance <= 100) { color = "&a" }
        if (chance <= 85) { color = "&b" }
        if (chance <= 70) { color = "&9" }
        if (chance <= 55) { color = "&e" }
        if (chance <= 40) { color = "&6" }
        if (chance <= 25) { color = "&c" }
        if (chance <= 15) { color = "&8" }

        check_chance_string = check_chance_string.replace("&d&lChance : 00%", "&d&lChance : " + color + chance + "%")
        if (!e.player.storeddata.has("prev_failed_dialogs")) { e.player.storeddata.put("prev_failed_dialogs", JSON.stringify([{ id: 0, bonuses: 0 }])) }
        var previously_failed_dialogs = JSON.parse(e.player.storeddata.get("prev_failed_dialogs"))
        for (var i = 0; i < previously_failed_dialogs.length; i++) {
            if (previously_failed_dialogs[i].id == e.dialog.id) {
                if (previously_failed_dialogs[i].bonuses >= all_bonuses) {
                    roll_locked = true
                    check_chance_string = check_chance_string.replace("&d&lChance : " + color + chance + "%", "&c&lLOCKED! Chance : 0% \n&rLevel up attribute(s) or discover a modifier!")
                }
                else {
                    previously_failed_dialogs.splice(i, 1)
                    e.player.storeddata.put("prev_failed_dialogs", JSON.stringify(previously_failed_dialogs))
                }
            }
        }
        e.dialog.setText(check_chance_string)
        saveDialogAvailability(e, dialogJsonAsText, e.dialog)
        e.dialog.save()
    }
    if (e.dialog.id == 180) {
        roll(e)
        in_skillcheck_mode = false
    }
}

function saveDialogAvailability(e, json, dialog) {
    var dialog1, dialog2, dialog3, dialog4, dialog1_state, dialog2_state, dialog3_state, dialog4_state
        , quest1, quest2, quest3, quest4, quest1_state, quest2_state, quest3_state, quest4_state
        , faction1, faction2, faction1_points, faction2_points, faction1_comp, faction2_comp
        , scoreboard1_name, scoreboard1_score, scoreboard1_comp, scoreboard2_name, scoreboard2_score, scoreboard2_comp

    json = json.replace(/b,/g, ",")
    json = json.replace(/L,/g, ",")
    json = json.replace(/\n/g, "")
    var parsed_json = JSON.parse(json)
    var availability = e.dialog.getAvailability()
    availability.setDaytime(availability.getDaytime())
    availability.setMinPlayerLevel(availability.getMinPlayerLevel())
    availability.setDialog(0, parsed_json.AvailabilityDialogId, parsed_json.AvailabilityDialog)
    availability.setDialog(1, parsed_json.AvailabilityDialog2Id, parsed_json.AvailabilityDialog2)
    availability.setDialog(2, parsed_json.AvailabilityDialog3Id, parsed_json.AvailabilityDialog3)
    availability.setDialog(3, parsed_json.AvailabilityDialog4Id, parsed_json.AvailabilityDialog4)
    availability.setQuest(0, parsed_json.AvailabilityQuestId, parsed_json.AvailabilityQuest)
    availability.setQuest(1, parsed_json.AvailabilityQuest2Id, parsed_json.AvailabilityQuest2)
    availability.setQuest(2, parsed_json.AvailabilityQuest3Id, parsed_json.AvailabilityQuest3)
    availability.setQuest(3, parsed_json.AvailabilityQuest4Id, parsed_json.AvailabilityQuest4)
    availability.setFaction(0, parsed_json.AvailabilityFactionId, parsed_json.AvailabilityFaction, parsed_json.AvailabilityFactionStance)
    availability.setFaction(1, parsed_json.AvailabilityFaction2Id, parsed_json.AvailabilityFaction2, parsed_json.Availability2FactionStance)
    availability.setScoreboard(0, parsed_json.AvailabilityScoreboardObjective, parsed_json.AvailabilityScoreboardType, parsed_json.AvailabilityScoreboardValue)
    availability.setScoreboard(1, parsed_json.AvailabilityScoreboard2Objective, parsed_json.AvailabilityScoreboard2Type, parsed_json.AvailabilityScoreboard2Value)


}

function dialogOption(e) {
    if (in_skillcheck_mode) {
        e.API.getDialogs().get(check_dialog_id).setText(original_text)
        e.API.getDialogs().get(check_dialog_id).save()
        in_skillcheck_mode = false

    }
}

var probability_table = {
    2: 98,
    3: 97,
    4: 91,
    5: 83,
    6: 72,
    7: 58,
    8: 41,
    9: 27,
    10: 16,
    11: 8,
    12: 2
}

function dialogClose(e) {
    in_skillcheck_mode = false
}

function roll(e) {
    var result = 0
    var roll1 = getRandomInt(1, 7)
    var roll2 = getRandomInt(1, 7)
    var dice = ['☍', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅']
    var text
    result = roll1 + roll2 + all_bonuses
    if (roll_locked) {
        text = "&c&l☍ROLL LOCKED☍"
        failCheck()
        return
    }
    if (roll1 + roll2 == 12) {
        text = "&a&lCRITICAL SUCCESS!\n &a" + dice[roll1] + " + " + dice[roll2]
        passCheck()
        return
    }
    if (roll1 + roll2 == 2) {
        text = "&c&lCRITICAL FAILURE!\n &a" + dice[roll1] + " + " + dice[roll2]
        addDialogToFailedChecks()
        return
    }
    if (result >= attribute_paramaters.target) {
        text = "&a&lSUCCESS!\n &a" + dice[roll1] + " + " + dice[roll2] + " + " + all_bonuses + " vs " + attribute_paramaters.target
        passCheck()
        return
    }
    if (result < attribute_paramaters.target) {
        text = "&c&lFAILURE!\n &c" + dice[roll1] + " + " + dice[roll2] + " + " + all_bonuses + " vs " + attribute_paramaters.target
        failCheck()
        addDialogToFailedChecks()
        return
    }
    function passCheck() {
        e.dialog.setText(text)
        e.dialog.save()
        e.player.playSound("minecraft:item.trident.return", 1, 1)
        dialogToShow = attribute_paramaters.passID
        e.player.timers.start(768999, 10, false)
        e.API.executeCommand(e.player.world, '/title ' + e.player.name + ' times 2 6 5')
        e.API.executeCommand(e.player.world, '/title ' + e.player.name + ' title {"text":"♙"}')
    }
    function failCheck() {
        e.dialog.setText(text)
        e.dialog.save()
        e.player.playSound("minecraft:entity.elder_guardian.hurt", 1, 1)
        dialogToShow = attribute_paramaters.failID
        e.player.timers.start(768999, 10, false)
        e.API.executeCommand(e.player.world, '/title ' + e.player.name + ' times 2 6 5')
        e.API.executeCommand(e.player.world, '/title ' + e.player.name + ' title {"text":"♞"}')
    }
    function addDialogToFailedChecks() {
        var previously_failed_dialogs = JSON.parse(e.player.storeddata.get("prev_failed_dialogs"))
        previously_failed_dialogs.push({ id: original_roll_id, bonuses: all_bonuses })
        e.player.storeddata.put("prev_failed_dialogs", JSON.stringify(previously_failed_dialogs))
    }
}
var dialogToShow

function attrbiuteCheck_timer(e) {
    if (e.id == 768999) {
        e.API.getDialogs().get(check_dialog_id).setText(original_text)
        e.API.getDialogs().get(check_dialog_id).save()
        executeCommand("noppes dialog show " + e.player.name + " " + dialogToShow + " test")
    }
}

