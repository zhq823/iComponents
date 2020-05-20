
class iThread {
    constructor() {

    }

    /**
     * 
     * @param {*} ms - 毫秒
     */
    static sleep(ms) {
        return new Promise((resolve) =>
            setTimeout(resolve, ms)
        );
    }

}

export default iThread;