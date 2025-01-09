export function get_middle_arc_pos(center_x, center_y, radius, angle_start, angle_end) {
    let middle_x = center_x + radius * Math.cos((angle_start + angle_end) / 2);
    let middle_y = center_y + radius * Math.sin((angle_start + angle_end) / 2);

    return {
        middle_x,
        middle_y
    }
}