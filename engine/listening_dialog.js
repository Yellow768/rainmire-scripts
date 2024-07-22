var GUI_CONFIG
var GUI_DIALOG

var sizeString
var marksString
var useMarks

var playerInDialog = false
var dialogStringArray = []
var npcName
var npc

var timerPrefix
var timerAddPlayerID
var timerUpdateDialogID
var timerRemovePlayerID
var timerClearPlayerArrayID
var timerForceListenID
var timerCloseID



var playerArray = []

var defaultDialogLabelInt = 400
var defaultNameLabelInt = 700
var optionsLabelInt = 300
var dialogLabelInterger = defaultDialogLabelInt
var nameDialogLabelInterger = defaultNameLabelInt

var listeningToLabelID = 0
var dialogOptionsLineSeparaterID = 10

var dialogYPosition = -83
var lastDialogYPosition = -103
var dialogOptionsLineSeparatorYPosition = 210

var listeningToXPos = -180
var listeningToYPos = 280

var quitListeningXPos = 320
var quitListeningYPos = 275

var defaultNamePosX = 15

var dialogArray
var optionsArray
var npcName
var dialogName = 0
var dialogText = 1
var dialogPlayer


///Initializing and Checking Values

function init(e) {
	removeDialogMark(e.player)
	e.player.message("&6&lListening GUI Initialized")
	e.player.getTempdata().put("inDialog", false)
	checkGuiOptions(e)
	checkStoreddata(e)
}

function checkGuiOptions(e) {
	if (e.player.getStoreddata().get("listeningGuiDialogOptionsSet") == null) {
		setDefaultGuiOptions(e)
	}
	var sd = e.player.getStoreddata()
	timerPrefix = e.player.world.getStoreddata().get("GUIDIALOGtimerPrefix")
	useMarks = e.player.world.getStoreddata().get("guiDIALOGuseMarks")
	setTimers()

	if (sd.get("guiScale") == 1) {
		dialogOptionsLineSeparatorYPosition = 170
		listeningToXPos = -100
		listeningToYPos = 240
		quitListeningXPos = 270
		quitListeningYPos = 230
	}
	else {
		dialogOptionsLineSeparatorYPosition = 210
		listeningToXPos = -180
		listeningToYPos = 280
		quitListeningXPos = 320
		quitListeningYPos = 275
	}

}

function setDefaultGuiOptions(e) {
	var sd = e.player.getStoreddata()
	e.player.world.getStoreddata().put("GUIDIALOGtimerPrefix", 301000)
	sd.put("guiScale", 0)
	sd.put("listeningGuiDialogOptionsSet", 1)
	e.player.world.getStoreddata().put("guiDIALOGuseMarks", 1)
}

function setTimers() {
	timerCloseID = timerPrefix + 1
	timerAddPlayerID = timerPrefix + 2
	timerUpdateDialogID = timerPrefix + 3
	timerRemovePlayerID = timerPrefix + 4
	timerClearPlayerArrayID = timerPrefix + 5
	timerForceListenID = timerPrefix + 6
}

function checkStoreddata(e) {

	if (e.player.getStoreddata().get("guiScale") == 0) {
		sizeString = "Normal"
	}
	else {
		sizeString = "Compact"
	}

	if (e.player.world.getStoreddata().get("guiDIALOGuseMarks") == 0) {
		marksString = "False"
	}
	else {
		marksString = "True"
	}
}

function chat(e) {
	if (e.message == "!guiConfig") {
		createConfigGUI(e)
	}
}





///Storing Dialog and Registering NPCs

function interact(e) {
	if (e.target != null) {
		checkGuiOptions(e)
		if (e.target.type == 1 && e.target.getTempdata().get("inDialog")) {
			dialogPlayer = e.target
			setDefaultValues()
			createListeningGUI(e)
			addSelfToListenerList(e)
		}
		if (e.target.type == 2 && e.target.getTempdata().get("inNPCDialog") && e.target.getTempdata().get("player") != e.player) {
			dialogPlayer = e.target.getTempdata().get("player")
			e.player.timers.forceStart(timerForceListenID, 3, false)
			if (e.player.world.getStoreddata().get("GUIDIALOGdialogID") != null) {
				e.player.showDialog(e.player.world.getStoreddata().get("GUIDIALOGdialogID"), "")
			}
		}
	}
}

function addSelfToListenerList(e) {
	dialogPlayer.getTempdata().put("newPlayer", e.player)
	dialogPlayer.timers.forceStart(timerAddPlayerID, 1, false)
}

