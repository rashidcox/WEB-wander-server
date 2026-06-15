// const dns = require("node:dns");
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

// .env file


const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cores = require("cors");
const e = require("express");
const port = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cores());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URI;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const destinationsCollection = client.db("wanderlast_DB").collection("destinations");

    app.post("/api/destination", async (req, res) => {
      const destination = req.body;
      const result = await destinationsCollection.insertOne(destination);
      res.json(result);
    });

    app.get("/api/destinations", async (req, res) => {
      const cursor = destinationsCollection.find();
      const destinations = await cursor.toArray();
      res.send(destinations);
    });

    app.get("/api/destination/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const destination = await destinationsCollection.findOne(query);
      res.send(destination);
    });


    app.get("/", (req, res) => {
      res.send("Home page Server is running");
    });


    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
