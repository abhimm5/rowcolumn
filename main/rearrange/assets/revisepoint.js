function revisePoint(point, value, direction, addition) {
    if (addition) {
        if (direction === "perpendicular") {
            let sum = Math.round((point[0].x + value) * 10) / 10
            point[0].x = sum
        }
        if (direction === "parallel") {
            let sum = Math.round((point[0].y + value) * 10) / 10
            point[0].y = sum
        }
    }
    if (!addition) {
        if (direction === "perpendicular") {
            point[0].x = value
        }
        if (direction === "parallel") {
            point[0].y = value
        }
    }
    return point
}
export default revisePoint