

var npc
function init(e) {
    npc = e.npc
}

function trigger(e) {
    if (e.id == 50) {
        var power = e.arguments[2]
        for (var i = 0; i < 17; i++) {
            var currency1 = npc.role.getCurrency1(i)
            var currency2 = npc.role.getCurrency2(i)
            var newStack1 = currency1.getStackSize() * (1 - (power * 0.10))
            var newStack2 = currency2.getStackSize() * (1 - (power * 0.10))
            var sold = npc.role.getSold(i)
            var soldStack = sold.getStackSize()
            if (sold.getMaxStackSize() > sold.getStackSize() + power) {
                soldStack += power
            }

            if (newStack1 < 1) {
                newStack1 = 1
            }
            if (newStack2 < 1) {
                newStack2 = 1
            }
            if (e.arguments[0] == true) {
                sold.setStackSize(soldStack)
                npc.addTag("charmed")
                npc.storeddata.put("power", power)
            }
            if (e.arguments[1] == true) {
                currency1.setStackSize(Math.floor(newStack1))
                currency2.setStackSize(Math.floor(newStack2))
            }

            npc.role.set(i, currency1, currency2, sold)
        }
    }
}

function trade(e) {
    if (e.npc.hasTag("charmed") && e.sold.getMaxStackSize() == 1) {
        for (var i = 0; i < e.npc.storeddata.get("power"); i++) {
            e.player.giveItem(e.sold)
        }
    }
}



//Make sure that trade() and tradeFailed() gets executed
function role(e) {
    roleTraderEvents(e);
}

//==========================================================
function roleTraderEvents(e) {
    var role = e.npc.role;
    if (role) {
        if (role.getType() == RoleType_TRADER) {
            if (e.isCancelable() && typeof trade === 'function') {
                trade(e);
            }
            if (!e.isCancelable() && typeof tradeFailed === 'function') {
                var fakeEvent = {
                    event: e,
                    API: e.API,
                    npc: e.npc,
                    player: e.player,
                    currency1: e.currency1,
                    currency2: e.currency2,
                    sold: e.sold,
                    isCanceled: false,
                    isCancelable: function () { return true; },
                    setCanceled: function (c) { this.isCanceled = !!c; },
                };
                tradeFailed(fakeEvent);

                if (fakeEvent.isCanceled) {
                    if (fakeEvent.sold) {
                        if (!e.player.giveItem(fakeEvent.sold)) {
                            e.player.dropItem(fakeEvent.sold);
                        }
                    }
                }
            }
        }
    }
}

