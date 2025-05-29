// Proof of concept file do not use in prod
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://mongo:27017/authdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', async () => {
  console.log('Connected to MongoDB, seeding users...');

  try {
    await User.deleteMany({});
    await User.create([
      { username: 'alice', password: 'password123', role: 'admin' },
      { username: 'bob', password: 'password456', role: 'manager' },
      { username: 'eve', password: 'password789', role: 'user' },
    ]);

    console.log('Users seeded successfully.');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    mongoose.connection.close();
  }
});
