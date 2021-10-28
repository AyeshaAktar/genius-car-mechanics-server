const express = require("express"); //step-1
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const cors = require("cors");
require("dotenv").config();

const app = express(); //step-2
const port = process.env.PORT || 5000; //step-3

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.szoou.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("careMechanic");
    const servicesCollection = database.collection("services");

    //Get API
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    //Get single service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting specific service", id);
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);
    });

    //POST API
    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log("hit the post api", service);
      const result = await servicesCollection.insertOne(service);
      console.log(result);
      res.json(result);
    });

    //Delete API
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

//step-4: default router set
app.get("/", (req, res) => {
  res.send("Running Genius server");
});

//step-5: app port ee listen korbe
app.listen(port, () => {
  console.log("Running Genius server on port", port);
});
