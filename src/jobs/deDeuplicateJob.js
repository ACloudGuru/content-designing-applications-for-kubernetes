// Setup MongoDb backing database
const MongoClient = require('mongodb').MongoClient
// MongoDB credentials
const username = process.env.MONGODB_USER || "uloe_user";
const password = process.env.MONGODB_USER || "ILoveTheList";
// MongoDB connection string
const mongoLoc = process.env.MONGODB_LOC || "localhost:27017/uloe";
const mongoURI = `mongodb://${username}:${password}@${mongoLoc}`;
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
