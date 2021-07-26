// Setup Web Server
const express = require('express');
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Setup MongoDb backing database
const MongoClient = require('mongodb').MongoClient
// MongoDB credentials
const username = encodeURIComponent("uloe_user");
const password = encodeURIComponent("ILoveTheList");
// MongoDB connection string
const mongoURI = `mongodb://${username}:${password}@localhost:27017/uloe`;

const fs = require('fs')

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
        log("Adding item " + req.body.name);
        res.end();
        // Write added items to a special log file
        fs.appendFileSync('added_items.log', req.body.name + "\n");
      })
      .catch(error => console.error(error))
    }
  })

  // The port the server will listen on
  var port = 8081

  // Setup listening http server
  var server = app.listen(port, function () {
    console.log("ULOE app listening on port %s", port)
  })
})
.catch(console.error)

log = function(data) {
  fs.appendFileSync('uloe.log', data + "\n");
}