function dialog(e) {
	e.player.timers.stop(timerCloseID)
	if (!e.npc.getTempdata().get("inNPCDialog")) {
		npc = e.npc
		e.npc.getTempdata().put("player", e.player)
		e.npc.getTempdata().put("inNPCDialog", true)
		dialogPlayer = e.player
		storeNameandText(e, e.npc.name, e.dialog.text)
		storeOptions(e)
		e.player.timers.start(timerForceListenID, 10, false)
	}
	if (!playerInDialog) {
		playerInDialog = true
		e.player.getTempdata().put("inDialog", true)
		npcName = e.npc.name
		dialogStringArray = []
		storeNameandText(e, npcName, e.dialog.text)
		storeOptions(e)
		addDialogMark(e.player, 2)
	}
	else {
		if (e.npc.name != npcName) {
			dialogStringArray = []
			npcName = e.npc.name
		}
		storeNameandText(e, npcName, e.dialog.text)
		storeOptions(e)
	}

}

function dialogOption(e) {
	if (e.option.type != 1) {
		e.player.timers.start(timerClearPlayerArrayID, 1, false)
		e.player.getTempdata().put("inDialog", false)
		playerInDialog = false
		e.player.getTempdata().put("optionsArray", [])
	}

	storeNameandText(e, e.player.name, e.option.name)

	if (e.option.type == 3) {
		storeNameandText(e, npcName, "*role screen opened*")
	}

	if (playerArray.length > 0) {
		for (var i = 0; i < playerArray.length; i++) {
			playerArray[i].timers.forceStart(timerUpdateDialogID, 1, false)
		}
	}
}

function dialogClose(e) {
	e.player.timers.forceStart(timerCloseID, 1, false)
	npc = e.npc
}

function storeNameandText(e, name, text) {
	text = text.replace("@p", e.player.name)
	text = text.replace("{player}", e.player.name)
	dialogStringArray.push([name, text])
	if (dialogStringArray.length > 20) {
		var spliceAmount = dialogStringArray.length - 20
		dialogStringArray.splice(0, spliceAmount)
	}
	e.player.getTempdata().put("dialogArray", dialogStringArray)
}

function storeOptions(e) {
	var options = e.dialog.getOptions()
	var optionsTextArray = []
	var optionsLength = options.length
	for (var i = 0; i < optionsLength; i++) {

		var text = options[i].getName().replace("@p", e.player.name)
		text = text.replace("{player}", e.player.name)
		if (options[i].getType() == 1) {
			if (options[i].getDialog().getAvailability().isAvailable(e.player)) {
				optionsTextArray.push(text)
			}
		}
		else {
			optionsTextArray.push(text)
		}


	}
	e.player.getTempdata().put("optionsArray", optionsTextArray)
}




function login(e) {
	removeDialogMark(e.player)
}

function logout(e) {
	removeNPCfromDialogState(e)
}

function died(e) {
	removeNPCfromDialogState(e)
}

function removeNPCfromDialogState(e) {
	if (npc.getTempdata().get("inNPCDialog") && npc.getTempdata().get("player") == e.player) {
		npc.getTempdata().put("inNPCDialog", false)
		removeDialogMark(npc)
	}
}

function addDialogMark(target, type) {
	if (useMarks == 1) {
		target.addMark(type)
	}
}
function removeDialogMark(target) {
	if (useMarks == 1) {
		for (var i = 0; i < target.getMarks().length; i++) {
			target.removeMark(target.getMarks()[i])
		}
	}
}


///GUI Work




function setDefaultValues() {
	dialogLabelInterger = defaultDialogLabelInt
	nameDialogLabelInterger = defaultNameLabelInt
	dialogYPosition = 0
	lastDialogYPosition = 0
}



function createListeningGUI(e) {
	checkGuiOptions(e)
	parseStoredDataIntoArray()
	npcName = dialogArray[0][dialogName]
	GUI_DIALOG = e.API.createCustomGui(1, 256, 256, false, e.player);
	GUI_DIALOG.addLabel(listeningToLabelID, "Listening to: §6" + dialogPlayer.name, listeningToXPos, listeningToYPos, 256, 10)
	GUI_DIALOG.addLabel(12, "§l§m------------------------------------------------------", -40, dialogOptionsLineSeparatorYPosition, 400, 10)
	GUI_DIALOG.addButton(20, "Quit Listening", quitListeningXPos, quitListeningYPos, 80, 20);
	e.player.showCustomGui(GUI_DIALOG)
	addDialog(e)
	removeDialogMark(e.player)
	addDialogMark(e.player, 1)
}



function updateListeningGUI(e) {
	for (var i = 0; i < dialogLabelInterger - defaultDialogLabelInt; i++) {
		GUI_DIALOG.removeComponent(i + 400)
	}
	for (var i = 0; i < nameDialogLabelInterger - defaultNameLabelInt; i++) {
		GUI_DIALOG.removeComponent(i + 700)
	}
	for (var i = 0; i < 5; i++) {
		GUI_DIALOG.removeComponent(optionsLabelInt + i)
	}
	GUI_DIALOG.update(e.player)
	setDefaultValues()
	parseStoredDataIntoArray()
	addDialog(e)
}

