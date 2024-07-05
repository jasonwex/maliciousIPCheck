const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mocklogin = express();

mocklogin.use(cors());  // Enable CORS for all routes
mocklogin.use(express.json()); // Middleware to parse JSON bodies

// Object of mock users, with usernames as keys
const users = {
  user1: { password: "pass1", ipaddress: "192.168.1.1" },
  user2: { password: "pass2", ipaddress: "192.168.1.2" },
  user3: { password: "pass3", ipaddress: "192.168.1.3" },
  user4: { password: "pass4", ipaddress: "192.168.1.4" },
  user5: { password: "pass5", ipaddress: "192.168.1.5" },
  user6: { password: "pass6", ipaddress: "192.168.1.6" },
  user7: { password: "pass7", ipaddress: "192.168.1.7" },
  user8: { password: "pass8", ipaddress: "192.168.1.8" },
  user9: { password: "pass9", ipaddress: "192.168.1.9" },
  user10: { password: "pass10", ipaddress: "192.168.1.10" }
};

async function checkIP(ipAddress) {
  try {
    const response = await axios.get(`http://localhost:3001/check-ip?ip=${ipAddress}`);
    console.log('Response:', response.data);
    return response.data.isBlocked;
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

mocklogin.post('/login', async (req, res) => {
  const { username, password, ip } = req.body;
  //check if ip is on the malicious list (once I make it)
  if (!username || !password || !ip) {
    return res.status(400).send('Missing username, password or IP');
  }

  // Access user data directly using the username as a key
  const userData = users[username];
  let blockedIP = await checkIP(ip);

  if (userData && userData.password === password && !blockedIP) {
    res.status(200).send('Login successful');
  } else {
    if (blockedIP) {
      //this is really for testing only, probably dont want to say WHY the login failed
      res.status(401).send('IP is potentially malicious');
    } else {
      res.status(401).send('Invalid username, password');
    }
  }
});

mocklogin.post('/authenticate', async (req, res) => {
  const { username, password, ip } = req.body;
  //check if ip is on the malicious list (once I make it)
  if (!username || !password || !ip) {
    return res.status(400).send('Missing username, password or IP');
  }

  // Access user data directly using the username as a key
  const userData = users[username];
  let blockedIP = await checkIP(ip);

  if (userData && userData.password === password && !blockedIP) {
    res.status(200).send('Login successful');
  } else {
    if (blockedIP) {
      //this is really for testing only, probably dont want to say WHY the login failed
      res.status(401).send('IP is potentially malicious');
    } else {
      res.status(401).send('Invalid username, password');
    }
  }
});
const PORT = 3000;
mocklogin.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
