var powered = false
var block,x,y,z,scoreboard,destroy
var TRAP_GUI
var inGracePeriod = false

function init(e){
	e.block.setModel("supplementaries:lock_block")
	e.block.setScale(1,.8,1)
	
	
	block = e.block
	x = block.x
	y = block.y
	z = block.z
	e.block.timers.stop(1)
	scoreboard = e.block.world.getScoreboard()

	if(dataGet("particleX") == undefined){
		dataPut("particleX",0)
		dataPut("particleY",0)
		dataPut("particleZ",0)
	}
	if(dataGet("percCheck")=="undefined"){
		dataPut("percCheck",1)
	}
	if(dataGet("radius")==undefined){
		dataPut("radius",1)
	}
	if(dataGet("destroy")==undefined){
		dataPut("destroy",false)
	}
	
}


function neighborChanged(e){
    if(checkRedstonePower() > 0 && !powered && !isDisabled()){
        powered = true
        e.block.setRedstonePower(15)
        e.block.timers.forceStart(1,30,false)
    }
    if(checkRedstonePower() == 0 && powered){
        powered = false
        e.block.setRedstonePower(0)
    }    
}


function tick(e){
	if(!isDisabled() && !inGracePeriod){
		var nE = e.block.world.getNearbyEntities(dataGet("particleX"),dataGet("particleY"),dataGet("particleZ"),dataGet("radius"),1)
		for(var i = 0; i<nE.length;i++){
			if(getScore(nE[i].name,"Perception") > dataGet("percCheck")-1){
				setDisabled(1)
				e.block.executeCommand('/tellraw @a[distance=..15] {"text":"'+nE[i].name+' disabled a trap! (Perception Level > '+dataGet("percCheck")+')","color":"green"}')
				e.block.executeCommand("/particle minecraft:dragon_breath "+dataGet("particleX")+" "+dataGet("particleY")+" "+dataGet("particleZ")+" .5 .5 .5 .2 40")
				e.block.executeCommand("/playsound iob:ui.trap_disabled block @a[distance=..15] "+dataGet("particleX")+" "+dataGet("particleY")+" "+dataGet("particleZ")+" 1")
				if(destroy){
					e.block.executeCommand("setblock "+dataGet("particleX")+" "+dataGet("particleY")+" "+dataGet("particleZ")+" minecraft:air")
				}
			}
		}
	}
}







function interact(e){
	if(dataGet("destroy")==1){
		destroy = "true"
	}
	else
	{
		destroy = "false"
	}
	
	TRAP_GUI = e.API.createCustomGui(1,256,256,false)
	TRAP_GUI.addLabel(10,"Trap GUI",110,0,1,1)
	TRAP_GUI.addLabel(20,"Perception Level",0,50,1,1)
	TRAP_GUI.addLabel(30,"Trap Coordinates",0,80,1,1)
	TRAP_GUI.addLabel(31,"Disable Radius",0,170,1,1)
	TRAP_GUI.addLabel(32,"Destroy Block?",0,140,1,1)
	
	TRAP_GUI.addTextField(21,110,45,75,15)
	TRAP_GUI.getComponent(21).setText(dataGet("percCheck"))
	
	TRAP_GUI.addTextField(22,110,70,50,15)
	TRAP_GUI.addTextField(23,180,70,50,15)
	TRAP_GUI.addTextField(24,250,70,50,15)
	
	
	
	TRAP_GUI.getComponent(22).setText(dataGet("particleX"))
	TRAP_GUI.getComponent(23).setText(dataGet("particleY"))
	TRAP_GUI.getComponent(24).setText(dataGet("particleZ"))
	
	TRAP_GUI.addTextField(25,110,160,50,15)
	TRAP_GUI.getComponent(25).setText(dataGet("radius"))
	
	TRAP_GUI.addButton(33,destroy,110,130,50,20)
	TRAP_GUI.addButton(40,"Use Player Coordinates",110,100,140,20)
	TRAP_GUI.addButton(50,"Save Changes",0,230,100,20)
	e.player.showCustomGui(TRAP_GUI)
}


function customGuiButton(e){
	if(e.buttonId==40){
		TRAP_GUI.getComponent(22).setText(Math.round(e.player.x))
		TRAP_GUI.getComponent(23).setText(Math.round(e.player.y))
		TRAP_GUI.getComponent(24).setText(Math.round(e.player.z))
		
	}
	if(e.buttonId==50){
	inGracePeriod = true
	e.player.closeGui()
	dataPut("percCheck",TRAP_GUI.getComponent(21).getText())
	
	dataPut("particleX",TRAP_GUI.getComponent(22).getText())
	dataPut("particleY",TRAP_GUI.getComponent(23).getText())
	dataPut("particleZ",TRAP_GUI.getComponent(24).getText())
	dataPut("radius",TRAP_GUI.getComponent(25).getText())
	
	block.timers.forceStart(2,60,false)
	block.setLight(15)
	block.executeCommand('/tellraw @a {"text":"Trap Block Enabling in 5 Seconds... ","color":"aqua"}')
	}
	
	if(e.buttonId==33){
		if(dataGet("destroy")==0){
			dataPut("destroy",1)
			destroy = "true"
		}
		else{
			dataPut("destroy",0)
			destroy = "false"
		}
		TRAP_GUI.getComponent(33).setLabel(destroy)
	}
	TRAP_GUI.update(e.player)
}

function timer(e){
	if(e.id==1){
		e.block.setRedstonePower(0)
	}
	if(e.id==2){
		inGracePeriod = false
		dataPut("disabled",0)
		block.setLight(0)
	}
}



function getScore(playerName,scoreBoardName){
	if(scoreboard.hasPlayerObjective(playerName, scoreBoardName)){
		return scoreboard.getPlayerScore(playerName, scoreBoardName)
	}		
}

function checkRedstonePower(){
    return block.world.getRedstonePower(x,y,z)
}


function dataPut(key,val){
	block.storeddata.put(key,val)
}

function dataGet(key){
	return block.storeddata.get(key)
}

function isDisabled(){
	return dataGet("disabled")
}

function setDisabled(val){
	dataPut("disabled",val)
}



function say(string){
	block.executeCommand("say "+string)
}