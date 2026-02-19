const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

console.log('Testing MongoDB connection...');
console.log('URI:', process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@')); // Hide password

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        const msg = '✅ SUCCESS: MongoDB connected successfully!';
        console.log(msg);
        fs.writeFileSync('db-test.log', msg);
        process.exit(0);
    })
    .catch((err) => {
        const msg = `❌ ERROR: MongoDB connection failed:\n${err.message}\n\nFull Error:\n${JSON.stringify(err, null, 2)}`;
        console.error(msg);
        fs.writeFileSync('db-test.log', msg);
        process.exit(1);
    });
