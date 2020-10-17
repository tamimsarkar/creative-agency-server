const express = require('express');
const port = 4000;
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors')
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
require('dotenv').config()
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('services'));
app.use(fileUpload());

var uri = 'mongodb://tamimsarkar:z5JkS3qGpYG4Eqag@cluster0-shard-00-00.iwehv.mongodb.net:27017,cluster0-shard-00-01.iwehv.mongodb.net:27017,cluster0-shard-00-02.iwehv.mongodb.net:27017/agencyDB?ssl=true&replicaSet=atlas-w82rim-shard-0&authSource=admin&retryWrites=true&w=majority';
MongoClient.connect(uri, function (err, client) {
    const serviceCollection = client.db("agencyDB").collection("services");
    const ordersCollection = client.db("agencyDB").collection("orders");
    const reviewsCollection = client.db("agencyDB").collection("reviews");
    const adminCollection = client.db("agencyDB").collection("admins");
    
    // post service
    app.post('/addService', (req, res) => {
        const file = req.files.file;
        const service = req.body.service;
        const description = req.body.description;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        serviceCollection.insertOne({ service, description, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })


    })

    // ADD ADMIN
    app.post('/addAdmin', (req, res) => {
      
        const email = req.body.email;
       
      
        adminCollection.insertOne({ email })
            .then(result => {
                res.send(result.insertedCount > 0);
            })


    })

    // check admin

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, admins) => {
                res.send(admins.length > 0);
            })
    })
    // POST REVIEW
    app.post('/addReview', (req, res) => {
       
        const name = req.body.name;
        const companyName = req.body.companyName;
        const photo = req.body.photo;
        const description = req.body.description;
       
      

        reviewsCollection.insertOne({ name, companyName, photo, description})
            .then(result => {
                res.send(result.insertedCount > 0);
            })


    })
    // GET REVIEW
    app.get('/reviews' ,(req, res) => {
        reviewsCollection.find({})
        .toArray((err,documents) => {
            res.send(documents)
        })
    })
    // POST ORDERS

    app.post('/addOrder', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const email = req.body.email;
        const service = req.body.service;
        const description = req.body.description;
        const projectDetails = req.body.projectDetails;
        const price = req.body.price;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        ordersCollection.insertOne({ name, email,service,projectDetails,description, price , image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })


    })
    //getting orders
    app.get('/orders' , (req,res) =>{
        ordersCollection.find({})
        .toArray((err,docs) =>{
            res.send(docs)
        })
    })
    app.get('/services' , (req,res) => {
        serviceCollection.find({})
        .toArray((err,documents) => {
            res.send(documents)
        })
    })

    // Total Orders
    app.get('/total-order',(req,res) => {
        ordersCollection.find({})
        .toArray((err,documents) => {
            res.send(documents)
        })
    })

    
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || port)