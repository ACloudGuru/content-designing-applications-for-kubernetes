// Setup Web Server
const express = require('express');
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Setup MongoDb backing database
const MongoClient = require('mongodb').MongoClient
// MongoDB credentials
const username = encodeURIComponent(process.env.MONGODB_USER || "uloe_user");
const password = encodeURIComponent(process.env.MONGODB_PASSWORD || "ILoveTheList");
// MongoDB connection info
const mongoPort = process.env.MONGODB_PORT || 27017;
const mongoHost = process.env.MONGODB_HOST || 'localhost';
// MongoDB connection string
const mongoURI = `mongodb://${username}:${password}@${mongoHost}:${mongoPort}/uloe`;
const mongoURISanitized = `mongodb://${username}:****@${mongoHost}:${mongoPort}/uloe`;
console.log("MongoDB connection string %s", mongoURISanitized);

const fs = require('fs')
const cors = require('cors')
app.use(cors())

MongoClient.connect(mongoURI, { useUnifiedTopology: true }).then(client => {
  const db = client.db('uloe')
  const listCollection = db.collection('ultimate_list');

  // Get the full list
  app.get('/list', function (req, res) {
    listCollection.find().toArray().then(result => {
      res.send(result);
    })
    .catch(error => console.error(error))
  })

  // Get list item(s) by name
  app.get('/list/:item', function (req, res) {
    listCollection.findOne({ name: req.params.item }).then(result => {
      res.send(result);
    })
    .catch(error => console.error(error))
  })

  // Add an item to the list
  app.post('/list', function (req, res) {
    if (!req.body.name || req.body.name.length < 1) {
      res.status(400).send('Bad Request')
    } else {
      listCollection.insertOne(req.body).then(result => {
        const item = {_id: result.insertedId, name: req.body.name};
        log("Adding item " + item.name);
        res.send(item);
        // Write added items to a special log file
        fs.appendFileSync('added_items.log', item.name + "\n");
      })
      .catch(error => console.error(error))
    }
  })

})
.catch(console.error)

// The port the server will listen on
const port = process.env.SERVER_PORT || 3001;

// Setup listening http server
var server = app.listen(port, function () {
  console.log("ULOE app listening on port %s", port)
})

log = function(data) {
  fs.appendFileSync('uloe.log', data + "\n");
}
