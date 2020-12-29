Before you do anything you must do the below Step 1.1

Step 1.1 => Paste the below line and hit enter in terminal to resolve CORS error :

"C:/Program Files (x86)/Google/Chrome/Application/chrome.exe" --user-data-dir="C:/chrome dev session" --disable-web-security


NOTE : If it doesn't open a new Chrome window for you , replace 
"C:/Program Files (x86)/Google/Chrome/Application/chrome.exe" with the existing path to your chrome browser. A new window should come.



Follow the below steps in this strict order to use the Coupon Generation System:

1. Install Node.js and Express
2. Do API modifications in index.html replacing dummy password and API key with that of the actual client
3. In the same directory as that of public , open terminal and paste this code : node index.js
4. Do not modify the package.json or the package-lock.json as they are configuration files ; any abrupt change may hinder normal functioning of the system.
5. Before setting it up for dev environment , make sure you have updated the json price rules and discount code objects
6. Go to this URL in chrome : " http://localhost:3000" in that chrome window ( Refer NOTE  of Step 1.1 ), which will run the entire pipeline.

NOTE : If you need to change the port number , do so in index.js ( Example 3000 to 8080 )

DOWNLOADS :

Node.js installation link : https://nodejs.org/en/download/

Code to download express ( run in terminal) : npm install express

Shopify Developers documentaion URL : https://shopify.dev/docs



Debugging : Debugging statements have been already implemented . Open developer tools in Chrome for the process . For Ouput verification visit Shopify discount Admin panel in your corresponding store.