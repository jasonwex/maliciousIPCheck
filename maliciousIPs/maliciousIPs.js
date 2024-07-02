const express = require('express');
const axios = require('axios');
const cron = require('node-cron');
const { RadixList, RadixListNode } = require('./RadixList'); // Import RadixList and RadixListNode

const maliciousIPs = express();
const port = 3001;
const apiURL = '';
//get your own key from https://www.abuseipdb.com/account/api
const abuseAPIKey = '939e5ef29451afaaa1d7763b16adeea9947da1031f8a7f66e6757c84d0c870514dc36f0e7faff828';
const AbuseURL = 'https://api.abuseipdb.com/api/v2/blacklist?confidenceMinimum=90&plaintext=false';


//
let ipList = new RadixList();

async function fetchBlacklist() {
  const response = await fetch(AbuseURL, {
    method: 'GET',
    headers: {
      'Key': abuseAPIKey,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = await response.json();
  return data;
}

const fetchBlacklistMock = async () => {
  data = [
    {
      "ipAddress": "5.188.10.179",
      "abuseConfidenceScore": 100,
      "lastReportedAt": "2020-09-24T19:17:02+00:00"
    },
    {
      "ipAddress": "185.222.209.14",
      "abuseConfidenceScore": 100,
      "lastReportedAt": "2020-09-24T19:17:02+00:00"
    },
    {
      "ipAddress": "191.96.249.183",
      "abuseConfidenceScore": 100,
      "lastReportedAt": "2020-09-24T19:17:01+00:00"
    }
  ]

  return data;
}


// Function to fetch IPs and update the list
async function updateIPList() {
  try {

    //const blacklistedIPs = await fetchBlacklist();
    const blacklistedIPs = await fetchBlacklistMock();

    // Reset and update the list
    tempIPList = new RadixList();// Reset the list
    blacklistedIPs.forEach(ip => {
      let radNode = new RadixListNode(ip.ipAddress);
      tempIPList.insert(radNode) // Store each IP in the object
    });

    ipList = tempIPList;

    console.log('IP List updated successfully.');
  } catch (error) {
    console.error('Failed to update IP List:', error);
  }
}

// Schedule the update to run once a day
cron.schedule('0 0 * * *', updateIPList); // At midnight

// Endpoint to check if an IP is in the list
maliciousIPs.get('/check-ip', (req, res) => {
  const ip = req.query.ip;
  if (!ip) {
    return res.status(400).send('IP address is required');
  }
  const isPresent = ipList.search(ip); // Check if IP exists in the list
  res.send({ isPresent });
});

// Start the server
maliciousIPs.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  updateIPList(); // Initial fetch and populate the list
});


