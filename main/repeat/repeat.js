 function repeat(parent, num, direction) {
        if (num < 13 && num > 1) {
            let base = 1;
            let remaining = num - 2
            let result = (parent).splits(base, base, direction)
            let right = result
            while (remaining <= 12 && remaining >= 1) {
                let o = (remaining + 1).splits(base, remaining, direction)
                right = right.right = o
                remaining--
            }
            return result
        } else {
            throw new Error('Invalid columns')
        }
    }

    export default repeat