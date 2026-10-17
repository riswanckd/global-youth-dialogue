const mongoose = require('mongoose');

const uri = 'mongodb+srv://risilbinmusthafa_db_user:BHUP8wJFLfuMClxJ@cluster0.dxecfdk.mongodb.net/test?retryWrites=true&w=majority';

async function purge() {
  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB Atlas');

    const db = mongoose.connection.db;

    // 1. Delete all users except Super Administrator (3681mubashircp@gmail.com)
    const usersCol = db.collection('users');
    const userDel = await usersCol.deleteMany({
      role: { $ne: 'SUPER_ADMIN' },
      email: { $nin: ['3681mubashircp@gmail.com'] }
    });
    console.log(`🗑️ Deleted ${userDel.deletedCount} demo/test users.`);

    // 2. Delete test applications
    const appDel = await db.collection('applications').deleteMany({});
    console.log(`🗑️ Deleted ${appDel.deletedCount} applications.`);

    // 3. Delete test topics
    const topicDel = await db.collection('topics').deleteMany({});
    console.log(`🗑️ Deleted ${topicDel.deletedCount} topics.`);

    // 4. Delete test sessions
    const sessionDel = await db.collection('dialoguesessions').deleteMany({});
    console.log(`🗑️ Deleted ${sessionDel.deletedCount} sessions.`);

    // 5. Delete test publications
    const pubDel = await db.collection('publications').deleteMany({});
    console.log(`🗑️ Deleted ${pubDel.deletedCount} publications.`);

    // 6. Delete test feedbacks
    const feedbackDel = await db.collection('feedbacks').deleteMany({});
    console.log(`🗑️ Deleted ${feedbackDel.deletedCount} feedbacks.`);

    // Remaining users
    const remainingUsers = await usersCol.find({}).toArray();
    console.log('\n✅ Remaining users in database:');
    remainingUsers.forEach(u => console.log(` - ${u.name} (${u.email}) [${u.role}]`));

  } catch (err) {
    console.error('Error during purge:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

purge();
