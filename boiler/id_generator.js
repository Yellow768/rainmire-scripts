var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
var world = API.getIWorld("minecraft:overworld")
var _IDS

"use strict";

function resetIds() {
    _IDS = {
        counter: 1,
        ids: {},
        lookup: {}
    }
    world.storeddata.put("ids", JSON.stringify(_IDS))
    world.tempdata.put("ids", _IDS)
}

function id(name) {
    if (!world.tempdata.has("ids")) {
        world.tempdata.put("ids", JSON.parse(world.storeddata.get("ids")))
    }
    _IDS = world.tempdata.get("ids")
    if (!name) {
        name = Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7);
    }
    var _id = _IDS.ids[name] || (_IDS.ids[name] = _IDS.counter++);

    _IDS.lookup[_id] = name;
    world.tempdata.put("ids", _IDS)

    return _id;
}

function idname(_id) {
    return _IDS.lookup[_id];
}

function removeid(name) {
    var _id = id(name);

    delete _IDS.lookup[_id];
    delete _IDS.ids[name];
    world.tempdata.put("ids", _IDS)
}

;