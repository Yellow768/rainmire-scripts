var EventFunctions = {
    none: 0,
    attack: 1,
    damagedEntity: 2,
    died: 3,
    init: 4,
    interact: 5,
    kill: 6,
    tick: 7,
    rangedLaunched: 8,
    damaged: 9

}
var attackFuncs = []
var damagedEntityFuncs = []
var damagedFuncs = []
var diedFuncs = []
var initFuncs = []
var interactFuncs = []
var killFuncs = []
var tickFuncs = []
var rangedLaunchedFuncs = []

var good_perks = {
    sword_master: new Perk(
        "Sword Master",
        ["Increased Damage With Swords!"],
        3,
        EventFunctions.damagedEntity,
        function (e) {
            if (e.damageSource.isProjectile()) return
            e.damage += e.damage * .40
        }
    ),
    ranged_master: new Perk(
        "Ranged Master",
        ["Increased Damage With Bows!"],
        3,
        EventFunctions.damagedEntity,
        function (e) {
            if (!e.damageSource.isProjectile()) return
            e.damage += e.damage * .40
        }
    ),
    arrow_recovery: new Perk(
        "Arrow Recovery",
        ["50% Chance to recover an arrow after", "it hits a target!"],
        3,
        EventFunctions.damagedEntity,
        function (e) {
            if (!e.damageSource.isProjectile()) return
            if (getRandomFloat(0, 100) > 50) {
                e.player.giveItem(e.player.world.createItem("arrow", 1))
            }
        }
    ),
    water_leech: new Perk(
        "Water Leech",
        ["Damaging a target restores 1/2 hydration unit"],
        3,
        EventFunctions.damagedEntity,
        function (e) {
            addToScore("perk_power", 1)
            setScore("restore_hydrate", 1)
        }
    ),
    desperate_damage: new Perk(
        "Birthday Armor",
        ["You do +2 damage each missing piece of armor."],
        3,
        EventFunctions.damagedEntity,
        function (e) {
            for (var i = 0; i < 4; i++) {
                if (e.player.getArmor(i).isEmpty()) {
                    e.damage += 2
                }
            }
        }
    ),
    swift_as_a_river: new Perk(
        "Swift As A River",
        ["Speed boost"],
        3,
        EventFunctions.none,
        function (e) {
        },
        "speed_perk"
    ),
    mind_over_matter: new Perk(
        "Mind Over Matter",
        ["§fEach level in §bMind §fadds a 5% chance to ignore incoming damage",
            "§7Your enhanced perception allows your body to brace for and dodge incoming attacks,",
            "§7without you even thinking about it."
        ],
        3,
        EventFunctions.damaged,
        function (e) {
            var chance_threshold = getScore("Mind") * 5
            if (getRandomInt(0, 100) < chance_threshold) {
                e.setCanceled(true)
                e.player.message("&bMind Over Matter &fnegated damage!")
            }
        }
    ),
    faster_attack: new Perk(
        "Fast Swing",
        ["§fYour attack speed is increased.",
            "§7Your joints are slightly dislocated,",
            "§7but this allows you to swing with less resistance."
        ],
        3,
        EventFunctions.none,
        function (e) {
        },
        "faster_attack"
    ),
    last_stand: new Perk(
        "Last Stand",
        ["§fYour damage is doubled when at 3 hearts or lower.",
            "§7You can swing harder without all that blood",
            "§7weighing you down."
        ],
        3,
        EventFunctions.damaged,
        function (e) {
            if (e.player.health <= 4) {
                e.damage *= 2
            }
        }
    ),
    blood_cost: new Perk(
        "Blood Cost",
        ["§fWhen out of hydration, you may substitute it with health.",
            "§7Blood is 70% water."
        ],
        3,
        EventFunctions.none,
        function (e) {
        },
        "blood_cost"
    ),
    blood_leech: new Perk(
        "Blood Leech",
        ["§fDamaging targets restores 1/2 heart",
            "§7Siphon your enemie's blood into your own."
        ],
        3,
        EventFunctions.damagedEntity,
        function (e) {
            if (e.damage > 0 && e.player.getHealth() < e.player.maxHealth()) {
                e.player.setHealth(e.player.getHealth() + 1)
            }
        }
    ),
    barter: new Perk(
        "Bartering",
        ["§fYou get a 5% discount at shops for every level in §cHeart",
            "§7You gain incredible insticts in the way you compose yourself,",
            "§7how you speak, and what your face is doing. People *want* to give you better deals"
        ],
        3,
        EventFunctions.none,
        function (e) {
        },
        "barter"
    ),
    perfect_aim: new Perk(
        "Perfect Aim",
        ["§fYour arrows are not affected by gravity",
            "§7You send out a small stream of water that guides the arrow,",
            "§7exactly where you want it."
        ],
        3,
        EventFunctions.rangedLaunched,
        function (e) {
            e.player.timers.forceStart(id("findArrowForPerfectAim"), 0, false)
            e.player.world.playSoundAt(e.player.pos, "minecraft:ambient.underwater.enter", .6, 1)
            e.player.world.playSoundAt(e.player.pos, "create:fwoomp", 1, 2)
        }
    ),
    wave_slice: new Perk(
        "Wave Slice",
        ["§fYou send out a short wave of water with each swing"
        ],
        3,
        EventFunctions.attack,
        function (e) {
            e.player.trigger(id("remoteUseHydration"), [2, id("send_wave_slice")])
        }
    ),
    healthy_gut: new Perk(
        "Healthy Gut",
        ["§fFood heals an extra half heart for every level in §aBody.",
            "§7Microbes or something."
        ],
        3,
        EventFunctions.none,
        function (e) {
        },
        "healthy_gut"
    )
}
var all_water_projectiles = []

