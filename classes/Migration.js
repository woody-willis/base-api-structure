const BaseFactory = require('../Base.js');
const MigrationController = require('../controllers/MigrationController.js');

/** Class representing a database migration. */
class Migration {
    constructor(id, name, createdAt) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
    }
}

/** Class representing a migration factory. */
class MigrationFactory extends BaseFactory {
    /** Set the id of the migration. */
    setId(id) {
        this.id = id;
        
        return this;
    }

    /** Set the name of the migration. */
    setName(name) {
        this.name = name;
        
        return this;
    }

    /** Set the created at date of the migration. */
    setCreatedAt(createdAt) {
        this.createdAt = createdAt;
        
        return this;
    }

    /** Load a migration from a database object. */
    load(dbObject) {
        this.setId(dbObject.id);
        this.setName(dbObject.name);
        this.setCreatedAt(new Date(dbObject.created_at));
        
        return this;
    }

    /** Create the migration. */
    async create() {
        if (!this.id) {
            throw new Error('Missing required fields for Migration');
        } else if (!this.name && !this.createdAt) {
            const migration = await new MigrationController().byId(this.id);
            if (!migration) {
                throw new Error('Migration not found');
            }
            this.load(migration);
        }
        
        return new Migration(this.id, this.name, this.createdAt);
    }
}

module.exports = { MigrationFactory, Migration };