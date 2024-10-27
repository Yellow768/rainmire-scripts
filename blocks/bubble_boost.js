var x, y, z, rotation, pitch, power, block, duration, source_block, size_height, size_width, size_length, min_t, max_t, points
var xbound_1, xbound_2, ybound_1, ybound_2, cross_product_i, cross_product_j, cross_product_k
function init(e) {
    block = e.block
    block.setModel("magenta_glazed_terracotta")
    e.block.timers.forceStart(1, 0, true)
    e.block.timers.forceStart(2, 0, true)

    if (!e.block.storeddata.has("x_offset")) {
        e.block.storeddata.put("x_offset", 0)
        e.block.storeddata.put("y_offset", 0)
        e.block.storeddata.put("z_offset", 0)

        e.block.storeddata.put("rotation", 0)
        e.block.storeddata.put("pitch", 0)
        e.block.storeddata.put("power", 1)
        e.block.storeddata.put("duration", 5)
        e.block.storeddata.put("size_w", 2)
        e.block.storeddata.put("size_h", 2)
        e.block.storeddata.put("size_l", 2)
        e.block.storeddata.put("min_t", 0)
        e.block.storeddata.put("max_t", 15)
        e.block.storeddata.put("points", 100)
    }
    x = e.block.storeddata.get("x_offset")
    y = e.block.storeddata.get("y_offset")
    z = e.block.storeddata.get("z_offset")

    rotation = e.block.storeddata.get("rotation")
    pitch = e.block.storeddata.get("pitch")
    power = e.block.storeddata.get("power")
    duration = e.block.storeddata.get("duration")
    size_width = e.block.storeddata.get("size_w")
    size_height = e.block.storeddata.get("size_h")
    size_length = e.block.storeddata.get("size_l")
    min_t = e.block.storeddata.get("min_t")
    max_t = e.block.storeddata.get("max_t")
    points = e.block.storeddata.get("points")

}

var bubbled_player
var t = 0



var bubble_line_iteration = 0

function timer(e) {
    source_block = {
        x: parseFloat(e.block.x + .5) + parseFloat(x),
        y: parseFloat(e.block.y + .5) + parseFloat(y),
        z: parseFloat(e.block.z + .5) + parseFloat(z)
    }

    if (e.id == 1) {
        var sx, sy, sz
        t = parseInt(min_t)
        for (var i = 0; i < points; i++) {
            if (t < max_t) {
                t += max_t / points
            }
            else {
                t = min_t
            }
            sx = Math.sin(t) * size_width
            sy = Math.cos(t) * size_height
            sz = 0

            //e.block.executeCommand("say " + t)
            e.block.executeCommand("execute positioned " + source_block.x + " " + source_block.y + " " + source_block.z + " rotated " + rotation + " " + pitch + " run particle bubble ^" + sx.toFixed(4) + " ^" + sy.toFixed(4) + " ^" + sz.toFixed(4) + " 0 0 0 0 0 force @a")

        }
        var bd = FrontVectors(e.block, rotation, pitch, power * bubble_line_iteration)
        //e.block.executeCommand("particle bubble_pop " + (source_block.x + bd[0]) + " " + (source_block.y - bd[1]) + " " + (source_block.z + bd[2]) + " .6 1 .6 0 30 force")
        if (bubble_line_iteration < 6) {
            bubble_line_iteration += 1
        }
        else {
            bubble_line_iteration = 0
        }
    }
    if (e.id == 2) {
        var d = FrontVectors(e.block, rotation, pitch, power)
        var sb = e.block.world.getBlock(source_block.x, source_block.y, source_block.z).getPos()
        var nE = e.block.world.getNearbyEntities(sb, size_height - 1, 1)

        for (var i = 0; i < nE.length; i++) {

            var normal_vector = FrontVectors(sb, rotation, pitch, 1, 0)
            var player = nE[i]
            var A = normal_vector[0]
            var B = normal_vector[1]
            var C = normal_vector[2]
            var px = source_block.x - nE[i].x
            var py = (source_block.y - Math.abs(pitch) / 90) - nE[i].y
            var pz = source_block.z - nE[i].z

            var distance = ((A * px) + (B * py) + (C * pz)) / Math.sqrt(Math.pow(A, 2) + Math.pow(B, 2) + Math.pow(C, 2))

            if (bubbled_player == nE[i] || nE[i].gamemode == 1 || Math.abs(distance) > 0.7) { return }

            player.addPotionEffect(30, 5, 9, false)
            //
            //e.block.executeCommand("tp " + player.name + " " + source_block.x + " " + source_block.y + " " + source_block.z)
            e.block.world.playSoundAt(nE[i].pos, "minecraft:ambient.underwater.exit", 1, .2)
            e.block.world.playSoundAt(nE[i].pos, "customnpcs:magic.shot", 1, .2)
            nE[i].timers.forceStart(768090, 15, false)
            nE[i].world.spawnParticle("cloud", source_block.x, source_block.y, source_block.z, .7, .7, .7, 0, 100)
            bubbled_player = nE[i]
            e.block.timers.forceStart(3, 20, false)

        }

    }
    if (e.id == 3) {
        bubbled_player = null
    }
}


var GUI

