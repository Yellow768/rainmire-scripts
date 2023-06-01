function knockbackEntity(entity, origin, power) {
    var x1 = origin.x;
    var z1 = origin.z;

    var x2 = entity.x;
    var z2 = entity.z;

    var xdir = x2 - x1;
    var zdir = z2 - z1;
    var angle = Math.atan(xdir / zdir); // x and z distance triangle
    var pi = Math.PI;
    var degrees = (angle * (180 / pi)); // Convert Radians => Degrees
    if (xdir < 0 && zdir > 0) { // Quad I
        degrees = Math.abs(degrees);
    }
    if (xdir < 0 && zdir < 0) { // Quad II
        angle = Math.atan((xdir * -1) / zdir);
        degrees = (angle * (180 / pi)) + 180;
    }
    if (xdir > 0 && zdir < 0) { // Quad III
        angle = Math.atan((xdir * -1) / zdir);
        degrees = (angle * (180 / pi)) + 180;
    }
    if (xdir > 0 && zdir > 0) { // Quad IV
        degrees = 360 - degrees;
    }

    var d = Math.sqrt(Math.pow(xdir, 2) + Math.pow(zdir, 2));
    // Farther distance, more knockback

    entity.setMotionY((Math.random() / 2) + (power / 10))
    entity.knockback(power / 2, degrees);
    //event.player.knockback(-d, degrees); Negative pulls in
}