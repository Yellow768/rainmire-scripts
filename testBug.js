//Gameplay Mechanics Non-Datapack

function tick(e){
		if(e.player.inWater() && !e.player.hasTag("inWater")){
			e.player.addTag("inWater")
			if(e.player.getPotionEffect(13)==-1){
				e.player.addPotionEffect(13,getScore("breath"),0,true)
			}
		}
		
		if(!e.player.inWater() && e.player.hasTag("inWater")){
			e.player.removeTag("inWater")
		}
}