function parseStoredDataIntoArray() {
	dialogArray = dialogPlayer.getTempdata().get("dialogArray")
	npcName = dialogArray[0][0]
	optionsArray = dialogPlayer.getTempdata().get("optionsArray")
}




function addDialog(e) {
	for (var i = 0; i < optionsArray.length; i++) {
		GUI_DIALOG.addLabel(optionsLabelInt + i, optionsArray[i], -20, dialogOptionsLineSeparatorYPosition + 10 + (i * 12), 400, 10)
	}

	var dialogArrayLength = dialogArray.length
	for (var i = 0; i < dialogArrayLength; i++) {
		var name = dialogArray[i][0]
		var dialogString = dialogArray[i][1]
		var currentDialogArray = splitString(dialogString)

		GUI_DIALOG.addLabel(nameDialogLabelInterger, ": ", defaultNamePosX, lastDialogYPosition + (20), 256, 256, 0xffffff)
		nameDialogLabelInterger++
		GUI_DIALOG.addLabel(nameDialogLabelInterger, name, (defaultNamePosX - 10) - (name.length * 5), lastDialogYPosition + (20), 256, 256, 0xffffff)
		nameDialogLabelInterger++

		var curDialogLength = currentDialogArray.length
		for (var d = 0; d < curDialogLength; d++) {
			var newYPos = (lastDialogYPosition + 20) + (10 * d)
			GUI_DIALOG.addLabel(dialogLabelInterger, currentDialogArray[d], 30, newYPos, 600, 256, 0xffffff)
			dialogLabelInterger++
			if (d == currentDialogArray.length - 1) {
				lastDialogYPosition = newYPos
			}
		}
	}
	checkIfBeyondVerticalLimit(e)
	GUI_DIALOG.update()
}

function checkIfBeyondVerticalLimit(e) {
	var verticalLimit = dialogOptionsLineSeparatorYPosition - 140
	if (lastDialogYPosition > verticalLimit) {
		var newYPositionOffset = lastDialogYPosition - verticalLimit
		lastDialogYPosition -= dialogOptionsLineSeparatorYPosition

		var dialogILimit = dialogLabelInterger - defaultDialogLabelInt
		var nameILimit = nameDialogLabelInterger - defaultNameLabelInt
		for (var i = 0; i < dialogILimit; i++) {
			var dialog = GUI_DIALOG.getComponent(i + 400)
			dialog.setPos(dialog.getPosX(), dialog.getPosY() - newYPositionOffset)
		}
		for (var i = 0; i < nameILimit; i++) {
			var dialog = GUI_DIALOG.getComponent(i + 700)
			dialog.setPos(dialog.getPosX(), dialog.getPosY() - newYPositionOffset)
		}
	}
}



function splitString(str) {
	var splitUpString = str.replace(/.{50}\S*\s+/g, "$&@").split(/\s+@/)
	splitLineBreak(splitUpString)
	return splitLineBreak(splitUpString)
}

function splitLineBreak(strArray) {
	var completeArray = []
	var strArrayLength = strArray.length
	for (var i = 0; i < strArrayLength; i++) {
		if (strArray[i].indexOf("\n") !== -1) {
			var newLineSplit = strArray[i].split("\n")
			var newLineSplitLength = newLineSplit.length
			for (var l = 0; l < newLineSplitLength; l++) {
				completeArray.push(newLineSplit[l])
			}
		}
		else {
			completeArray.push(strArray[i])
		}
	}
	return completeArray
}


