var GUI_1, GUI_2, name, p;
var textString;
var fileWriter, npc, gui, time_speed;


var animationExample = {
    disabled: [
        0,
        0,
        0,
        0,
        0,
        0
    ],
    pose1: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ],
    pose2: [
        [180, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ],
    speed: 5

}


function interact(event) {
    npc = event.npc;
    //
    GUI_1 = event.API.createCustomGui(1, 248, 166, false);
    GUI_1.setBackgroundTexture("minecraft:textures/gui/demo_background.png");
    //
    GUI_1.addTexturedButton(20, "Start", 20, 20, 60, 20, "minecraft:textures/gui/widgets.png", 0, 66);
    GUI_1.addTexturedButton(21, "Close", 20, 120, 60, 20, "minecraft:textures/gui/widgets.png", 0, 66);
    ////
    GUI_1.addTextField(30, 20, 50, 100, 19);
    GUI_1.addTextField(31, 20, 75, 50, 19);
    //
    GUI_1.addLabel(81, "File and action name", 127, 46, 100, 30, 16776960);
    GUI_1.addLabel(82, "Speed - ex: .5 fast, 3 slow", 77, 71, 100, 30, 16776960);
    //
    event.player.showCustomGui(GUI_1);
}
function customGuiButton(e) {
    textString = "";
    p = e.player;
    gui = e.gui;
    var b1 = e.buttonId;
    name = e.gui.getComponent(30).getText();
    time_speed = e.gui.getComponent(31).getText();
    if (b1 == 20) {
        if (name == null || time_speed == null) {
            if (!npc.timers.has(1)) {
                GUI_1.addLabel(80, "No TEXT/SPEED entered, try again!", 160, 100, 70, 40, 16711680);
                event.gui.update(event.player);
                npc.timers.start(1, 40, false);
            }
        } else {
            fileWriter = new java.io.FileWriter("world\\customnpcs\\scripts\\ecmascript\\animations\\" + name + ".js");
            ////
            textString = textString + "action_" + name + ":{";
            //
            for (var i = 0; i < 6; i++) {
                //
                npc.say(i)
                animationExample.pose1[i][0] = npc.job.getPart(i).getRotationX()
                animationExample.pose1[i][1] = npc.job.getPart(i).getRotationY()
                animationExample.pose1[i][2] = npc.job.getPart(i).getRotationZ()
                animationExample.pose2[i][0] = npc.job.getPart(i + 6).getRotationX()
                animationExample.pose2[i][1] = npc.job.getPart(i + 6).getRotationY()
                animationExample.pose2[i][2] = npc.job.getPart(i + 6).getRotationZ()
            }
            animationExample.speed = npc.job.getAnimationSpeed()
            var pnbt = npc.getEntityNbt()
            animationExample.disabled[0] = pnbt.getCompound("PuppetHead").getByte("Disabled")
            animationExample.disabled[1] = pnbt.getCompound("PuppetLArm").getByte("Disabled")
            animationExample.disabled[2] = pnbt.getCompound("PuppetRArm").getByte("Disabled")
            animationExample.disabled[3] = pnbt.getCompound("PuppetBody").getByte("Disabled")
            animationExample.disabled[4] = pnbt.getCompound("PuppetLLeg").getByte("Disabled")
            animationExample.disabled[5] = pnbt.getCompound("PuppetRLeg").getByte("Disabled")

            fileWriter.write(JSON.stringify(animationExample));
            fileWriter.close();
        }
    } else if (b1 == 21) {
        e.player.closeGui();
    }
}
function timer(event) {
    if (event.id == 1) {
        GUI_1.removeComponent(80);
        gui.update(p);
    }
}

