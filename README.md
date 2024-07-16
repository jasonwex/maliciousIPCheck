### ReadMe

#### Folders

##### /login 
This folder contains the guts of my "Login Service" it is mostly real. I may add a database in later to make it a little more real. I also plan on using Auth0 to handle the login stuff at some point.
**login.js must be running locallly** for all this to work 


##### /MaliciousIps
Currently pulling about 50k malicious IPs from AbuseIPDB once on startup and once at midnight. **Update the .env file with your own free Key**  and the api URL abuseURL = https://api.abuseipdb.com/api/v2/blacklist?confidenceMinimum=90&plaintext=false  - https://www.abuseipdb.com/ will allow you up to 5  pulls of the list a day. Planning on updating to use firehol 
**MaliciousIPs.js must be running locally**

##### /loginUI
this is the the test login page essentially - you can "set" the IP address to test if it is on a the blocklist. just open index.html in a browser.

##### /MockLogin
You can ignore this, it was my first version at mocking something up so I could test other things. Leaving it here for my own reference for now. 

**TODO LIST** https://trello.com/b/rEw3z41g/learning-to-code-again 