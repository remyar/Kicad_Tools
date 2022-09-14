function to_radians(n) {
    return (n / 180.0) * Math.PI
}

function to_degrees(n) {
    return (n / Math.PI) * 180.0
}

export function compute_arc(start_x, start_y, radius_x, radius_y, angle, large_arc_flag, sweep_flag, end_x, end_y) {
    //-- Compute the half distance between the current and the final point
    let dx2 = (start_x - end_x) / 2.0;
    let dy2 = (start_y - end_y) / 2.0

    //-- Convert angle from degrees to radians
    angle = to_radians(angle % 360.0);
    let cos_angle = Math.cos(angle);
    let sin_angle = Math.sin(angle);

    //-- Step 1 : Compute (x1, y1)
    let x1 = cos_angle * dx2 + sin_angle * dy2;
    let y1 = -sin_angle * dx2 + cos_angle * dy2;

    //-- Ensure radii are large enough
    radius_x = Math.abs(radius_x);
    radius_y = Math.abs(radius_y);
    let Pradius_x = radius_x * radius_x;
    let Pradius_y = radius_y * radius_y;
    let Px1 = x1 * x1;
    let Py1 = y1 * y1;

    let radiiCheck = ((Pradius_x != 0) && (Pradius_y != 0)) ? ((Px1 / Pradius_x) + (Py1 / Pradius_y)) : 0;

    if (radiiCheck > 1) {
        radius_x = Math.sqrt(radiiCheck) * radius_x;
        radius_y = Math.sqrt(radiiCheck) * radius_y;
        Pradius_x = radius_x * radius_x
        Pradius_y = radius_y * radius_y
    }

    //-- Step 2 : Compute (cx1, cy1)
    let sign = (large_arc_flag == sweep_flag) ? -1 : 1;
    let sq = 0;
    if (((Pradius_x * Py1) + (Pradius_y * Px1)) > 0) {
        sq = ((Pradius_x * Pradius_y) - (Pradius_x * Py1) - (Pradius_y * Px1)) / (
            (Pradius_x * Py1) + (Pradius_y * Px1)
        )
    }
    sq = Math.max(sq, 0);
    let coef = sign * Math.sqrt(sq);
    let cx1 = coef * ((radius_x * y1) / radius_y);
    let cy1 = (radius_x != 0) ? coef * -((radius_y * x1) / radius_x) : 0;

    //-- Step 3 : Compute (cx, cy) from (cx1, cy1)
    let sx2 = (start_x + end_x) / 2.0;
    let sy2 = (start_y + end_y) / 2.0;
    //-- print(start_x, end_x)
    let cx = sx2 + (cos_angle * cx1 - sin_angle * cy1);
    let cy = sy2 + (sin_angle * cx1 + cos_angle * cy1);

    //-- Step 4 : Compute the angle_extent (dangle)
    let ux = (radius_x != 0) ? (x1 - cx1) / radius_x : 0;
    let uy = (radius_y != 0) ? (y1 - cy1) / radius_y : 0;
    let vx = (radius_x != 0) ? (-x1 - cx1) / radius_x : 0;
    let vy = (radius_y != 0) ? (y1 - cy1) / radius_y : 0;

    //-- Compute the angle extent
    let n = Math.sqrt((ux * ux + uy * uy) * (vx * vx + vy * vy));
    let p = ux * vx + uy * vy;

    sign = ((ux * vy - uy * vx) < 0) ? -1 : 1;

    let angle_extent = 360 + 359;
    if (n != 0) {
        angle_extent = (Math.abs(p / n) < 1) ? to_degrees(sign * Math.acos(p / n)) : (360 + 359);
    }

    if (!sweep_flag && (angle_extent > 0)) {
        angle_extent -= 360;
    } else if (sweep_flag && (angle_extent < 0)) {
        angle_extent += 360;
    }

    let angleExtent_sign = angle_extent < 0 ? 1 : -1;
    angle_extent = (Math.abs(angle_extent) % 360) * angleExtent_sign;

    return {
        center_x: cx,
        center_y: cy,
        angle_end: angle_extent
    }
}