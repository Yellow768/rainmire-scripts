var quipList
var quipNameList
var quipTempList
var tempScrollIndex
var GUI_CompanionQuipNPC
var npc


function init(e) {
    if (e.npc.storeddata.get("quipArray") == undefined) {
        quipList = [["Default", "This is a default quip You probably don't want to name a quip block 'Default' :)", "minecraft:block.anvil.use", true]]
        e.npc.storeddata.put("quipArray", JSON.stringify(quipList))
    }
    quipList = JSON.parse(e.npc.storeddata.get("quipArray"))
}

function interact(e) {
    if (e.player.gamemode == 1 && e.player.isSneaking()) {
        e.setCanceled(true)
        npc = e.npc
        tempScrollIndex = 0

        quipNameList = []
        for (var i = 0; i < quipList.length; i++) {
            quipNameList.push(quipList[i][0])
        }
        quipTempList = []
        quipTempList = quipList

        GUI_CompanionQuipNPC = e.API.createCustomGui(id("GUI_CompanionQuip"), 256, 256, false, e.player)
        GUI_CompanionQuipNPC.addLabel(id("cqtitle"), "Companion Quips", 100, 0, 1, 1)
        GUI_CompanionQuipNPC.addScroll(id("cqScroll"), 0, 20, 100, 180, quipNameList)

        GUI_CompanionQuipNPC.addTextField(id("cqQuipNameField"), 110, 30, 150, 20)
        GUI_CompanionQuipNPC.addTextArea(id("quipResponseText"), 110, 80, 180, 70)
        GUI_CompanionQuipNPC.addTextField(id("cqQuipSoundField"), 110, 170, 180, 20)
        GUI_CompanionQuipNPC.addLabel(id("cqQuipNameLabel"), "Quip Name", 110, 18, 1, 1)
        GUI_CompanionQuipNPC.addLabel(id("cqQuipResponseLabel"), "NPC Quip Text", 110, 68, 1, 1)
        GUI_CompanionQuipNPC.addLabel(id("cqQuipSoundLabel"), "Playsound Name", 110, 158, 1, 1)




        GUI_CompanionQuipNPC.addButton(id("cqAddQuip"), "+", -30, 45, 20, 20)
        GUI_CompanionQuipNPC.addButton(id("cqDelete"), "X", 270, 30, 20, 20)
        GUI_CompanionQuipNPC.addButton(id("cqSaveChanges"), "Save and Close", 170, 220, 90, 20)
        GUI_CompanionQuipNPC.addButton(id("cqQuit"), "Cancel", 50, 220, 80, 20)


        GUI_CompanionQuipNPC.getComponent(id("cqQuipNameField")).setText(quipNameList[0])
        GUI_CompanionQuipNPC.getComponent(id("quipResponseText")).setText(quipTempList[0][1])
        GUI_CompanionQuipNPC.getComponent(id("cqQuipSoundField")).setText(quipTempList[0][2])
        GUI_CompanionQuipNPC.getComponent(id("cqDelete")).setHoverText("Delete Quip")
        GUI_CompanionQuipNPC.getComponent(id("cqAddQuip")).setHoverText("Add New Quip")
        e.player.showCustomGui(GUI_CompanionQuipNPC)
    }
}

