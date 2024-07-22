//Gameplay Mechanics Non-Datapack
var confirm = false
var cantAttack = false
var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + "/scripts/ecmascript/boiler/id_generator.js");
load(api.getLevelDir() + "/scripts/ecmascript/boiler/commonFunctions.js");
load(api.getLevelDir() + "/scripts/ecmascript/boiler/scoreboard.js");
load(api.getLevelDir() + "/scripts/ecmascript/player_mechanics/attributes/attributes_gui.js");
load(api.getLevelDir() + "/scripts/ecmascript/player_mechanics/attributes/perks_gui.js");
load(api.getLevelDir() + "/scripts/ecmascript/player_mechanics/attributes/stats.js");





function init(e) {

	setUpVals(e)
}





function timer(e) {
	switch (e.id) {
		case id("changeJustLoggedIn"):
			justLoggedIn = false
			break;
		case 30:
			confirm = false
			break;
		case 40:
			cantAttack = false
		case 510001:
			e.player.removeTag("paralyzed")
			break;


	}
}




function toss(e) {
	if (e.item.nbt.has("questItem") && confirm == false) {
		e.setCanceled(true)
		confirm = true
		e.player.message("&eYou second guess whether you should throw that away. If you're sure, go ahead and toss it again.")
		e.player.giveItem(e.item)
		e.player.timers.forceStart(30, 60, false)
	}
	preventPerkToss(e)
}




