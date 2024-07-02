const express = require('express');
const axios = require('axios');
const cron = require('node-cron');
//const fetch = require('node-fetch');

const maliciousIPs = express();
const port = 3001;
const apiURL = '';
//get your own key from https://www.abuseipdb.com/account/api
const abuseAPIKey = '939e5ef29451afaaa1d7763b16adeea9947da1031f8a7f66e6757c84d0c870514dc36f0e7faff828';
const AbuseURL = 'https://api.abuseipdb.com/api/v2/blacklist?confidenceMinimum=90&plaintext=false';

class RadixListNode {
  constructor(value = null) {
    this.children = {};
    this.isEndOfWord = false;
    this.value = value;  // Store values for prefix compression
  }
}

class RadixList {
  constructor() {
    this.root = new RadixListNode();
  }

  insert(item) {
    let node = this.root;
    for (let char of item.value) {
      if (!node.children[char]) {
        node.children[char] = new RadixListNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
  }

  search(item) {
    let node = this._findNode(item);
    return node !== null && node.isEndOfWord;
  }

  delete(item) {
    this._delete(this.root, item, 0);
  }

  _findNode(item) {
    let node = this.root;
    for (let char of item) {
      if (!node.children[char]) {
        return null;
      }
      node = node.children[char];
    }
    return node;
  }

  _delete(node, item, index) {
    if (index === item.length) {
      if (!node.isEndOfWord) return false;
      node.isEndOfWord = false;
      return Object.keys(node.children).length === 0;
    }

    const char = item[index];
    if (!node.children[char]) return false;

    const shouldDeleteChild = this._delete(node.children[char], item, index + 1);

    if (shouldDeleteChild) {
      delete node.children[char];
      return Object.keys(node.children).length === 0;
    }

    return false;
  }
}

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


