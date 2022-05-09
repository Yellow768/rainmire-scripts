var statsStringArray = ["Charm","Empathy","Suggestion","Brawn","Grit","Deftness","Intellect","Perception","Aptitude"]
var GUI_STATS
var xPos = [18,100,180]
var yPos = [42,62,84]

function levelUp(e) {
	if (e.player.hasTag("LevelUp")) {
		e.player.removeTag("LevelUp")
		addToScore("AttrPoints", 1)
		executeCommand("/playsound minecraft:ui.toast.challenge_complete player " + e.player.name + " ~ ~ ~")
		executeCommand("/particle minecraft:end_rod ~ ~ ~ .5 .5 .5 .5 100")
		executeCommand('/title ' + e.player.name + ' actionbar {"text":"You have leveled up!","bold":true,"color":"yellow"}')
		executeCommand('/title '+e.player.name+' times 0 40 20')
		executeCommand('/title '+e.player.name+' subtitle {"text":"Check stats screen!","bold":true,"color":"gold"}')
		executeCommand('/title '+e.player.name+' title {"text":"LEVEL UP!","bold":true,"color":"gold"}')
		e.player.message("&e&lYou have leveled up! Press X to view your stats screen!")

		if (e.player.getExpLevel() % 2 == 0) {
			addToScore("PerkPoints", 1)
		}
	}
}


function keyPressed(e){
	
	if(e.key==88 && e.openGui == ''){
		createStatsScreen(e)
		}
}




function updateStats(){
	for(var i = 0; i< 9; i++){
		setScore(statsStringArray[i],getScore(statsStringArray[i]+"Base")+getScore(statsStringArray[i]+"Mod"))	
	}
}

function tick(e){
	updateStats()
}

function createStatsScreen(e){
	GUI_STATS = e.API.createCustomGui(id("STATS_GUI"),256,256,false)
	GUI_STATS.setBackgroundTexture("iob:textures/customgui/statsscreen.png")
	createScores()
	createValues()
	if(getScore("AttrPoints")>0){
		createUpgradeButtons()
	}
	e.player.showCustomGui(GUI_STATS)
}

function returnAttString(val){
	return "iob:textures/customgui/att_level_"+val+".png"
	
}

function createScores(){
	var L_Stat = 0

	updateStats()
	GUI_STATS.addTexturedRect(L_Stat+1,returnAttString(getScore("Charm")),xPos[0],yPos[0],70,8)
	GUI_STATS.addTexturedRect(L_Stat+2,returnAttString(getScore("Empathy")),xPos[0],yPos[1],70,8)
	GUI_STATS.addTexturedRect(L_Stat+3,returnAttString(getScore("Suggestion")),xPos[0],yPos[2],70,8)
	
	GUI_STATS.addTexturedRect(L_Stat+4,returnAttString(getScore("Brawn")),xPos[1],yPos[0],70,8)
	GUI_STATS.addTexturedRect(L_Stat+5,returnAttString(getScore("Grit")),xPos[1],yPos[1],70,8)
	GUI_STATS.addTexturedRect(L_Stat+6,returnAttString(getScore("Deftness")),xPos[1],yPos[2],70,8)
	
	GUI_STATS.addTexturedRect(L_Stat+7,returnAttString(getScore("Intellect")),xPos[2],yPos[0],70,8)
	GUI_STATS.addTexturedRect(L_Stat+8,returnAttString(getScore("Perception")),xPos[2],yPos[1],70,8)
	GUI_STATS.addTexturedRect(L_Stat+9,returnAttString(getScore("Aptitude")),xPos[2],yPos[2],70,8)
	
}

function createValues(){
	var xpThreshold = 0
	for(var i = 0;i<player.getExpLevel();i++){
			xpThreshold+=50+((i)*50)
	}
	
	var speedAttribute = (.04+(getScore("Deftness")*.03)) * 43.1
	var speedString = speedAttribute.toString()
	
	var swimSpeed = 5.612*(1+(0.5*getScore("swmspd"))) 
	var swimString = swimSpeed.toString()
	
	GUI_STATS.addLabel(30,player.getExpLevel(),45,117,1,1)
	GUI_STATS.addLabel(31,player.storeddata.get("totalExperiencePoints")+"/"+xpThreshold,45,137,1,1)
	GUI_STATS.addLabel(52,getScore("AttrPoints"),220,117,1,1)
	GUI_STATS.addLabel(53,getScore("PerkPoints"),220,137,1,1)
	
	
	
	GUI_STATS.addLabel(500,player.getMaxHealth(),58,188,1,1)
	GUI_STATS.addLabel(401,speedString.substr(0,4)+" m/s",58,208,1,1)
	GUI_STATS.addLabel(90,-3+getScore("Brawn")*2,58,228,1,1)
	
	GUI_STATS.addLabel(91,getScore("breath")+"s",220,188,1,1)
	GUI_STATS.addLabel(92,swimString.substr(0,4)+" m/s",220,208,1,1)
	GUI_STATS.addLabel(93,10*getScore("Aptitude")+"%",220,228,1,1)
}

function createUpgradeButtons(){
	var xint = 0
	var yint = 0
	for(var i = 0; i < 9; i ++){
		if(getScore(statsStringArray[i]+"Base") < 5){
			GUI_STATS.addTexturedButton(20+i,'',xPos[xint]+55,yPos[yint]-1,8,9,"iob:textures/customgui/add.png")
		}
		if(yint<2){yint++}
		else{
			xint++
			yint=0		
		}	
	}
}

function customGuiButton(e){
	for(var i = 0; i < 9; i++){
		if(e.buttonId==20+i){
		    addToScore(statsStringArray[i]+"Base",1)
			addToScore("AttrPoints",-1)
			createStatsScreen(e)
		}
	}
}

