var textString = '';
var GUI_1, fileWriter, npc, gui, player, API, GUI_IMPORT


var currentPartIndex = 0
var current_pose_index = 0
var saved_poses_array = [{ name: "default", time: 0.2, head: [180, 180, 180, true], left_arm: [180, 180, 180, true], right_arm: [180, 180, 180, true], body: [180, 180, 180, true], left_leg: [180, 180, 180, true], right_leg: [180, 180, 180, true] }]

var Thread = Java.type("java.lang.Thread");
var NpcAPI = Java.type("noppes.npcs.api.NpcAPI").Instance();



function init(e) {
    API = e.API
    npc = e.npc
    e.npc.getStoreddata().put("notRunning", 1);
    if (e.npc.getStoreddata().has("savedAnimation")) {
        saved_poses_array = JSON.parse(e.npc.getStoreddata().get("savedAnimation"))
    }
}

function damaged(e) {
    e.npc.storeddata.remove("savedAnimation")
    e.npc.say("Animation reset")
    current_pose_index = 0
    currentPartIndex = 0
    saved_poses_array = [{ name: "default", time: 0.2, head: [180, 180, 180, true], left_arm: [180, 180, 180, true], right_arm: [180, 180, 180, true], body: [180, 180, 180, true], left_leg: [180, 180, 180, true], right_leg: [180, 180, 180, true] }]

}


function importAnimation() {
    var imported_json = GUI_IMPORT.getComponent(100).getText()
    npc.say("Animation Imported")
    saved_poses_array = JSON.parse(imported_json)
    npc.storeddata.put("savedAnimation", saved_poses_array)
    GUI_1.close()
}



function returnProperStatusWord(status) {
    if (status) {
        return "Enabled"
    }
    else {
        return "Disabled"
    }
}

function interact(e) {
    player = e.player
    createAnimationGUI()
}

function createAnimationGUI() {
    var pose_names = []
    for (var i in saved_poses_array) {
        pose_names[i] = saved_poses_array[i].name
    }
    GUI_1 = API.createCustomGui(1, 248, 166, false, player);
    GUI_1.addLabel(2, "Animation Creator", 90, -60, 1, 1, 16777215)

    var poses_list_scroll = GUI_1.addScroll(10, -20, 0, 80, 150, pose_names)
    poses_list_scroll.setHasSearch(false)
    poses_list_scroll.setSelection(0)
    var pose_name_textfield = GUI_1.addTextField(11, -20, -30, 80, 20)
    pose_name_textfield.setText(pose_names[current_pose_index])
    pose_name_textfield.setOnFocusLost(function (gui, t) { changePoseName(t) })
    GUI_1.addButton(60, "Add New Pose", -20, 160, 80, 20).setOnPress(function (gui, t) { addNewPose() })
    GUI_1.addButton(61, "Move Up", -95, 30, 75, 20).setOnPress(function (gui, t) { movePoseUp() })
    GUI_1.addButton(62, "Move Down", -95, 50, 75, 20).setOnPress(function (gui, t) { movePoseDown() })
    GUI_1.addButton(63, "Delete Pose", -95, 90, 75, 20).setOnPress(function (gui, t) { deletePose() })

    GUI_1.addLabel(71, "Speed", 70, -20, 1, 1, 16777215)
    GUI_1.addTextField(70, 70, 0, 50, 20).setOnChange(function (gui, t) { updateSpeed(t) }).setText(saved_poses_array[0].time)

    var parts_scroll = GUI_1.addScroll(20, 70, 50, 50, 100, ["Head", "LArm", "RArm", "Body", "LLeg", "RLeg"])
    parts_scroll.setMultiSelect(false)
    parts_scroll.setHasSearch(false)
    parts_scroll.setSelection(0)
    for (var i = 0; i < 3; i++) {
        var slider = GUI_1.addSlider(30 + i, 140, 80 + (i * 20), 160, 20, "180")
        slider.setMax(360)
        slider.setMin(0)
        slider.setValue(180)
        slider.setOnChange(function (gui, comp) { updatePartRotation(comp) })
    }
    GUI_1.addLabel(34, "X", 130, 86, 1, 1, 16777215)
    GUI_1.addLabel(35, "Y", 130, 106, 1, 1, 16777215)
    GUI_1.addLabel(36, "Z", 130, 126, 1, 1, 16777215)

    GUI_1.addEntityDisplay(50, 180, 50, npc)
    GUI_1.addButton(40, returnProperStatusWord(saved_poses_array[current_pose_index].head[3]), 160, 150, 45, 20).setOnPress(function (gui, t) { togglePartEnabled(t) })
    GUI_1.addButton(41, "Run Animation", 140, 190, 85, 20).setOnPress(function (gui, t) { runAnimation(createActionList(), npc, 50) })

    GUI_1.addLabel(81, "Filename", 250, -20, 1, 1, 16777215)
    GUI_1.addButton(82, "Export to", 250, 30, 65, 20).setOnPress(function (gui, t) { exportAnimation() })
    GUI_1.addTextField(80, 250, 0, 90, 20).setText(npc.storeddata.get("savedAnimationName")).setOnChange(function (gui, t) { npc.storeddata.put("savedAnimationName", GUI_1.getComponent(80).getText()) })

    GUI_1.addButton(90, "Import File", -120, -50, 90, 20).setOnPress(function (gui, t) { openJsonLoader() })
    player.showCustomGui(GUI_1);
    GUI_1.update()
}

