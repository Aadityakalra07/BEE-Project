const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const User = require('./models/User');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const result = await User.findOneAndUpdate(
      { email: 'sarah@example.com' },
      { photo: '' },
      { new: true }
    );
    if (result) console.log('✅ Cleared Sarah Thomas profile photo');
    else console.log('❌ User not found');
    process.exit(0);
  } catch (e) { console.error(e.message); process.exit(1); }
})();