function interact(e) {
    GUI = e.API.createCustomGui(1, 256, 256, false, e.player)
    GUI.addLabel(1, "X Offset", -10, 50, 1, 1, 0xffffff)
    GUI.addLabel(2, "Y Offset", -10, 80, 1, 1, 0xffffff)
    GUI.addLabel(3, "Z Offset", -10, 110, 1, 1, 0xffffff)

    GUI.addLabel(4, "Rotation", 170, 50, 1, 1, 0xffffff)
    GUI.addLabel(5, "Pitch", 170, 80, 1, 1, 0xffffff)

    GUI.addLabel(6, "Power", -10, 170, 1, 1, 0xffffff)
    GUI.addLabel(7, "Duration", -30, 200, 1, 1, 0xffffff)
    GUI.addLabel(8, "Width", 170, 170, 1, 1, 0xffffff)
    GUI.addLabel(9, "Height", 170, 200, 1, 1, 0xffffff)
    GUI.addLabel(10, "Length", 170, 230, 1, 1, 0xffffff)
    GUI.addLabel(21, "Min T", 280, 170, 1, 1, 0xffffff)
    GUI.addLabel(22, "Max T", 280, 200, 1, 1, 0xffffff)
    GUI.addLabel(23, "Points", 278, 230, 1, 1, 0xffffff)

    GUI.addTextField(11, 60, 45, 50, 20).setText(x)
    GUI.addTextField(12, 60, 75, 50, 20).setText(y)
    GUI.addTextField(13, 60, 105, 50, 20).setText(z)
    GUI.addTextField(14, 220, 45, 50, 20).setText(rotation)
    GUI.addTextField(15, 220, 75, 50, 20).setText(pitch)
    GUI.addTextField(16, 40, 165, 50, 20).setText(power)
    GUI.addTextField(17, 40, 195, 50, 20).setText(duration)
    GUI.addTextField(18, 220, 165, 50, 20).setText(size_width)
    GUI.addTextField(19, 220, 195, 50, 20).setText(size_height)
    GUI.addTextField(20, 220, 225, 50, 20).setText(size_length)
    GUI.addTextField(31, 310, 165, 50, 20).setText(min_t)
    GUI.addTextField(32, 310, 195, 50, 20).setText(max_t)
    GUI.addTextField(33, 310, 225, 50, 20).setText(points)
    e.player.showCustomGui(GUI)
}

function customGuiClosed(e) {
    block.storeddata.put("x_offset", GUI.getComponent(11).getText())
    block.storeddata.put("y_offset", GUI.getComponent(12).getText())
    block.storeddata.put("z_offset", GUI.getComponent(13).getText())

    block.storeddata.put("rotation", GUI.getComponent(14).getText())
    block.storeddata.put("pitch", GUI.getComponent(15).getText())
    block.storeddata.put("power", GUI.getComponent(16).getText())
    block.storeddata.put("duration", GUI.getComponent(17).getText())
    block.storeddata.put("size_w", GUI.getComponent(18).getText())
    block.storeddata.put("size_h", GUI.getComponent(19).getText())
    block.storeddata.put("size_l", GUI.getComponent(20).getText())
    block.storeddata.put("min_t", GUI.getComponent(31).getText())
    block.storeddata.put("max_t", GUI.getComponent(32).getText())
    block.storeddata.put("points", GUI.getComponent(33).getText())

    x = block.storeddata.get("x_offset")
    y = block.storeddata.get("y_offset")
    z = block.storeddata.get("z_offset")

    rotation = block.storeddata.get("rotation")
    pitch = block.storeddata.get("pitch")
    power = block.storeddata.get("power")
    duration = block.storeddata.get('duration')
    size_width = block.storeddata.get("size_w")
    size_height = block.storeddata.get('size_h')
    size_length = block.storeddata.get('size_l')
    min_t = block.storeddata.get("min_t")
    max_t = block.storeddata.get("max_t")
    points = block.storeddata.get("points")
}




function MakeParticleDamageLine(entity, x1, y1, z1, x2, y2, z2, resolution, speed, particle, count, dx, dy, dz, dv) {
    var Thread = Java.type("java.lang.Thread"); var HankThread = Java.extend(Thread, {
        run: function () {
            var DX = (x2 - x1);
            var DY = (y2 - y1);
            var DZ = (z2 - z1);
            var ParticleAmount = Math.round(Math.pow(DX * DX + DY * DY + DZ * DZ, 0.5) * resolution)
            for (var i = 0; i < ParticleAmount; ++i) {
                var x = (x1 + DX * i / ParticleAmount).toFixed(4)
                var y = (y1 + DY * i / ParticleAmount).toFixed(4)
                var z = (z1 + DZ * i / ParticleAmount).toFixed(4)
                entity.world.spawnParticle(particle, x, y, z, dx, dy, dz, dv, count)
                Thread.sleep(speed)
            }
        }
    }); var H = new HankThread(); H.start();
}




function FrontVectors(entity, dr, dp, duration, mode) {
    if (!mode) mode = 0
    if (mode == 1) { var angle = dr + entity.getRotation(); var pitch = (-entity.getPitch() + dp) * Math.PI / 180; if (dp == 0) pitch = 0; }
    if (mode == 0) { var angle = dr; var pitch = (dp) * Math.PI / 180 }
    var dx = -Math.sin(angle * Math.PI / 180) * (duration
        * Math.cos(pitch))
    var dy = Math.sin(pitch) * duration
    var dz = Math.cos(angle * Math.PI / 180) * (duration
        * Math.cos(pitch))
    return [dx, dy, dz]
}
