// This is the client server where we shall write the route to recieve the data from shopify . Also here we will save data to database

const express = require('express');
const Datastore = require('nedb');

const app = express();
app.listen(8080,()=> console.log('Listening at port 8080'));
app.use(express.static('public'));
app.use(express.json({limit: '10000mb'}));

const database = new Datastore('database.db');
database.loadDatabase();
//console.log("This is Client Server")

app.post('/api',(request,response) => {
console.log('I got a request !');    

const timestamp = Date.now();


//console.log("This is Client Server")
const data = request.body;
//data2 =  data.json();
console.log(data);

data.timestamp = timestamp;
database.insert(data);


response.json({
    status : 'success',
    timestamp : timestamp,
    heatmap : data.heatmap,
    demographics : data.demographics
    })
});





















