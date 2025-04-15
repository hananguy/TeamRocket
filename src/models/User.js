export default class User {
    #userName;

    constructor(userName) {
        this.#userName = userName;
    }

    getUserName() {
        return this.#userName;
    }
}