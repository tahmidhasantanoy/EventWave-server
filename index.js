const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 3000;

/*  */

// Middleware
app.use(cors()); //cors policy
app.use(express.json()); //request body parser

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oc9fgut.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const eventCollection = client.db("EventWave").collection("users-info");
    const eventInfoCollection = client
      .db("EventWave")
      .collection("events-info");

    // get user data
    // http://localhost:3000/user-data/${params.email}
    app.get("/user-data/:email", async (req, res) => {
      console.log(req.params.email);
      const email = req.params?.email;
      const query = { email: email };
      console.log(query);
      const cursor = await eventCollection.findOne(query);
      res.send(cursor);
    });

    // app.get("/all-toys", async (req, res) => {
    //   let query = {};
    //   if (req.query?.email) {
    //     query = { email: req.query.email };
    //   }
    //   const cursor = toysCollection.find(query);
    //   const result = await cursor.toArray();
    //   res.send(result);
    // });

    // //Subcategory route
    // app.get("/sub-cat", async (req, res) => {
    //   let query = {};
    //   if (req.query?.subCategory) {
    //     query = { subCategory: req.query.subCategory };
    //   }
    //   const cursor = toysCollection.find(query);
    //   const result = await cursor.toArray();
    //   res.send(result);
    // });

    // app.get("/change", async (req, res) => {
    //   const result = await toysCollection.updateMany({}, [
    //     { $set: { price: { $toDouble: "$price" } } },
    //   ]);
    //   res.send(result);
    // });

    // //Get for update
    // app.get("/all-toys/:update_id", async (req, res) => {
    //   const id = req.params.update_id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await toysCollection.findOne(query);
    //   res.send(result);
    // });

    // Upload event data
    app.post("/user-info", async (req, res) => {
      const userData = req.body;
      console.log(userData);
      const isExist = await eventCollection.findOne({ email: userData?.email });
      console.log(isExist);
      if (isExist) {
        res.send("Already stored");
      }
      //server to db
      const result = await eventCollection.insertOne(userData);
      res.send(result);
    });

    // Upload event data
    app.post("/event-info", async (req, res) => {
      const addEventData = req.body;

      //server to db
      const result = await eventInfoCollection.insertOne(addEventData);
      res.send(result);
    });

    // //countinue
    // app.put("/all-toys/:update_id", async (req, res) => {
    //   const id = req.params.update_id;

    //   const filter = { _id: new ObjectId(id) };
    //   const options = { upsert: true };
    //   const updateToyInfo = req.body;
    //   const updateDoc = {
    //     $set: {
    //       name: updateToyInfo.name,
    //       SellerName: updateToyInfo.SellerName,
    //       email: updateToyInfo.email,
    //       price: updateToyInfo.price,
    //       subCategory: updateToyInfo.subCategory,
    //       rating: updateToyInfo.rating,
    //       quantity: updateToyInfo.quantity,
    //       photoUrl: updateToyInfo.photoUrl,
    //       description: updateToyInfo.description,
    //       toyName: updateToyInfo.toyName,
    //     },
    //   };

    //   const result = await toysCollection.updateOne(filter, updateDoc, options);
    //   res.send(result);
    // });

    // //Delete
    // app.delete("/all-toys/:id", async (req, res) => {
    //   const delete_id = req.params.id;
    //   console.log(delete_id);

    //   const query = { _id: new ObjectId(delete_id) };
    //   const result = await toysCollection.deleteOne(query);
    //   res.send(result);
    // });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

/*  */
app.get("/", (req, res) => {
  res.send("EventWave...");
});

app.listen(port, () => {
  console.log(`EventWave is waving ... ${port}`);
});
