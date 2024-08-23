const fs = require('fs');
const path = require('path');

require('dotenv').config();

const complete_prefix = "\u001b[42;1m COMPLETE \u001b[0m";
const fail_prefix = "\u001b[41;1m FAIL \u001b[0m";

const MigrationController = require('./controllers/MigrationController');

(async () => {
    const migrations = [];
    for (const file of fs.readdirSync(path.join(__dirname, 'migrations'))) {
        if (file.endsWith('.js')) {
            const migration = await import(path.join(__dirname, 'migrations', file));
            migrations.push({
                name: file,
                run: migration.run
            });
        }
    }

    // Each file begins with a date and time, so we can sort them: ddmmYYHHMM
    migrations.sort((a, b) => {
        const a_date = new Date();
        a_date.setDate(parseInt(a.name[0] + a.name[1]));
        a_date.setMonth(parseInt(a.name[2] + a.name[3]));
        a_date.setFullYear(parseInt("20" + a.name[4] + a.name[5]));
        a_date.setHours(parseInt(a.name[6] + a.name[7]));
        a_date.setMinutes(parseInt(a.name[8] + a.name[9]));

        const b_date = new Date();
        b_date.setDate(parseInt(b.name[0] + b.name[1]));
        b_date.setMonth(parseInt(b.name[2] + b.name[3]));
        b_date.setFullYear(parseInt("20" + b.name[4] + b.name[5]));
        b_date.setHours(parseInt(b.name[6] + b.name[7]));
        b_date.setMinutes(parseInt(b.name[8] + b.name[9]));

        return a_date - b_date;
    });

    const migrationsController = new MigrationController();
    for (const migration of migrations) {
        const doneCheck = await migrationsController.byName(migration.name);
        if (doneCheck) continue;

        try {
            await migration.run();
        } catch (error) {
            console.log(fail_prefix + " " + migration.name);
            console.error(error);
            break;
        }

        await migrationsController.insert(migration.name);
        console.log(complete_prefix + " " + migration.name);
    }
})().then(() => {
    process.exit(0);
});