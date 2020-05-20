Object.assign(Object.prototype, {
    mapper(source) {
        Object.keys(this).forEach((key) => {
            this[key] = source[key];
        })
    }
})