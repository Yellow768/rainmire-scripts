function collide(e){
    if(e.entity.type==4){
    e.block.world.explode(e.block.x,e.block.y,e.block.z,2,false,false)
    e.block.remove()
    }
    
    }