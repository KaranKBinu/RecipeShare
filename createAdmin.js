const readline = require('readline');
const bcrypt = require('bcrypt');
const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb://localhost:27017/admindb";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter admin username: ', (username) => {
  rl.question('Enter admin email: ', (email) => {
    rl.question('Enter admin password: ', async (password) => {
      rl.question('Confirm admin password: ', async (confirmPassword) => {
        if (password !== confirmPassword) {
          console.log('Passwords do not match. Admin not created.');
        } else {
          const hashedPassword = await bcrypt.hash(password, 10);
          const admin = {
            username,
            email,
            password: hashedPassword,
            isAdmin: true,
          };

          const client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });

          try {
            await client.connect();
            const db = client.db();
            const adminCollection = db.collection('admins');
            await adminCollection.insertOne(admin);
            console.log('Admin created successfully.');
          } catch (error) {
            console.error('Error creating admin:', error);
          } finally {
            client.close();
          }
        }
        rl.close();
      });
    });
  });
});
