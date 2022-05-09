var stunnedNPC


function dot(v1, v2) {
    return v1[0] * v2[0] + v1[1] * v2[1]
}
function magn(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
}
function rotateVector(vec, ang) {
    ang = ang * (Math.PI / 180);
    var cos = Math.cos(ang);
    var sin = Math.sin(ang);
    return new Array(Math.round(10000 * (vec[0] * cos - vec[1] * sin)) / 10000, Math.round(10000 * (vec[0] * sin + vec[1] * cos)) / 10000);
};

function canSeePlayer(e) {
    /*vector math polyfills*/

    /**/
    var coneangle = 270; /*angle of cone of sight in degrees, change this for your needs*/
    /**/
    var rot = e.target.rotation | 0;
    if (rot < 0) {
        if (rot < -360) { rot = rot % 360 };
        rot = 360 + rot;
    } else { if (rot > 360) { rot = rot % 360 } } /*blame Noppes for broken rotations*/
    var vnpc = [0, 1]; /*base vector for rotation 0*/
    vnpc = rotateVector(vnpc, rot); /*rotate base vector by npcs rotation*/
    var vtg = [e.player.x - e.target.x, e.player.z - e.target.z] /*vector to target position*/
    /*var vtg = [e.player.x-e.target.x,e.player.z-e.target.z]; /* this was used with interact e for testing*/
    var angle = Math.acos(dot(vnpc, vtg) / (magn(vnpc) * magn(vtg))); /*angle between vectors*/
    angle = angle * (180 / Math.PI); /*angle to degrees*/
    angle = angle | 0;
    var seen = angle <= coneangle / 2 ? true : false;
    e.target.say(seen);
    return seen
}






function damagedEntity(e) {
    var critAptitudeDivider = 15
    checkIfBrokenWeapon(e)

    if (e.target.getType() == 2) {
        var weaponName = e.player.getMainhandItem().getItemName()
        switch (true) {
            case (doesStringContainPhrase(weaponName, "Torch")):
                e.player.removeItem("torch", 1)
                break;
            case (doesStringContainPhrase(weaponName, "Dagger")):
                if (!canSeePlayer(e)) {
                    e.target.kill()
                    e.player.message("Backstab!")
                }
                break;
            case (doesStringContainPhrase(weaponName, "Sickle")):
                if (e.damage >= e.player.getMainhandItem().getAttackDamage()) {
                    effectOnChance(e,.25, 20, 5, 2, false, e.target, "&cBLEEDING INFLICTED!")
                }
                break;
            case (doesStringContainPhrase(weaponName, "Axe")):
                if (e.damage >= e.player.getMainhandItem().getAttackDamage()) {
                    effectOnChance(e,.25, 20, 5, 2, false, e.target, "&cBLEEDING INFLICTED!")
                }
                break;
            case (doesStringContainPhrase(weaponName, "Mace")):
                critAptitudeDivider = 10
                break;
            case (doesStringContainPhrase(weaponName, "Broadsword")):
                var randChance = Math.random()
                if (e.damage >= e.player.getMainhandItem().getAttackDamage()) {
                    effectOnChance(e,.25, 20, 5, 2, false, e.target, "&cBLEEDING INFLICTED!")
                }
                break;
            case (doesStringContainPhrase(weaponName, "Warhammer")):
                if (e.damage >= e.player.getMainhandItem().getAttackDamage()) {
                    effectOnChance(e,.25, 2, 10, 100, false, e.target, "&cEnemy Crippled!")
                }
                break;
            case (doesStringContainPhrase(weaponName, "Scythe")):
                if (e.damage >= e.player.getMainhandItem().getAttackDamage()) {
                    effectOnChance(e,.25, 20, 10, 2, false, e.target, "&cBLEEDING INFLICTED!")
                }
                break;
            case (doesStringContainPhrase(weaponName, "Halberd")):
                if (e.damage >= e.player.getMainhandItem().getAttackDamage()) {
                    effectOnChance(e,.25, 20, 5, 2, false, e.target, "&cBLEEDING INFLICTED!")
                }
        }

    }
    if (Math.random() < getScore("Aptitude") / critAptitudeDivider) {
        e.damage *= 2
        e.player.message("&c&lCritical Hit!")
        executeCommand("/playsound iob:ui.crit player " + e.player.name + " ~ ~ ~")
        executeCommand("/particle minecraft:crimson_spore " + e.target.x + " " + e.target.y + " " + e.target.z + " .2 .5 .2 1000 50")
        executeCommand("/particle minecraft:enchanted_hit " + e.target.x + " " + e.target.y + " " + e.target.z + " .2 .5 .2 1 50")

    }
}



function effectOnChance(e,percentage, effect, time, strength, particles, target, message) {
    if (percentage > 1) {
        percentage = percentage / 100
    }
    if (percentage + (getScore("Aptitude")/20) > Math.random()) {
        target.addPotionEffect(effect, time, strength, particles)
        if (message != '') {
            e.player.message(message)
        }
    }
}

function checkIfBrokenWeapon(e) {
    var weapon = e.player.getMainhandItem()
    var weaponName = weapon.getItemName()

    if (weapon.isDamageable() && weapon.getDamage() >= weapon.getMaxDamage() - 1) {
        var modelData, amount, durability, name
        amount = Math.floor(weapon.getMaxDamage() / 500)



        switch (true) {
            case (weapon.getAttackDamage() < 5):
                modelData = 768001; name = "Low Quality";
                break;
            case (weapon.getAttackDamage() < 6):
                modelData = 768002; name = "Average Quality";
                break;
            case (weapon.getAttackDamage() < 8):
                modelData = 768003; name = "Quality";
                break;
            case (weapon.getAttackDamage() < 10):
                modelData = 768004; name = "High Quality";
                break;
            case (weapon.getAttackDamage() < 12):
                modelData = 768005; name = "Excellent Quality";
                break;
            case (weapon.getAttackDamage() < 14):
                modelData = 768006; name = "Superb Quality";
                break;
            default:
                modelData = 768007; name = "Exquisite Quality";
                break;
        }



        var item = e.API.getIWorld("overworld").createItem("minecraft:netherite_scrap", 1 + amount);
        item.setLore(["§dUsed to increase weapon/armor quality", "§7USED AT ANVILS"]);
        item.getNbt().getCompound("display").putString("Name", "{\"text\":\"" + name + " Fragment\",\"italic\":false}");
        item.getNbt().setInteger("CustomModelData", modelData);
        e.player.dropItem(item);

    }
}

function timer(e) {

    if (e.id == 768001) {
        stunnedNPC.getAi().setRetaliateType()
    }
    if (e.id == 768005) {
        e.player.updatePlayerInventory()
        e.player.message("WHAT")
    }


}

