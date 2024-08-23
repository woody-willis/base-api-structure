/** Base class for all factories */
class BaseFactory {
    /** Constructor */
    constructor() {
        this.id = null;
    }

    /** Loads data from a database object */
    load(dbObject) {
        
    }

    /** Creates an object */
    async create() {
        
    }
}

module.exports = BaseFactory;