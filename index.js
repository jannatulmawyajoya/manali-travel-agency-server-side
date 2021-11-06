const express = require("express");
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
// const axios = require('axios').default;
const ObjectId =require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qqlcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



client.connect(err => {
    const servicesCollection = client.db("manaliTravel").collection("services");
    const bookingsCollection = client.db("manaliTravel").collection("bookings");

    app.post('/addService', (req,res)=>{
        console.log(req.body);
        servicesCollection.insertOne(req.body).then(result=>{
            res.send(result.insertedId);
        });
    });
    // get all products 
    app.get('/services', async(req,res)=>{
        const result = await servicesCollection.find({}).toArray();
        res.send(result);
    })


   
    

    // get single product
    app.get("/singleProduct/:id", async (req, res) => {
        // console.log (req);
        const result = await servicesCollection
            .find({ _id: ObjectId(req.params.id) })
            .toArray();
        res.send(result[0]);
    });

    // confirm order
    app.post("/confirmOrder", async (req, res) => {
        console.log(req.body);
        const result = await bookingsCollection.insertOne(req.body);
        res.send(result);
    });

    // my confirmOrder

    app.get("/myOrders/:email", async (req, res) => {
        // console.log(req.params);
        const result = await bookingsCollection
            .find({ email: req.params.email })
            .toArray();
        res.send(result);
    });

    /// delete order

    app.delete("/deleteOrder/:id", async (req, res) => {
        const result = await bookingsCollection.deleteOne({
            _id: ObjectId(req.params.id),
        });
        res.send(result);
    });

    // all order
    app.get("/allOrders", async (req, res) => {
        const result = await bookingsCollection.find({}).toArray();
        res.send(result);
    });

    // update statuses

    app.put("/updateStatus/:id", (req, res) => {
        const id = req.params.id;
        const updatedStatus = req.body.status;
        const filter = { _id: ObjectId(id) };
        console.log(updatedStatus);
        bookingsCollection
            .updateOne(filter, {
                $set: { status: updatedStatus },
            })
            .then((result) => {
                res.send(result);
            });
    });
});

// async function run() {
//     try{
//         await client.connect();
//         const database = client.db("manaliTravel");
//         const servicesCollection = database.collection("services");

//         // POST API
//         app.post('/services', async(req, res)=> {
//             console.log('hit the post');
//             res.send('post hitted')

//         });
//     }
//     finally{
//         // await client.close();
//     }
// }

// run().catch(console.dir);

app.get('/', (req,res)=> {
    res.send('Running manali travel agency properly');
});

app.listen(port, ()=>{
    console.log("running on port", port);
})