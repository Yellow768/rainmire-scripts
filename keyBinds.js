var KEYBIND_GUI
var keybindMode = false
var rebindingID
var rebindingFunction

var defaultKeyBinds = {
        "key_nightvision":78,
        "key_gamemode":71,
        "key_heal":72,
        "key_command":77,
        "key_stats":88
    }

function init(e){
    if(e.player.storeddata.get("keyBindsJSON") == undefined){
        e.player.storeddata.put("keyBindsJSON",JSON.stringify(defaultKeyBinds))
    }
}

function chat(e){
    if(e.message=="!keyBinds"){
        e.setCanceled(true)
        showKeybindGUI(e)
    }
}

function showKeybindGUI(e){
    var keyBinds = JSON.parse(e.player.storeddata.get("keyBindsJSON"))
    var keyBindsKeys = Object.keys(keyBinds)

    var horizontalPos = 120
    var verticalPos = 10
    var horizontalSize = 25
    var verticalSize = 20
    KEYBIND_GUI = e.API.createCustomGui(id("KEYBIND_GUI"), 256, 256, false)
    KEYBIND_GUI.addLabel(id("GUI_Title"), "Custom Keybinds", 100, -5, 1, 1)
    KEYBIND_GUI.addButton(id(keyBindsKeys[4]), GLFWKeys[keyBinds.key_stats], horizontalPos, verticalPos, horizontalSize, verticalSize)
    
    KEYBIND_GUI.addButton(id(keyBindsKeys[0]), GLFWKeys[keyBinds.key_nightvision], horizontalPos, verticalPos + 60, horizontalSize, verticalSize)
    KEYBIND_GUI.addButton(id(keyBindsKeys[1]), GLFWKeys[keyBinds.key_gamemode], horizontalPos, verticalPos + 90, horizontalSize, verticalSize)
    KEYBIND_GUI.addButton(id(keyBindsKeys[2]),GLFWKeys[keyBinds.key_heal], horizontalPos, verticalPos+120, horizontalSize, verticalSize)
    KEYBIND_GUI.addButton(id(keyBindsKeys[3]), GLFWKeys[keyBinds.key_command], horizontalPos, verticalPos+150, horizontalSize, verticalSize)
    KEYBIND_GUI.addButton(id("Default"),"Set to default",horizontalPos,verticalPos+230,140,20)
    
    KEYBIND_GUI.addLabel(id("L_Stats"), "Stats Screen:", horizontalPos-80, verticalPos+10, 1, 1)
    KEYBIND_GUI.addLabel(id("L_Nightvision"), "Nightvision:", horizontalPos-80, verticalPos+70, 1, 1)
    KEYBIND_GUI.addLabel(id("L_Gamemode"), "Gamemode:", horizontalPos-80, verticalPos+100, 1, 1)
    KEYBIND_GUI.addLabel(id("L_Heal"), "Fully heal:", horizontalPos-80, verticalPos+130, 1, 1)
    KEYBIND_GUI.addLabel(id("L_Command"), "Cmnd Feedback:", horizontalPos-80, verticalPos+160, 1, 1)
    e.player.showCustomGui(KEYBIND_GUI)
} 


function customGuiButton(e){
    if(e.buttonId != id("Default")){
        editKeyBind(e)
        }
    else{
        e.player.storeddata.put("keyBindsJSON",JSON.stringify(defaultKeyBinds))
        showKeybindGUI(e)
    }
}


function editKeyBind(e){
    KEYBIND_GUI.getComponent(e.buttonId).setLabel('')
    KEYBIND_GUI.update(e.player)
    keybindMode = true
    rebindingID = e.buttonId
    e.player.message("Changing keybinds")
}


function keyPressed(e){
    if(keybindMode){
        var keyBinds = JSON.parse(e.player.storeddata.get("keyBindsJSON"))
        keyBinds[idname(rebindingID)] = e.key
        keybindMode = false
        KEYBIND_GUI.getComponent(rebindingID).setLabel(GLFWKeys[e.key])
        KEYBIND_GUI.update(e.player)
        e.player.storeddata.put("keyBindsJSON",JSON.stringify(keyBinds))
    }
}

var GLFWKeys = {

0 : "UNKNOWN ",
32 : "SPACE",
39 : "' ",
44 : ", ",
45 : "- ",
46 : ". ",
47 : "/",
48 : "0",
49 : "1",
50 : "2",
51 : "3",
52 : "4",
53 : "5",
54 : "6",
55 : "7",
56 : "8",
57 : "9",
59 : ";",
61 : "=",
65 : "A",
66 : "B",
67 : "C",
68 : "D",
69 : "E",
70 : "F",
71 : "G",
72 : "H",
73 : "I",
74 : "J",
75 : "K",
76 : "L",
77 : "M",
78 : "N",
79 : "O",
80 : "P",
81 : "Q",
82 : "R",
83 : "S",
84 : "T",
85 : "U",
86 : "V",
87 : "W",
88 : "X",
89 : "Y",
90 : "Z",
91 : "[",
92 : "\\",
93 : "]",
96 : "`",
1  : "Non US 1" ,
2  : "Non US 2",
256 :"ESCAPE",
257 :"ENTER",
258 :"TAB",
259 :"BACKSPACE",
260 :"INSERT",
261 :"DELETE",
262 :"RIGHT",
263 :"LEFT",
264 :"DOWN",
265 :"UP",
266 :"PAGE_UP",
267 :"PAGE_DOWN",
268 :"HOME",
269 :"END",
280 :"CAPS_LOCK",
281 :"SCROLL_LOCK",
282 :"NUM_LOCK",
283 :"PRINT_SCREEN",
284 :"PAUSE",
290 :"F1",
291 :"F2",
292 :"F3",
293 :"F4",
294 :"F5",
295 :"F6",
296 :"F7",
297 :"F8",
298 :"F9",
299 :"F10",
300 :"F11",
301 :"F12",
302 :"F13",
303 :"F14",
304 :"F15",
305 :"F16",
306 :"F17",
307 :"F18",
308 :"F19",
309 :"F20",
310 :"F21",
311 :"F22",
312 :"F23",
313 :"F24",
314 :"F25",
320 :"0",
321 :"1",
322 :"2",
323 :"3",
324 :"4",
325 :"5",
326 :"6",
327 :"7",
328 :"8",
329 :"9",
330 :"DECIMAL",
331 :"DIVIDE",
332 :"MULTIPLY",
333 :"SUBTRACT",
334 :"ADD",
335 :"ENTER",
336 :"EQUAL",
340 :"LEFT_SHIFT",
341 :"LEFT_CONTROL",
342 :"LEFT_ALT",
343 :"LEFT_SUPER",
344 :"RIGHT_SHIFT",
345 :"RIGHT_CONTROL",
346 :"RIGHT_ALT",
347 :"RIGHT_SUPER",
348 :"MENU"
}