function openJsonLoader() {
    GUI_IMPORT = API.createCustomGui(2, 248, 166, false, player);
    var text = GUI_IMPORT.addTextArea(100, 10, 50, 256, 25)
    GUI_IMPORT.addButton(110, "Import", 220, 80, 50, 20).setOnPress(function (gui, t) {
        importAnimation()
    })
    GUI_IMPORT.addButton(120, "Back", 10, 80, 50, 20).setOnPress(function (gui, t) { GUI_IMPORT.close() })
    GUI_1.openSubGui(GUI_IMPORT)
}

function customGuiClosed(e) {
    npc.storeddata.put("savedAnimation", JSON.stringify(saved_poses_array))
}

function getCurrentPartStatus() {
    switch (currentPartIndex) {
        case 0:
            return saved_poses_array[current_pose_index].head[3]

        case 1:
            return saved_poses_array[current_pose_index].left_arm[3]

        case 2:
            return saved_poses_array[current_pose_index].right_arm[3]

        case 3:
            return saved_poses_array[current_pose_index].body[3]

        case 4:
            return saved_poses_array[current_pose_index].left_leg[3]

        case 5:
            return saved_poses_array[current_pose_index].right_leg[3]

    }
}

function togglePartEnabled(button) {
    var thisPart
    switch (currentPartIndex) {
        case 0:
            thisPart = saved_poses_array[current_pose_index].head
            break;
        case 1:
            thisPart = saved_poses_array[current_pose_index].left_arm
            break;
        case 2:
            thisPart = saved_poses_array[current_pose_index].right_arm
            break;
        case 3:
            thisPart = saved_poses_array[current_pose_index].body
            break;
        case 4:
            thisPart = saved_poses_array[current_pose_index].left_leg
            break;
        case 5:
            thisPart = saved_poses_array[current_pose_index].right_leg
            break;
    }
    thisPart[3] = !thisPart[3]
    button.setLabel(returnProperStatusWord(thisPart[3]))
    GUI_1.update()
}

function addNewPose() {
    var newPose = JSON.parse(JSON.stringify(saved_poses_array[current_pose_index]))
    newPose.name = "new_pose"
    saved_poses_array.splice(current_pose_index + 1, 0, newPose)
    updatePosesScroll()
}

function deletePose() {
    if (saved_poses_array.length == 1) { return }
    saved_poses_array.splice(current_pose_index, 1)
    current_pose_index -= 1
    updatePosesScroll()
    GUI_1.getComponent(10).setSelection(current_pose_index)
    GUI_1.update()
}

function movePoseUp() {
    if (current_pose_index == 0) {
        return
    }
    var pose = JSON.parse(JSON.stringify(saved_poses_array[current_pose_index]))
    saved_poses_array.splice(current_pose_index, 1)
    current_pose_index -= 1
    saved_poses_array.splice(current_pose_index, 0, pose)
    updatePosesScroll()
    GUI_1.getComponent(10).setSelection(current_pose_index)
    GUI_1.update()
}

function movePoseDown() {
    if (current_pose_index == saved_poses_array.length) {
        return
    }
    var pose = JSON.parse(JSON.stringify(saved_poses_array[current_pose_index]))
    saved_poses_array.splice(current_pose_index, 1)
    current_pose_index += 1
    saved_poses_array.splice(current_pose_index, 0, pose)
    updatePosesScroll()
    GUI_1.getComponent(10).setSelection(current_pose_index)
    GUI_1.update()
}


function updateSpeed(t) {
    saved_poses_array[current_pose_index].time = Number(t.getText())
}

function changePoseName(t) {
    saved_poses_array[current_pose_index].name = t.getText()
    updatePosesScroll()

}

function updatePosesScroll() {
    var poseNames = []
    for (var i in saved_poses_array) {
        poseNames[i] = saved_poses_array[i].name
    }
    GUI_1.getComponent(10).setList(poseNames)
    GUI_1.update()

}

