const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const bodyParser =require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mizqz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const Collection = client.db('camaraZoneDB').collection('camaras');

        app.get('/camera', async (req, res) => {
            const query = {};
            const cursor = Collection.find(query);
            const cameras = await cursor.toArray();
            res.send(cameras);
        });

        app.get('/camera/:id', async(req, res) =>{
            const id = req.params.id;
            const query={_id: ObjectId(id)};
            const camera = await Collection.findOne(query);
            res.send(camera);
        });
        
       
        app.post('/camera', async(req, res) =>{
            const newCamera = req.body;
            console.log('add a new user', newCamera);
            const result = await Collection.insertOne(newCamera);
            res.send(result);
            console.log(newCamera);
        });


        app.delete('/camera/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await Collection.deleteOne(query);
            console.log('delete a camera', result);

            res.send(result);
        });

        app.put('/camera/:id', async(req, res) =>{
            const id = req.params.id;
            const updatedCamera = req.body;
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    name: updatedCamera.name,
                    description: updatedCamera.description,
                    price: updatedCamera.price,
                    img: updatedCamera.img,
                    quantity: updatedCamera.quantity,
                    supplier:updatedCamera.supplier,
                    sold: updatedCamera.sold,


                }

        

            };
            const result = await Collection.updateOne(filter, updatedDoc, options);
            res.send(result);

        })



    }
    finally {

    }
}

run().catch(console.dir);

 



app.get('/', (req, res) =>{
    res.send('my server');
});

app.listen(port, () =>{
    console.log('Server ', {port});
});