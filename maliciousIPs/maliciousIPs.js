const express = require('express');
const axios = require('axios');
const cron = require('node-cron');
const { RadixList, RadixListNode, SerializableRadixList, SerializableRadixListNode } = require('./RadixList'); // Import RadixList and RadixListNode
const dotenv = require('dotenv'); // to hide my api keys if I make get public, already rotated the old keys
const redis = require('redis')// we are going to use this to attempt to cache the serializable Raa
const { promisify } = require('util');

// // <forCaching wip> //
// const client = redis.createClient();

// client.on('connect', () => {
//   console.log('Connected to Redis');
// });


// client.on('error', (err) => {
//   console.error('Error connecting to Redis', err);
// });


// // Promisify the 'set' and 'get' methods
// const setAsync = promisify(client.set).bind(client);
// const getAsync = promisify(client.get).bind(client);
// // <forCaching wip> //

dotenv.config(); // get the .env variables for the urls and keys

const maliciousIPs = express();
const port = 3001;
const apiURL = '';
const rKey = 'aKeyfortheCachedRadixList12123'


//you can get your own API key and the url from https://www.abuseipdb.com/account/api specifically this is the blacklist endpoint
const abuseAPIKey = process.env.abuseAPIKey3;
const AbuseURL = process.env.abuseURL;
const isDev = true;
//
let ipList = new RadixList();

// <forCaching wip> //let ipList = new SerializableRadixList();

// <forCaching wip> //
// const cacheRadixList = async (radixKey, radixList) => {
//   const serializedData = radixList.serialize();

//   try {
//     if (!client.isOpen) {
//       await client.connect();
//     }
//     const reply = await setAsync(radixKey, serializedData);
//     console.log('Radix list cached successfully', reply);
//   } catch (err) {
//     console.error('Error setting value in Redis', err);
//   }
// }

// const getRadixListFromCache = async (radixKey) => {
//   try {
//     if (!client.isOpen) {
//       await client.connect();
//     }
//     const reply = await getAsync(radixKey);
//     if (reply) {
//       const data = JSON.parse(reply);
//       const radixList = new SerializableRadixList();
//       radixList.root = data;
//       return radixList;
//     } else {
//       console.log('No radix list found in cache for user:', userId);
//       return null;
//     }
//   } catch (err) {
//     console.error('Error getting value from Redis', err);
//     throw err;
//   }
// }
// <forCaching wip> 

async function fetchBlacklist() {
  try {
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

    let data = await response.text();
    data = data.split('\n');
    return data;
  } catch (error) {
    console.log(error);
  }

}

const fetchBlacklistMock = async () => {
  // actual text based response the server is sending (does not match the documentation)
  textResponse = `199.45.154.181
193.163.125.99
147.185.132.122
91.92.250.101
47.88.14.121
74.82.47.47
107.14.82.83
103.203.57.17
65.49.1.109
62.204.41.4
45.58.184.147
114.230.135.41
165.22.75.145
193.163.125.237
64.62.197.230
193.163.125.232
206.168.34.160
184.105.139.97
193.163.125.141
51.75.20.198
162.241.126.176
147.185.132.54
147.185.132.52
185.47.172.129
80.87.206.148
146.70.100.229
147.185.132.57
165.232.33.216
185.142.236.38
185.167.96.146
185.196.8.54
165.154.11.247
74.82.47.54
141.98.7.59
64.62.197.30
64.62.156.114
27.254.235.2
65.49.20.123
65.49.20.108
8.221.141.33
74.82.47.23
5.188.206.230
2.187.98.51
223.99.200.163
13.83.41.180
186.121.240.38
152.32.215.244
192.42.116.191
46.119.11.184
106.51.3.214
120.32.50.50
43.134.163.234
58.240.105.20
13.64.111.114
90.160.139.163
193.26.115.202`;
  //return await responseFormater(stringResponseTest);
  //return   data;
  return textResponse.split('\n');;
}

// Function to fetch IPs and update the list
async function updateIPList() {
  try {

    const blacklistedIPs = await fetchBlacklist();
    //const blacklistedIPs = await fetchBlacklistMock();

    // Reset and update the list
    let tempIPList = new RadixList();// Reset the list
    // <forCaching wip> //let tempIPList = new SerializableRadixList();// Reset the list

    blacklistedIPs.map(ip => tempIPList.insert(new RadixListNode(ip)))
    // <forCaching wip> //blacklistedIPs.map(ip => tempIPList.insert(new SerializableRadixListNode(ip)))


    ipList = tempIPList;
    tempIPList = null; // delete the temp list to avoid potential memory issues? (I dont know if I actually have to do this)
    console.log(`The list contains: ${ipList.countNodes()}`)
    //ipList = ipList.serialize();


    // <forCaching wip>// await cacheRadixList(rKey, ipList)
    //console.log(`Serialized List: ${ipList.countNodes()}`);
    console.log('IP List updated successfully.');
  } catch (error) {
    console.error('Failed to update IP List:', error);
  }
}

// Schedule the update to run once a day
cron.schedule('0 0 * * *', updateIPList); // At midnight

//returns true if the ip address is on the blocklist
maliciousIPs.get('/check-ip', async (req, res) => {

  if (isDev) { let startTime = 0; let endTime = 0; }
  const ip = req.query.ip;


  if (isDev) { startTime = performance.now(); };

  if (!ip) {
    return res.status(401).send('IP address is required ');
  }

  const isBlocked = ipList.search(ip); // Check if IP exists in the list
  // <forCaching wip> //const isBlocked = SerializableRadixList.deserialize(ipList).search(ip)

  // const isBlocked = await getRadixListFromCache(rKey).search(ip);

  //const endTime = performance.now();
  if (isDev) { endTime = performance.now(); };
  if (isDev) { console.log(`Searching for ${ip}:Response time: ${endTime - startTime} milliseconds - Is it on the blocklist? ${isBlocked}`); };
  // console.log(`Searching for ${ip}:Response time: ${endTime - startTime} milliseconds - Is it on the blocklist? ${isBlocked}`);

  res.send({ isBlocked });
});


// Start the server
maliciousIPs.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);

  updateIPList(); // Initial fetch and populate the list

});


