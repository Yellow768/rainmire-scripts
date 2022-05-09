var ANVIL_GUI



function interact(e){
    showGui(e)
}


function showGui(e){
    ANVIL_GUI = e.API.createCustomGui(e.player.getUUID(),176,166,false)
    ANVIL_GUI.setBackgroundTexture("iob:textures/customgui/improve.png")
    ANVIL_GUI.showPlayerInventory(8,84)
    ANVIL_GUI.addItemSlot(27,47)
    ANVIL_GUI.addItemSlot(76,47)
    ANVIL_GUI.addLabel(45,"Not a weapon",120,10,10,10)
    ANVIL_GUI.addButton(46,"Not a weapon",120,80,10,10)
    e.player.showCustomGui(ANVIL_GUI)
}


function customGuiButton(e){
    
    var label = ANVIL_GUI.getComponent(45)     
    label.setText("WOOOO")
    ANVIL_GUI.updateComponent(label)
    ANVIL_GUI.update(e.player)
}


function customGuiClosed(e){
    for(var i = 0; i < 2; i ++){
        if(ANVIL_GUI.getSlots()[i].hasStack()){
            e.player.dropItem(ANVIL_GUI.getSlots()[i].getStack())
        }
    }
    
    e.player.updatePlayerInventory()
    

}

function customGuiSlot(e){
    var slot1,slot2
    slot1 = ANVIL_GUI.getSlots()[0]
    slot2 = ANVIL_GUI.getSlots()[1]
    
    if(slot1.hasStack() && slot2.hasStack()){
        var weaponDamage = slot1.getStack().getAttackDamage()
        switch(true){
            case(weaponDamage==0):
                
                //ANVIL_GUI.update(e.player)
                e.player.message("Not a weapon")
                break;
            
        }
    }
}
