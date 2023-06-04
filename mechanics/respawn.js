function init(e) {
	setUpVals(e)
	respawn(e)
	if (!e.player.storeddata.has("respawnArray")) {
		e.player.storeddata.put("respawnArray", "[[2,77,-221]]")
	}
}

function died(e) {
	e.player.playSound("minecraft:particle.soul_escape", 1, 1)
	e.player.addTag("Dead")
	e.player.addPotionEffect(15, 255, 255, false)
	var golden_coin = e.API.getIWorld("overworld").createItem("variedcommodities:coin_gold", 1)
	var diamond_coin = e.API.getIWorld("overworld").createItem("variedcommodities:coin_diamond", 1)
	var emerald_coin = e.API.getIWorld("overworld").createItem("variedcommodities:coin_emerald", 1)
	var gcCount = e.player.getInventory().count(golden_coin, true, true)
	var dcCount = e.player.getInventory().count(diamond_coin, true, true)
	var ecCount = e.player.getInventory().count(emerald_coin, true, true)

	e.player.removeItem(golden_coin, gcCount / 4)
	e.player.removeItem(diamond_coin, dcCount / 4)
	e.player.removeItem(emerald_coin, ecCount / 4)


}

function respawn(e) {
	if (e.player.hasTag("Dead")) {
		var x, y, z
		if (e.player.storeddata.has("remnantUUID")) {
			x = e.player.storeddata.get("spawnX")
			y = e.player.storeddata.get("spawnY")
			z = e.player.storeddata.get("spawnZ")
		}
		else {
			var respawnArray = JSON.parse(e.player.storeddata.get("respawnArray"))
			var closestPos
			var greatestDistance = null

			for (var i = 0; i < respawnArray.length; i++) {
				var pos = e.player.world.getBlock(respawnArray[i][0], respawnArray[i][1], respawn[i][1]).getPos()
				var currentDistance = e.player.pos.distanceTo(pos)
				if (greatestDistance == null || currentDistance < greatestDistance) {
					greatestDistance = currentDistance
					closestPos = pos
				}

			}
			x = closestPos.x
			y = closestPos.y
			z = closestPos.z
			respawnArray = JSON.stringify(respawnArray)
			e.player.storeddata.put("repawnArray", respawnArray)
		}


		e.player.removeTag("Dead")
		executeCommand('/title ' + e.player.name + ' times 20 40 20')
		executeCommand('/title ' + e.player.name + ' subtitle {"text":"Draw your first breath, once more","italic":true,"color":"yellow"}')
		executeCommand('/title ' + e.player.name + ' title {"text":"Return again","bold":true,"color":"yellow"}')

		e.player.addPotionEffect(15, 2, 2, false)
		e.player.addPotionEffect(14, 2, 2, false)
		e.player.setPosition(x, y, z)
		e.player.playSound("iob:ui.breath", 1, 1)
		e.player.playSound("minecraft:block.beacon.ambient", 1, 1)
	}
}