function damaged(e){
    if (e.npc.timers.has(1) == false){
    e.npc.timers.forceStart(1, 160, false)
}}

function timer(e){
    if(e.id == 1 && e.npc.isAlive() == true){
    var x = e.npc.x
    var y = e.npc.y
    var z = e.npc.z

var Thread = Java.type("java.lang.Thread");
var HThread = Java.extend(Thread,{
run: function(){

e.npc.world.spawnParticle("flame", x, y+2, z, 0.1, 0.1, 0.1, 0.01, 10)
Thread.sleep(2000)
e.npc.setMotionY(2)
while (e.npc.MCEntity().isOnGround() == 0) {
toHit[i].damage(100)
}
e.npc.world.spawnParticle("totem", x, y+1, z, 0.5, 0.5, 0.5, 1, 200)
var toHit = e.npc.world.getNearbyEntities(x, y, z, 5, 1)
for (var i = 0;i < toHit.length; ++i){
toHit[i].damage(3)
}}});

var H = new HThread();
H.start();
}}