var dampening_perks = {
    weak_swing: new Perk(
        "Weak Swing",
        ["Melee Damage is reduced by half"],
        12,
        EventFunctions.damagedEntity,
        function (e) {
            if (e.damageSource.isProjectile()) return
            e.damage /= 2
        }
    ),
    reckless: new Perk(
        "Reckless",
        ["While you get the job done, your tool takes a beating"],
        12,
        EventFunctions.damagedEntity,
        function (e) {
            if (e.damageSource.isProjectile()) return
            var item = e.player.getMainhandItem()
            if (item.isDamageable()) {
                item.setDamage(item.getDamage() + 1)
            }
        }
    ),
    weak_pull: new Perk(
        "Weak Pull",
        ["Your archery technique is damepened, halving bow damage"],
        12,
        EventFunctions.damagedEntity,
        function (e) {
            if (!e.damageSource.isProjectile()) return
            e.damage /= 2
        }
    ),
    thin_skinned: new Perk(
        "Thin Skinned",
        ["You take more damage"],
        12,
        EventFunctions.damaged,
        function (e) {
            e.damage += 2
        }
    ),
    frail_fingers: new Perk(
        "Frail Fingers",
        ["Occasionally, you completely falter your bow draw that you break your arrow."],
        12,
        EventFunctions.rangedLaunched,
        function (e) {
            var chance = getRandomFloat(0, 100)
            if (chance < 35) {
                e.setCanceled(true)
                e.player.playSound("minecraft:entity.item.break", .7, 1)
                var items = e.player.inventory.getItems()
                for (var i = 0; i < items.length; i++) {
                    if (items[i].name == "minecraft:arrow") {
                        items[i].setStackSize(items[i].getStackSize() - 1)
                    }
                }
                var d = FrontVectors(e.player, e.player.rotation, e.player.pitch, 1, 0)
                e.API.executeCommand(e.player.world, "particle item arrow " + (e.player.x + d[0]) + " " + ((e.player.y - d[1]) + 1.3) + " " + (e.player.z + d[2]) + " 0.2 0.2 0.2 0 20")
            }
        }
    ),
    squeamish: new Perk(
        "Squeamish",
        ["§fKilling a target < 4 blocks away has a 30% chance to become",
            "§fnauseos and slow for 8 seconds. An additional +5% is added for each level in §cHeart."
        ],
        12,
        EventFunctions.kill,
        function (e) {
            if (TrueDistanceEntities(e.player, e.entity) < 4) {
                if (getRandomInt(0, 100) < 30 + (5 * getScore("Heart"))) {
                    e.player.addPotionEffect(9, 15, 2, false)
                    e.player.addPotionEffect(2, 15, 2, false)
                    e.player.message("&6You can't handle the sight")
                }
            }
        }
    ),
    collateral_damage: new Perk(
        "Collateral Damage",
        ["§fWhen your weapon breaks, you take 3 hears of damage"],
        12,
        EventFunctions.none,
        function (e) {
        },
        "collateral_damage"
    ),
    winded: new Perk(
        "Winded",
        ["§fIt hurts your lungs to run."],
        12,
        EventFunctions.none,
        function (e) {
        },
        "winded"
    ),
    fragile_feet: new Perk(
        "Fragile Feet",
        ["§fYou take extra damage from fall damage"],
        12,
        EventFunctions.damaged,
        function (e) {
            if (e.damageSource.getType() == "fall") {
                e.damage += 4
            }
        }
    ),
    bouncy: new Perk(
        "Bouncy",
        ["§fYou are knockbacked farther by damage"],
        12,
        EventFunctions.none,
        function (e) {
        },
        "bouncy"
    ),
    sloth: new Perk(
        "Sloth",
        ["§fYour attack speed is significantly lowered"],
        12,
        EventFunctions.none,
        function (e) {
        },
        "sloth"
    ),
    sweaty: new Perk(
        "Sweaty",
        ["§fThe perspiration on your hands dissolves jelly as soon as you apply it"],
        12,
        EventFunctions.none,
        function (e) {
        },
        "sweaty"
    ),
    pescetarian: new Perk(
        "Pescetarian",
        ["§fYour body can no longer digest meat other than fish. Eating non-fish meat items has no benefits"],
        12,
        EventFunctions.none,
        function (e) {
        },
        "pescetarian"
    ),

    vegetarian: new Perk(
        "Vegetarian",
        ["§fYour body can no longer digest meat. Eating meat-based food has no benefits"],
        12,
        EventFunctions.none,
        function (e) {
        },
        "vegetarian"
    ),
    social_anxiety: new Perk(
        "Social Anxiety",
        ["§fFailing an attribute roll causes damage based on its difficulty."],
        12,
        EventFunctions.none,
        function (e) {
        },
        "social_anxiety"
    )
}





function Perk(name, description, cost, event, func, tag) {
    this.name = name || " "
    this.description = description || " "
    this.cost = cost || 1
    this.event = event || 0
    this.func = func || function (e) { }
    this.tag = tag || ""
}

