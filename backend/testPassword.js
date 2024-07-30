const bcrypt = require('bcryptjs');

// Original password
const password = 'User@123';

// Generate a new hash
bcrypt.hash(password, 12, (err, hashedPassword) => {
  if (err) throw err;
  console.log('Generated Hash:', hashedPassword);

  // Now compare using the hash generated above
  bcrypt.compare(password, hashedPassword, (err, result) => {
    if (err) throw err;
    console.log('Password Match:', result); // Should print: true
  });
});
