const bcrypt = require('bcrypt');

// Function to hash passwords asynchronously
const hashPassword = async (plaintextPassword) => {
  const saltRounds = 10;
  return await bcrypt.hash(plaintextPassword, saltRounds);
};

// seeding some Mock test users instead of storing users somewhere more permanant 
// testing only, should probably use a db
const initializeUsers = async () => {
  return {
    user1: { password: await hashPassword("pass1") },
    user2: { password: await hashPassword("pass2") },
    user3: { password: await hashPassword("pass3") },
    user4: { password: await hashPassword("pass4") },
    user5: { password: await hashPassword("pass5") },
    user6: { password: await hashPassword("pass6") },
    user7: { password: await hashPassword("pass7") },
    user8: { password: await hashPassword("pass8") },
    user9: { password: await hashPassword("pass9") },
  };
};

// Variable to hold users
let users;

// Initialize users and handle errors
initializeUsers().then(initializedUsers => {
  users = initializedUsers;
}).catch(err => {
  console.error("Error initializing users:", err);
});

/**
 * Mock implementation of findUser.
 * @param {string} username - The username to find.
 * @returns {Promise<Object|null>} - A promise that resolves to the user object or null if not found.
 */
const findUser = async (username) => {
  return new Promise((resolve) => {
    const user = users[username];
    resolve(user || null);
  });
};

module.exports = { findUser };
