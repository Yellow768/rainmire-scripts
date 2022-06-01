var scoreboard
var playerName
var player
var API = Java.type('noppes.npcs.api.NpcAPI').Instance();

"use strict";
//Runon's Stuff
var _GUI_IDS = {
    counter: 1,
    ids: {},
    lookup: {}
}; // var tempdata = API.getIWorld(0).getTempdata();
// if(tempdata.get('_GUI_IDS')) {
//     _GUI_IDS = tempdata.get('_GUI_IDS');
// } else {
//     tempdata.put('_GUI_IDS', _GUI_IDS);
// }

function id(name) {
    if (!name) {
        name = Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7);
    }

    var _id = _GUI_IDS.ids[name] || (_GUI_IDS.ids[name] = _GUI_IDS.counter++);

    _GUI_IDS.lookup[_id] = name;
    return _id;
}

function idname(_id) {
    return _GUI_IDS.lookup[_id];
}

function removeid(name) {
    var _id = id(name);

    delete _GUI_IDS.lookup[_id];
    delete _GUI_IDS.ids[name];
}

;



function init(e) {
    setUpVals(e)
}

function setUpVals(e) {
    scoreboard = e.player.world.getScoreboard()
    player = e.player
    playerName = e.player.name
}

function getScore(scoreBoardName) {
    if (scoreboard.hasPlayerObjective(playerName, scoreBoardName)) {
        return scoreboard.getPlayerScore(playerName, scoreBoardName)
    }
}

function setScore(scoreBoardName, val) {
    if (scoreboard.hasPlayerObjective(playerName, scoreBoardName)) {
        scoreboard.setPlayerScore(playerName, scoreBoardName, val)
    }
}

function addToScore(scoreBoardName, val) {
    if (scoreboard.hasPlayerObjective(playerName, scoreBoardName)) {
        scoreboard.setPlayerScore(playerName, scoreBoardName, getScore(scoreBoardName) + val)
    }
}

function executeCommand(command) {
    return API.executeCommand(API.getIWorld("overworld"), command)
}

function doesStringContainPhrase(string, phrase) {
    if (string.indexOf(phrase) == -1) { return false }
    else { return true }
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
}