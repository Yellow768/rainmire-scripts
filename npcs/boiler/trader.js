var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(API.getLevelDir() + "/scripts/ecmascript/boiler/scoreboard.js");
load(API.getLevelDir() + "/scripts/ecmascript/boiler/id_generator.js");



var npc
function init(e) {

    npc = e.npc
}
var trade_array = []


/**
 * @param {NpcEvent.InteractEvent} e
 */
function interact(e) {
    setUpVals(e)
    for (var i = 0; i < 11; i++) {
        if (e.npc.getDialog(i) && e.npc.getDialog(i).getAvailability().isAvailable(e.player)) {
            return
        }
    }
    if (e.npc.getFaction().playerStatus(e.player) == 2) {
        return
    }
    if (e.player.getTempdata().get("perk_tags").indexOf("barter") == -1) return
    saveOriginalTradeState(e)
    lower_prices(e)
    e.npc.reset()
    e.npc.getTimers().start(id("reset_trader_prices"), 2, false)
}

function saveOriginalTradeState(e) {
    function TradeSlot(curr1, curr2, sold) {
        this.curr1 = curr1
        this.curr2 = curr2
        this.sold = sold
    }
    trade_array = []
    for (var i = 0; i < 17; i++) {
        var trade = new TradeSlot(npc.role.getCurrency1(i).copy(), npc.role.getCurrency1(2).copy(), npc.role.getSold(i))
        trade_array.push(trade)
    }
}



function timer(e) {
    if (e.id == id("reset_trader_prices")) {
        resetTrader(e)
    }
}


function resetTrader(e) {
    for (var i = 0; i < 17; i++) {
        npc.role.set(i, trade_array[i].curr1, trade_array[i].curr2, trade_array[i].sold)
    }
}

function lower_prices(e) {
    var power = getScore("Heart")
    for (var i = 0; i <= 17; i++) {
        var currency1 = npc.role.getCurrency1(i)
        var currency2 = npc.role.getCurrency2(i)
        var newStack1 = currency1.getStackSize() * (1 - (power * 0.05))
        var newStack2 = currency2.getStackSize() * (1 - (power * 0.05))
        if (newStack1 < 1) {
            newStack1 = 1
        }
        if (newStack2 < 1) {
            newStack2 = 1
        }
        currency1.setStackSize(Math.floor(newStack1))
        currency2.setStackSize(Math.floor(newStack2))
        npc.role.set(i, currency1, currency2, npc.role.getSold(i))
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