function customGuiButton(e) {
    if (e.buttonId == id("cqAddQuip")) {
        var newQuipName

        if (quipNameList.indexOf("New Quip") == -1) {
            newQuipName = "New Quip"
        }
        else {
            var count = 0
            for (var i = 0; i < quipNameList.length; i++) {
                if (quipNameList[i].indexOf("New Quip") != -1) {
                    count++
                    if (quipNameList[i].indexOf("New Quip (" + count + ")") != -1) {
                        count++
                    }
                }

            }
            newQuipName = "New Quip (" + count + ")"
        }
        quipNameList.push(newQuipName)
        quipTempList.push([newQuipName, "", "", false])

        GUI_CompanionQuipNPC.getComponent(id("cqScroll")).setList(quipNameList)
        GUI_CompanionQuipNPC.getComponent(id("cqScroll")).setDefaultSelection(quipNameList.indexOf(newQuipName))
        GUI_CompanionQuipNPC.update(e.player)
    }
    if (e.buttonId == id("cqDelete")) {
        if (tempScrollIndex != 0) {
            quipNameList.splice(tempScrollIndex, 1)
            quipTempList.splice(tempScrollIndex, 1)
            tempScrollIndex -= 1
            GUI_CompanionQuipNPC.getComponent(id("cqScroll")).setList(quipNameList)
            GUI_CompanionQuipNPC.getComponent(id("cqScroll")).setDefaultSelection(tempScrollIndex)
            GUI_CompanionQuipNPC.getComponent(id("cqQuipNameField")).setText(quipNameList[tempScrollIndex])
            GUI_CompanionQuipNPC.getComponent(id("quipResponseText")).setText(quipTempList[tempScrollIndex][1])
            GUI_CompanionQuipNPC.update(e.player)

        }

    }
    if (e.buttonId == id("cqQuit")) {
        e.player.closeGui()
    }
    if (e.buttonId == id("cqSaveChanges")) {
        var count = 0
        for (var i = 0; i < quipNameList.length; i++) {
            if (quipNameList[i] == GUI_CompanionQuipNPC.getComponent(id("cqQuipNameField")).getText()) {
                count++
            }
        }
        if (count < 2) {
            quipTempList[tempScrollIndex][1] = GUI_CompanionQuipNPC.getComponent(id("quipResponseText")).getText()
            quipNameList[tempScrollIndex] = GUI_CompanionQuipNPC.getComponent(id("cqQuipNameField")).getText()
            quipTempList[tempScrollIndex][2] = GUI_CompanionQuipNPC.getComponent(id("cqQuipSoundField")).getText()
            quipTempList[tempScrollIndex][0] = quipNameList[tempScrollIndex]
            quipTempList[tempScrollIndex][3] = false
        }
        else {
            quipTempList[tempScrollIndex][1] = GUI_CompanionQuipNPC.getComponent(id("quipResponseText")).getText()
            quipNameList[tempScrollIndex] = GUI_CompanionQuipNPC.getComponent(id("cqQuipNameField")).getText() + "(" + count + ")"
            quipTempList[tempScrollIndex][0] = quipNameList[tempScrollIndex]
            quipTempList[tempScrollIndex][2] = GUI_CompanionQuipNPC.getComponent(id("cqQuipSoundField")).getText()
            quipTempList[tempScrollIndex][3] = false
        }

        quipList = quipTempList
        npc.storeddata.put("quipArray", JSON.stringify(quipList))
        e.player.closeGui()
    }
}

function customGuiClosed(e) {
    quipList = JSON.parse(npc.storeddata.get("quipArray"))
}

function customGuiScroll(e) {
    if (e.scrollIndex != tempScrollIndex) {
        if (quipNameList.indexOf(GUI_CompanionQuipNPC.getComponent(id("cqQuipNameField")).getText()) == -1) {
            quipTempList[tempScrollIndex][1] = GUI_CompanionQuipNPC.getComponent(id("quipResponseText")).getText()
            quipNameList[tempScrollIndex] = GUI_CompanionQuipNPC.getComponent(id("cqQuipNameField")).getText()
            quipTempList[tempScrollIndex][0] = quipNameList[tempScrollIndex]
        }
        else {
            if (quipNameList[tempScrollIndex] != GUI_CompanionQuipNPC.getComponent(id("cqQuipNameField")).getText()) {
                quipNameList[tempScrollIndex] = GUI_CompanionQuipNPC.getComponent(id("cqQuipNameField")).getText() + "(1)"
                quipTempList[tempScrollIndex][0] = quipNameList[tempScrollIndex]
            }
            quipTempList[tempScrollIndex][1] = GUI_CompanionQuipNPC.getComponent(id("quipResponseText")).getText()
        }
        quipTempList[tempScrollIndex][2] = GUI_CompanionQuipNPC.getComponent(id("cqQuipSoundField")).getText()
        quipTempList[tempScrollIndex][3] = false

        GUI_CompanionQuipNPC.getComponent(id("cqScroll")).setList(quipNameList)
        tempScrollIndex = e.scrollIndex
        GUI_CompanionQuipNPC.getComponent(id("cqQuipNameField")).setText(quipNameList[e.scrollIndex])
        GUI_CompanionQuipNPC.getComponent(id("quipResponseText")).setText(quipTempList[e.scrollIndex][1])
        GUI_CompanionQuipNPC.getComponent(id("cqQuipSoundField")).setText(quipTempList[e.scrollIndex][2])
        GUI_CompanionQuipNPC.getComponent(id("cqScroll")).setDefaultSelection(e.scrollIndex)
        GUI_CompanionQuipNPC.update(e.player)
    }


}

function trigger(e) {
    if (e.id == 5005) {
        for (var i = 0; i < quipList.length; i++) {
            if (quipList[i][0] == e.arguments[2] && quipList[i][3] == false) {
                e.arguments[1].say(quipList[i][1])
                e.arguments[1].executeCommand("playsound " + quipList[i][2] + " hostile @a[distance=..40] ~ ~ ~ 1 1")
                quipList[i][3] = true
            }
        }
    }
}

//A 2D array, that contains [quipname,response,activated]
//Store the 2D array in storeddata, but load it into a variable on init.
//GUI will have a scroll list that loops through it all. The scroll list will then place a text area on the right.
//GUI will have an add button, that registers a new quip to the list.
//Upon saving, the array will be updated in the storeddata.