//This script goes onto the player. It is neccesary for the closing line

var traderNPC
function containerClosed(e) {
    if (e.container.getMCContainer().toString().indexOf("Trader") != -1) {
        if (e.player.tempdata.get("currentTraderNPC") != undefined) {
            traderNPC = e.player.tempdata.get("currentTraderNPC")
            chooseLine(e)
            e.player.tempdata.put("currentTraderNPC", null)
        }
    }
}



function chooseLine(e) {
    var closedLinesArray = e.player.tempdata.get("traderClosedArray")
    if (closedLinesArray.length > 0) {
        var lineIndex
        if (traderNPC.storeddata.get("randomLines") == "Yes") {
            lineIndex = Math.floor(Math.random() * closedLinesArray.length)
        }
        else {
            lineIndex = traderNPC.storeddata.get("closeLineCounter")
            lineIndex += 1
            lineIndex = lineIndex % closedLinesArray.length
            traderNPC.storeddata.put("closeLineCounter", lineIndex)
        }
        traderNPC.say(closedLinesArray[lineIndex].line)
        if (closedLinesArray[lineIndex].sound != undefined) {
            traderNPC.getWorld().playSoundAt(traderNPC.pos, closedLinesArray[lineIndex].sound, 1, 1)
        }
    }
}