function customGuiScroll(e) {
    if (e.scroll.getID() == 20) {
        updatePartParameterGUI(e.scrollIndex)
    }
    else {

        current_pose_index = e.scrollIndex
        var p = saved_poses_array[e.scrollIndex]
        GUI_1.getComponent(11).setText(saved_poses_array[e.scrollIndex].name)
        GUI_1.getComponent(70).setText(saved_poses_array[e.scrollIndex].time)
        npc.job.getPart(0).setRotation(p.head[0], p.head[1], p.head[2])
        npc.job.getPart(1).setRotation(p.left_arm[0], p.left_arm[1], p.left_arm[2])
        npc.job.getPart(2).setRotation(p.right_arm[0], p.right_arm[1], p.right_arm[2])
        npc.job.getPart(3).setRotation(p.body[0], p.body[1], p.body[2])
        npc.job.getPart(4).setRotation(p.left_leg[0], p.left_leg[1], p.left_leg[2])
        npc.job.getPart(5).setRotation(p.right_leg[0], p.right_leg[1], p.right_leg[2])
        GUI_1.getComponent(50).setEntity(npc)
        npc.updateClient()
        GUI_1.update()
        updatePartParameterGUI(currentPartIndex)
    }
}

function updatePartParameterGUI(scrollIndex) {
    currentPartIndex = scrollIndex
    GUI_1.getComponent(30).setValue(npc.job.getPart(currentPartIndex).getRotationX())
    GUI_1.getComponent(31).setValue(npc.job.getPart(currentPartIndex).getRotationY())
    GUI_1.getComponent(32).setValue(npc.job.getPart(currentPartIndex).getRotationZ())
    GUI_1.getComponent(30).setFormat(npc.job.getPart(currentPartIndex).getRotationX().toString())
    GUI_1.getComponent(31).setFormat(npc.job.getPart(currentPartIndex).getRotationY().toString())
    GUI_1.getComponent(32).setFormat(npc.job.getPart(currentPartIndex).getRotationZ().toString())
    var isEnabled = getCurrentPartStatus()
    if (isEnabled == undefined) {
        isEnabled = true
    }
    GUI_1.getComponent(40).setLabel(returnProperStatusWord(isEnabled))
    GUI_1.update()
}

function updatePartRotation() {
    var part = npc.job.getPart(currentPartIndex)
    part.setRotation(GUI_1.getComponent(30).getValue(), GUI_1.getComponent(31).getValue(), GUI_1.getComponent(32).getValue())
    GUI_1.getComponent(30).setFormat(part.getRotationX().toString())
    GUI_1.getComponent(31).setFormat(part.getRotationY().toString())
    GUI_1.getComponent(32).setFormat(part.getRotationZ().toString())
    GUI_1.getComponent(50).setEntity(npc)
    switch (currentPartIndex) {

        case 0:
            saved_poses_array[current_pose_index].head = [part.getRotationX(), part.getRotationY(), part.getRotationZ(), saved_poses_array[current_pose_index].head[3]]
            break;
        case 1:
            saved_poses_array[current_pose_index].left_arm = [part.getRotationX(), part.getRotationY(), part.getRotationZ(), saved_poses_array[current_pose_index].left_arm[3]]
            break;
        case 2:
            saved_poses_array[current_pose_index].right_arm = [part.getRotationX(), part.getRotationY(), part.getRotationZ(), saved_poses_array[current_pose_index].right_arm[3]]
            break;
        case 3:
            saved_poses_array[current_pose_index].body = [part.getRotationX(), part.getRotationY(), part.getRotationZ(), saved_poses_array[current_pose_index].body[3]]
            break;
        case 4:
            saved_poses_array[current_pose_index].left_leg = [part.getRotationX(), part.getRotationY(), part.getRotationZ(), saved_poses_array[current_pose_index].left_leg[3]]
            break;
        case 5:
            saved_poses_array[current_pose_index].right_leg = [part.getRotationX(), part.getRotationY(), part.getRotationZ(), saved_poses_array[current_pose_index].right_leg[3]]
            break;
    }


    npc.updateClient()
    GUI_1.update()
}

function createActionList() {
    var action_list = {}
    for (var act in saved_poses_array) {
        action_list[saved_poses_array[act].name] = {}
        action_list[saved_poses_array[act].name].time = saved_poses_array[act].time
        if (saved_poses_array[act].head[3]) { action_list[saved_poses_array[act].name].head = { id: 0, a: [0, 0, 0], end: saved_poses_array[act].head.slice(0, 3) } }
        if (saved_poses_array[act].left_arm[3]) { action_list[saved_poses_array[act].name].left_arm = { id: 1, a: [0, 0, 0], end: saved_poses_array[act].left_arm.slice(0, 3) } }
        if (saved_poses_array[act].right_arm[3]) { action_list[saved_poses_array[act].name].right_arm = { id: 2, a: [0, 0, 0], end: saved_poses_array[act].right_arm.slice(0, 3) } }
        if (saved_poses_array[act].body[3]) { action_list[saved_poses_array[act].name].body = { id: 3, a: [0, 0, 0], end: saved_poses_array[act].body.slice(0, 3) } }
        if (saved_poses_array[act].left_leg[3]) { action_list[saved_poses_array[act].name].left_leg = { id: 4, a: [0, 0, 0], end: saved_poses_array[act].left_leg.slice(0, 3) } }
        if (saved_poses_array[act].right_leg[3]) { action_list[saved_poses_array[act].name].right_leg = { id: 5, a: [0, 0, 0], end: saved_poses_array[act].right_leg.slice(0, 3) } }
    }
    return action_list
}

