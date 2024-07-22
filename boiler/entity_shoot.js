

///particle alexsmobs:worm_portal ~ ~ ~ 5 5 5 0 500
///particle aquamirae:electric ~ ~ ~ 5 5 5 0 100
///particle aquamirae:shine ~ ~ ~ 5 5 5 0 100


//PROJECTILE SHOOTING
//Credit to Runonstoff https://pastebin.com/aqx0xYmh


/**
 * Shoot from an actual entity.
 * This function will set a few additional entity related options of the projectile
 * @param {IEntity} entity The entity to shoot from, usually a player.
 * @param {Object} projectileData Extra settings to override projectile 
 */
var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
var world = API.getIWorld("minecraft:overworld")

function verify() {
    return true
}

function entityShoot(pos, projectileData) {
    var projectile = createProjectile(world, Object.assign({
        x: pos.x,
        y: pos.y, //func_70047_e = getEyeHeight
        z: pos.z,
        rotation: getRandomInt(0, 360),
        pitch: getRandomInt(-45, 0)
    }, projectileData));
    world.spawnEntity(projectile);
    return projectile

}

//Object.assign polyfill, some java/nashorn installations dont have Object.assign and will error without this polyfill!
if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (target) {
            'use strict';
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert first argument to object');
            }

            var to = Object(target);
            for (var i = 1; i < arguments.length; i++) {
                var nextSource = arguments[i];
                if (nextSource === undefined || nextSource === null) {
                    continue;
                }
                nextSource = Object(nextSource);

                var keysArray = Object.keys(Object(nextSource));
                for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                    var nextKey = keysArray[nextIndex];
                    var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== undefined && desc.enumerable) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
            return to;
        }
    });
}

var API = Java.type('noppes.npcs.api.NpcAPI').Instance();


/**
 * Create a new Custom NPCs Projectile
 * @param {IWorld} world The world to create projectile in (not spawn)
 * @param {Object} options Options to override, see the function to see the available options
 */
function createProjectile(world, options) {
    options = Object.assign({
        x: 0, y: 0, z: 0, /*Position to spawn projectile*/
        trailenum: 0, /*Trail Type: 0:None, 1:Smoke, 2:Portal, 3:Redstone, 4:Lightning, 5:LargeSmoke, 6:Magic, 7:Enchant*/
        PotionEffect: 0, /*Effect: 0:None, 1:Fire, 2:Poison, 3:Hunger, 4:Weakness, 5:Slowness, 6:Nausea, 7:Blindness, 8:Wither*/
        effectDuration: 5,  /*Effect duration, 1-99999, used if effect is not 0*/
        gravity: 1, /*Is the projectile affected by gravity: 0 or 1*/
        accelerate: 0, /*Does the projectile accelerate: 0 or 1, only effective if gravity is 0*/
        glows: 0, /*Does the projectile glow: 0 or 1*/
        speed: 1, /*Projectile speed: 1-50*/
        power: 0, /*Projectile damage in half-hearts: 0-999*/
        size: 10, /*Projectile size: 5-20, 10 is normal size*/
        punch: 0, /*Projectile knockback: 0-3*/
        explosiveRadius: 0, /*Explosion size: 0:None, 1:Small, 2:Medium, 3:Large*/
        spins: 0, /*Does the projectile spin: 0 or 1*/
        sticks: 0, /*Does the projectile stick to the ground: 0 or 1*/
        render3d: 1, /*Render type: 0 is 2D, 1 is 3D*/
        canBePickedUp: 1, /*whether a player can pick up this projectile*/
        isArrow: 0, /*if 1, projectile will render as a vanilla arrow, set to 1 if using an arrow*/
        itemid: "minecraft:deepslate_bricks", /*item to shoot*/
        itemmeta: 0,/*metadata of the item to shoot*/
        rotation: 0, /*the direction 0-360 to shoot*/
        pitch: 0, /*the pitch -90 - 90 to shoot*/
        deviation: 0,/*recoil, zero is no recoil, recommended is anything between 0-5, but higher is possible*/
        owner: null, /*UUID of projectile owner*/
    }, options);

    function random_sign() {
        return (Math.random() >= 0.5) ? 1 : -1;
    }

    var pi = Math.PI;
    var rot = options.rotation;// angle in X Z axis

    var deviation = Math.random() * random_sign() * (options.deviation);// optional value for arrow to have some deviation
    rot += deviation;




    var xz_vector = options.speed * Math.abs(Math.cos(options.pitch * pi / 180));// projection of motion vector in X Z plane
    var x_dir = Math.sin(rot * pi / 180) * (-1) * xz_vector;// X component of motion vector
    var y_dir = options.speed * Math.sin(options.pitch * pi / 180) * (-1);// Y component of motion vector
    var z_dir = Math.cos(rot * pi / 180) * xz_vector;// Z component of motion vector

    // create NBT string for projectile
    var str = '{id:"customnpcs:customnpcprojectile"' +
        (options.owner ? ',ownerName:"' + options.owner + '"' : '') +
        ',Pos:[' + options.x + 'd,' + (options.y) + 'd,' + options.z +
        'd],PotionEffect:' + options.PotionEffect
        + ',isArrow:' + options.isArrow
        + 'b,punch:' + options.punch
        + ',explosiveRadius:' + options.explosiveRadius
        + ',Item:{id:"' + options.itemid + '",Count:1,Damage:' + options.itemmeta + 's},damagev2:' + options.power
        + 'f,trailenum:' + options.trailenum
        + ',Spins:' + options.spins
        + 'b,glows:' + options.glows
        + 'b,Accelerate:' + options.accelerate
        + 'b,direction:[' + x_dir + 'd,' + y_dir + 'd,' + z_dir
        + 'd],Motion:[' + 0 + 'd,' + 0 + 'd,' + 0// while creating Nbt motion values do nothing, but calculated later in fly
        + 'd],velocity:' + options.speed
        + ',canBePickedUp:' + options.canBePickedUp
        + 'b,size:' + options.size
        + ',Sticks:' + options.sticks
        + 'b,gravity:' + options.gravity
        + 'b,effectDuration:' + options.effectDuration
        + ',Render3D:' + options.render3d
        + 'b}'

    return world.createEntityFromNBT(API.stringToNbt(str));// create actual entity
}