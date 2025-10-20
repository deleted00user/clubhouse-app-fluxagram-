const pool = require('./pool');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
    try{
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        await pool.query(schema);
        console.log('✅ Database tables created successfully!');
        
        await pool.end();
    } catch(error) {
        console.error('❌ Error setting up database:', error)
        process.exit(1)
    }
}

setupDatabase()