function exportAnimation() {
    textString = createActionList()
    var json = JSON.stringify(textString)
    var editor_format = JSON.stringify(saved_poses_array)
    json.replace(/\\"/g, "\uFFFF")
    json = json.replace(/"([^"]+)":/g, '$1:').replace(/\uFFFF/g, '\\\"');
    var file_name = GUI_1.getComponent(80).getText();
    if (file_name == null) {
        return
    } else {
        fileWriter = new java.io.FileWriter("saves\\world\\customnpcs\\scripts\\animations\\" + file_name + ".js");
        fileWriter.write(json)
        fileWriter.write("\n" + editor_format)
        fileWriter.close();
    }
}

function runAnimation(acts, npc, rate, init_rotation) {

    npc.getStoreddata().put("notRunning", 0);
    var job = npc.getJob();
    if (job && job.getType() == 9) //job == 9 ?puppet
    {
        var MyThread = Java.extend(Thread, {
            run: function () {
                var last_rotation = {}; //record last act rotations
                var sleep_time = 1000 / rate;
                if (!init_rotation)
                    init_rotation = {};
                //do each action
                for (var i in acts) {
                    var time = acts[i].time
                    var act = acts[i];
                    //         log(act["head"].end[0]);
                    var start = {}; //store the action info
                    var act_count = 0;
                    //store action inital rotations
                    for (var j in act) {
                        if (j != "time") {


                            var part = job.getPart(act[j].id);
                            start[j] = {};
                            if (last_rotation[j])
                                start[j].rotation = last_rotation[j].slice();
                            else if (init_rotation[j])
                                start[j].rotation = init_rotation[j].slice();
                            else
                                start[j].rotation = [part.getRotationX(), part.getRotationY(), part.getRotationZ()];

                            start[j].piece = [
                                (act[j].end[0] - start[j].rotation[0]) / rate / time,
                                (act[j].end[1] - start[j].rotation[1]) / rate / time,
                                (act[j].end[2] - start[j].rotation[2]) / rate / time
                            ];
                            act_count++;

                        }
                    }
                    var round_count = 0;
                    //do actions until all action done
                    while (act_count != 0) {
                        //do unfinished actions
                        for (var j in act) {
                            var a = act[j];
                            if (start[j]) {
                                var s = start[j];
                                s.rotation[0] = Near(s.rotation[0], Accelerate(s.piece[0], a.a[0], round_count), a.end[0]);
                                s.rotation[1] = Near(s.rotation[1], Accelerate(s.piece[1], a.a[1], round_count), a.end[1]);
                                s.rotation[2] = Near(s.rotation[2], Accelerate(s.piece[2], a.a[2], round_count), a.end[2]);
                                var part = job.getPart(a.id);
                                part.setRotation(s.rotation[0], s.rotation[1], s.rotation[2]);
                                //when rotation get to destination don't do it anymore
                                if (s.rotation[0] == a.end[0] && s.rotation[1] == a.end[1] && s.rotation[2] == a.end[2]) {
                                    last_rotation[j] = s.rotation.slice();
                                    start[j] = undefined;
                                    act_count--;
                                }
                            }
                        }

                        npc.updateClient();
                        if (player.getCustomGui()) {
                            GUI_1.getComponent(50).setEntity(npc);
                            GUI_1.update()
                        }

                        round_count++;
                        Thread.sleep(sleep_time);
                    }
                }

            }
        });
        var th = new MyThread();
        th.start();





    }
}
/**
* use specific piece, source approach to destination
* @param {*} src source number
* @param {*} piece
* @param {*} dest destination number
*/
function Near(src, piece, dest) {
    if (src != dest) {
        if (src < dest)
            src = src + piece >= dest ? dest : src + piece;
        else if (src > dest)
            src = src + piece <= dest ? dest : src + piece;
    }
    if (src > 360)
        src = src - 360;
    else if (src < 0)
        src = 360 - src;
    return src;
}
/**
 * it means what it means
 * @param {*} speed
 * @param {*} a
 * @param {*} count
 */
function Accelerate(speed, a, count) {
    speed += a * count;
    if (speed > 0 && speed < 0.1)
        speed = 0.1;
    else if (speed < 0 && speed > -0.1)
        speed = -0.1;
    return speed;
}
//