function createConfigGUI(e) {
	checkStoreddata(e)
	GUI_CONFIG = e.API.createCustomGui(2, 256, 256, false, e.player);
	GUI_CONFIG.addLabel(10, "§6§l§nDialog Listening GUI Config", 50, 10, 256, 20)

	GUI_CONFIG.addLabel(20, "Gui Size", 40, 40, 50, 20)
	GUI_CONFIG.addButton(30, sizeString, 110, 40, 50, 20)
	GUI_CONFIG.getComponent(30).setHoverText("If the listening GUI goes off screen for you, change this to Compact")

	GUI_CONFIG.addLabel(40, "Timer Prefix", 40, 80, 100, 20)
	GUI_CONFIG.addTextField(50, 110, 80, 80, 20)
	GUI_CONFIG.addButton(60, "Set", 200, 80, 50, 20)
	GUI_CONFIG.getComponent(50).setText(e.player.world.getStoreddata().get("GUIDIALOGtimerPrefix"))
	GUI_CONFIG.getComponent(50).setHoverText("Adds this prefix to all timers used in the Dialog Listening Script. Change this to a higher number if you are encountering script errors, otherwise leave it alone")

	GUI_CONFIG.addLabel(41, "Dialog ID", 40, 120, 100, 20)
	GUI_CONFIG.addTextField(51, 110, 120, 80, 20)
	GUI_CONFIG.addButton(61, "Set", 200, 120, 50, 20)
	GUI_CONFIG.getComponent(51).setText(e.player.world.getStoreddata().get("GUIDIALOGdialogID"))
	GUI_CONFIG.getComponent(51).setHoverText("You can create a dialog that has no options and Esc disabled, that says something like 'Listening'. \n\nThe GUI will show this dialog when a player attempts to interact with an NPC that's in conversation before the GUI loads, preventing players from spam left clicking into the normal dialog screen\n\nIf you enter in an invalid dialog ID, the script will error")

	GUI_CONFIG.addLabel(42, "Use Marks", 40, 160, 100, 20)
	GUI_CONFIG.addButton(62, marksString, 110, 160, 50, 20)
	GUI_CONFIG.getComponent(62).setHoverText("Players and NPCs in dialog or listening will have a mark above them if true")

	e.player.showCustomGui(GUI_CONFIG)
}

function customGuiButton(e) {
	if (e.buttonId == 20) {
		e.player.closeGui()
	}

	if (e.buttonId == 30) {
		if (e.player.getStoreddata().get("guiScale") == 0) {
			e.player.getStoreddata().put("guiScale", 1)
			GUI_CONFIG.getComponent(30).setLabel("Compact")
		}
		else {
			e.player.getStoreddata().put("guiScale", 0)
			GUI_CONFIG.getComponent(30).setLabel("Normal")
		}
		GUI_CONFIG.update(e.player)
	}

	if (e.buttonId == 60) {
		if (checkIsNum(GUI_CONFIG.getComponent(50).getText())) {
			e.player.world.getStoreddata().put("GUIDIALOGtimerPrefix", parseInt(GUI_CONFIG.getComponent(50).getText()))
			e.player.message("Timer Prefix Set")
		}
		else {
			e.player.message("Error: Timer Prefix can be ONLY digits")
		}
	}

	if (e.buttonId == 61) {
		if (checkIsNum(GUI_CONFIG.getComponent(51).getText())) {
			e.player.world.getStoreddata().put("GUIDIALOGdialogID", parseInt(GUI_CONFIG.getComponent(51).getText()))
			e.player.message("DialogID Set")
		}
		else {
			e.player.message("Error: DialogID can be ONLY digits")
		}
	}

	if (e.buttonId == 62) {
		if (e.player.world.getStoreddata().get("guiDIALOGuseMarks") == 0) {
			e.player.world.getStoreddata().put("guiDIALOGuseMarks", 1)
			GUI_CONFIG.getComponent(62).setLabel("True")
		}
		else {
			e.player.world.getStoreddata().put("guiDIALOGuseMarks", 0)
			GUI_CONFIG.getComponent(62).setLabel("False")
		}
		GUI_CONFIG.update()
	}

}

function checkIsNum(string) {
	var text = string
	var isnum = /^\d+$/.test(text)
	return isnum
}

function customGuiClosed(e) {
	if (e.gui == GUI_DIALOG) {
		dialogPlayer.getTempdata().put("removePlayer", e.player)
		dialogPlayer.timers.forceStart(timerRemovePlayerID, 1, false)
		removeDialogMark(e.player)
	}
	if (e.gui == GUI_CONFIG) {
		GUI_CONFIG.update()
		e.player.message("Config Saved")
	}
}




function timer(e) {
	if (e.id == timerCloseID) {
		e.player.getTempdata().put("inDialog", false)
		e.player.getTempdata().put("dialogArray", [])
		e.player.getTempdata().put("optionsArray", [])
		removeNPCfromDialogState(e)
		removeDialogMark(e.player)
		playerInDialog = false
	}

	if (e.id == timerAddPlayerID) {
		playerArray.push(e.player.getTempdata().get("newPlayer"))
	}

	if (e.id == timerRemovePlayerID) {
		var removePlayer = e.player.getTempdata().get("removePlayer")
		var removeIndex = playerArray.indexOf(removePlayer)
		playerArray.splice(removeIndex, 1)
	}

	if (e.id == timerClearPlayerArrayID) {
		playerArray = []
	}

	if (e.id == timerUpdateDialogID) {
		updateListeningGUI(e)
	}

	if (e.id == timerForceListenID) {
		setDefaultValues()
		createListeningGUI(e)
		addSelfToListenerList(e)
	}
}




