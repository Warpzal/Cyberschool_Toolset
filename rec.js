function countdown(n) {
    if (n === 0) {
        return
    }
    console.log(n)
    return countdown(n - 1)
}

countdown(5)
