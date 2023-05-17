export function breakpoint() {
    return {
        name: "breakpoint",
        value: [...arguments]
    }
}
export function order() {
    return {
        name: "order"
    }
}
export function offset() {
    return {
        name: "offset",
        value: [...arguments]
    }
}
export function property() {
    return {
        name: "property",
        value: [...arguments]
    }
}
export function childProperty() {
    return {
        name: "childProperty",
        value: [...arguments]
    }
}