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
const client = new MongoClient(mongoURI);

async function run() {
  try {
    await client.connect();

    const db = client.db('uloe')
    const listCollection = db.collection('ultimate_list');

    const list = await listCollection.find();

    // Get the current list and log it.
    console.log("Starting state...");
    console.log(await list.toArray());

    // Use aggregation to identify duplicates
    const pipeline = [ {$group: { _id: "$name", "dups": { "$push": "$_id" }, count: { $sum: 1}}}, {$match: { count: { $gt: 1 }}}]
    const aggCursor = await listCollection.aggregate(pipeline);

    console.log("\n\nProcessing duplicates...");

    // Delete duplicates
    await aggCursor.forEach(group => {
      console.log(group)
      group.dups.slice(1).forEach(item => {
        listCollection.deleteOne({ _id: item }, function(err, obj) {
          if (err) throw err;
          console.log("Deleted duplicate item " + group._id + " " + item.toString());
        });
      })
    })
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
