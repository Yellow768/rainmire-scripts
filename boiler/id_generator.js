var API = Java.type('noppes.npcs.api.NpcAPI').Instance();

"use strict";

var wsd
//Runon's Stuff
var _IDS = {
    counter: 1,
    ids: {},
    lookup: {}
}

function resetIds(world) {
    _IDS = {
        counter: 1,
        ids: {},
        lookup: {}
    }
    wsd.put("ids", JSON.stringify(_IDS))
    _IDS = JSON.parse(wsd.get("ids"))
    world.broadcast("hey")
}


function loadIds(world) {
    wsd = world.storeddata
    if (!wsd.has("ids")) {
        wsd.put("ids", JSON.stringify(_IDS))
    }
    _IDS = JSON.parse(wsd.get("ids"))
}

function id(name) {

    _IDS = JSON.parse(wsd.get("ids"))
    if (!name) {
        name = Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7);
    }

    var _id = _IDS.ids[name] || (_IDS.ids[name] = _IDS.counter++);

    _IDS.lookup[_id] = name;
    wsd.put("ids", JSON.stringify(_IDS))

    return _id;
}

function idname(_id) {
    return _IDS.lookup[_id];
}

function removeid(name) {
    var _id = id(name);

    delete _IDS.lookup[_id];
    delete _IDS.ids[name];
    wsd.put("ids", JSON.stringify(_IDS))
}

;