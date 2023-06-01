var self
var active = false
var was_set = false
var can_set = true

function init(e) {
    self = e.block
    e.block.world.spawnParticle("minecraft:enchanted_hit", e.block.x, e.block.y, e.block.z, .7, .7, .7, .002, 8)
    e.block.timers.forceStart(2, 20, true)
}

function interact(e) {
    if (e.player.gamemode == 1) {
        if (e.player.getMainhandItem().name == "minecraft:air" && can_set) {
            toggleActive(e)
            if (active) {
                e.player.message("Breakable wall is now active")
            }
            else {
                e.player.message("Breakable wall is inactive")
            }
        }
        return

    }
    if (active) {
        if (e.player.world.scoreboard.getPlayerScore(e.player.name, "Brawn") >= 3) {
            destroySelf(e, true)
        }
        else {
            sendRejectMessage(e)
        }
    }

}

function neighborChanged(e) {
    if (e.block.world.getBlock(e.changedPos).name == "minecraft:air" && active) {
        destroySelf(e, true)
    }
}

function destroySelf(e, playSound) {
    e.API.executeCommand(self.world, "/particle block " + self.model.name + " " + self.x + " " + self.y + " " + self.z + " .5 1 .5 .06 300")
    if (playSound) {
        self.world.playSoundAt(self.pos, "minecraft:block.stone.break", 1, 1)
        self.world.playSoundAt(self.pos, "minecraft:entity.turtle.egg_break", 1, 1)
        self.world.playSoundAt(self.pos, "minecraft:entity.player.attack.knockback", 1, 1)
        self.world.playSoundAt(self.pos, "minecraft:entity.player.attack.crit", 1, 1)
    }

    self.world.spawnParticle("minecraft:cloud", self.x, self.y, self.z, .5, 1, .5, .01, 20)
    self.world.spawnParticle("minecraft:campfire_cosy_smoke", self.x, self.y + 1, self.z, .5, 1, .5, .05, 10)
    self.remove()
}


function sendRejectMessage(e) {
    e.API.executeCommand(e.block.world, '/title ' + e.player.name + ' actionbar {"text":"Brawn Too Low","bold":true,"color":"#FF002D"}')
    e.player.world.playSoundAt(e.block.pos, "minecraft:entity.player.attack.weak", 1, 1)

}

function trigger(e) {
    if (e.id == 1 && active) {
        destroySelf(e, true)
    }
    if (e.id == 2) {
        switch (was_set) {
            case false:
                toggleActive(e)
                self.timers.start(1, 40, false)

                break;
        }

    }
    if (e.id == 3) {
        self.setModel(e.arguments[0])
    }
}

function timer(e) {
    if (e.id == 1) {
        was_set = false
    }
    if (e.id == 2) {
        e.block.world.spawnParticle("minecraft:enchanted_hit", e.block.x, e.block.y, e.block.z, .7, .7, .7, .002, 8)
    }
    if (e.id == 3) {
        can_set = true
    }
}

function toggleActive(e) {
    was_set = true
    for (var i = 0; i < 6; i++) {
        var curr_block
        switch (i) {
            case 0:
                curr_block = self.world.getBlock(self.x, self.y - 1, self.z)
                break;
            case 1:
                curr_block = self.world.getBlock(self.x, self.y + 1, self.z)
                break;
            case 2:
                curr_block = self.world.getBlock(self.x - 1, self.y, self.z)
                break;
            case 3:
                curr_block = self.world.getBlock(self.x + 1, self.y, self.z)
                break;
            case 4:
                curr_block = self.world.getBlock(self.x, self.y, self.z - 1)
                break;
            case 5:
                curr_block = self.world.getBlock(self.x, self.y, self.z + 1)
                break;

        }
        if (curr_block.name.indexOf("scripted") != -1) {
            curr_block.trigger(2)
        }
    }
    active = !active
    can_set = false
    self.timers.forceStart(3, 40, false)
    if (!active) {
        self.world.spawnParticle("minecraft:enchanted_hit", self.x, self.y, self.z, .7, .7, .7, .002, 5)
        self.timers.start(2, 20, true)
    }
    else {
        self.world.spawnParticle("minecraft:soul_fire_flame", self.x, self.y, self.z, 1, 1, 1, .002, 8)
        self.timers.stop(2)
    }

}