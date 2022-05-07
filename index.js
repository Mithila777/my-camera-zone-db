const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

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

        app.get('/camara/:id', async(req, res) =>{
            const id = req.params.id;
            const query={_id: ObjectId(id)};
            const camera= await Collection.findOne(query);
            res.send(camera);
        });

       

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