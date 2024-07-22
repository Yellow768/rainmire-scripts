function checkPhantomInteractions(e) {
	if (e.target.name != "Phantom") {
		return
	}
	if (e.player.getMainhandItem().name == "minecraft:golden_carrot") {
		e.setCanceled(true)
		var nbt = e.target.getEntityNbt()
		var ATTI = nbt.getList("Attributes", 10)
		ATTI[3].setDouble("Base", ATTI[3].getDouble("Base") + 0.1)
		e.target.setEntityNbt(nbt)
		e.player.message("&aPhantom's speed has been upgraded!")
		e.player.world.spawnParticle("minecraft:angry_villager", e.target.x, e.target.y, e.target.z, .5, .5, .5, .01, 50)
		e.player.removeItem(e.player.getMainhandItem(), 1)
		e.player.world.playSoundAt(e.target.pos, "minecraft:item.trident.return", 1, 1)
		e.player.world.playSoundAt(e.target.pos, "minecraft:entity.horse.eat", 1, 1)

	}
}

function savePhantom(e) {
	var nearbyPhantoms = findNearbyPhantoms(e)
	if (nearbyPhantoms.length < 1) {
		return
	}
	for (var i = 0; i < nearbyPhantoms.length; i++) {
		if (nearbyPhantoms[i].getUUID() == e.player.tempdata.get("PhantomUUID")) {
			e.API.clones.set(9, e.player.name + " 's Phantom", nearbyPhantoms[i])
		}
	}
}



function togglePhantom(e) {
	if (!getScore("soulBoundHorse")) {
		return
	}
	savePhantom(e)
	if (!removePhantom(e, true)) {
		summonPhantom(e)
	}
}

function doesUUIDMatch(e, target) {
	if (e.player.tempdata.get("PhantomUUID") == undefined) {
		return false
	}
	return target.getUUID() == e.player.tempdata.get("PhantomUUID")

}



function removePhantom(e, correctUUID) {
	var nearbyPhantoms = findNearbyPhantoms(e)
	var result = false

	for (var i = 0; i < nearbyPhantoms.length; i++) {
		if (doesUUIDMatch(e, nearbyPhantoms[i]) == correctUUID) {
			nearbyPhantoms[i].despawn()
			e.player.world.spawnParticle("minecraft:dragon_breath", nearbyPhantoms[i].x, nearbyPhantoms[i].y, nearbyPhantoms[i].z, .5, 1, .5, .2, 50)
			e.player.world.playSoundAt(nearbyPhantoms[i].pos, "minecraft:entity.puffer_fish.sting", 1, 1)
			result = true
		}
	}
	return result
}

function findNearbyPhantoms(e) {
	var nearbyPhantoms = []
	var nE = e.player.world.getNearbyEntities(e.player.pos, 80, 4)
	if (nE.length < 1) {
		return nearbyPhantoms
	}
	for (var i = 0; i < nE.length; i++) {
		if (nE[i].hasTag("Owner : " + e.player.name)) {
			nearbyPhantoms.push(nE[i])
		}

	}
	return nearbyPhantoms
}




function summonPhantom(e) {

	var raytrace = e.player.rayTraceBlock(15, true, true)
	var rayPos = e.player.pos

	if (raytrace != null) {
		rayPos = raytrace.getPos()
	}
	rayPos.up(2)
	e.player.world.spawnParticle("minecraft:soul", rayPos.x, rayPos.y + 2, rayPos.z, 1, 2, 1, .01, 500)
	e.player.world.spawnParticle("minecraft:soul", rayPos.x, rayPos.y + 2, rayPos.z, .2, 2, .2, .01, 500)
	e.player.world.spawnParticle("minecraft:cloud", rayPos.x, rayPos.y + 3, rayPos.z, .4, .4, .4, .01, 200)
	e.player.world.playSoundAt(rayPos, "minecraft:block.respawn_anchor.set_spawn", 1, 1)
	e.player.world.playSoundAt(rayPos, "minecraft:entity.horse.angry", 1, 1)
	var spawned_phantom
	try {

		spawned_phantom = e.API.clones.spawn(rayPos.x, rayPos.y + 2, rayPos.z, 9, e.player.name + " 's Phantom", e.player.world)
		spawned_phantom.addTag(e.player.world.storeddata.get(e.player.name + "_phantom"))
		if (spawned_phantom.getHealth() <= 1) {
			spawned_phantom.setHealth(30)
		}
		spawned_phantom.generateNewUUID()
		e.player.tempdata.put("PhantomUUID", spawned_phantom.getUUID())
	} catch (error) {
		executeCommand('/summon minecraft:horse ' + rayPos.x + ' ' + (rayPos.y + 2) + ' ' + rayPos.z + ' {Variant:1029,SaddleItem:{id:saddle,Count:1},Tame:1,Temper:0,CustomName:\'[{"text":"Phantom","bold":true,"color":"white","underlined":true,"italic":true}]\',CustomNameVisible:1b,Health:30,Invulnerable:0b,Tags:["Owner : ' + e.player.name + '","0"],Attributes:[{Name:"generic.movement_speed",Base:0.3f},{Name:"generic.max_health",Base:30f},{Name:"horse.jump_strength",Base:0.7f}]}')
		var nE = e.player.world.getNearbyEntities(e.player.pos, 40, 4)
		if (nE.length > 0) {
			for (var i = 0; i < nE.length; i++) {
				if (nE[i].hasTag("Owner : " + e.player.name)) {
					e.API.clones.set(9, e.player.name + " 's Phantom", nE[i])
					e.player.tempdata.put("PhantomUUID", nE[i].getUUID())
				}
			}
		}
	}
}
