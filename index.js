const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express()


app.use(cors());
app.use(express.json())






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.juc7iml.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        const bookCategoriesCollection =  client.db('buySell').collection('booksCategory');
        
        const addBookCollection = client.db('buySell').collection('AddedBooks');
        const addUsersCollection = client.db('buySell').collection('users');
        const opinionUsersCollection = client.db('buySell').collection('usersOpinion');



        app.get('/booksCategories', async(req, res) =>{
            const query = {};
            const options = await bookCategoriesCollection.find(query).toArray();
            res.send(options)
        });


        // book insert api
        app.post('/addbooks' , async(req ,res)=>{
            const addbook = req.body;
            console.log(addbook);
            const result = await addBookCollection.insertOne(addbook);
            res.send(result)

        });

        app.get('/addbooks' ,async(req ,res)=>{
            // const category_name = req.params.category_name;
            const query  = {};
            const result = await addBookCollection.find(query).toArray()
            res.send(result);
        });
        app.get('/addbookss' ,async(req ,res)=>{
            const email= req.query.email;
            const query  = {email: email};
            const result = await addBookCollection.find(query).toArray()
            res.send(result);
        });

        app.get('/addbook', async(req , res)=>{
            const name= req.query.category_name;
            const query= {category_name: name};
            const result = await addBookCollection.find(query).toArray()
            res.send(result)
        });




        
        app.get('/addbookk', async(req , res)=>{
            const name= req.query.sellerEmail;
            const query= {sellerEmail: name};
            const result = await addBookCollection.find(query).toArray()
            res.send(result)
        });









        app.get('/addbook/:id', async(req , res)=>{
            const id= req.params.id;
            const query= {_id:ObjectId(id)};
            const result = await addBookCollection.findOne(query)
            res.send(result)
        });




        //update as a seller

        app.put('/addbook/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            
             const user = req.body;
             console.log(user);
            const option = {upsert: true};
            const updatedUser = {
                $set: {
                    sellerName:user.sellerName,
                    sellerEmail:user.sellerEmail,
                    sellerLocation:user.sellerLocation,
                    sellerPhone:user.sellerPhone,
                    sellerBooked:user.sellerBooked

                }
            }
            const result = await addBookCollection.updateOne(filter, updatedUser, option);
            res.send(result);
        })









        app.post('/users', async(req , res)=>{
            const user = req.body;
            console.log(user);
            const result = await addUsersCollection.insertOne(user);
            res.send(result)
        });


//for user opinion
        app.post('/opinion', async(req , res)=>{
            const user = req.body;
            console.log(user);
            const result = await opinionUsersCollection.insertOne(user);
            res.send(result)
        });
        app.get('/opinion', async(req ,res)=>{
            const query  = {};
            const result = await opinionUsersCollection.find(query).toArray()
            res.send(result);
        })



        app.get('/users', async(req ,res)=>{
            const query  = {};
            const result = await addUsersCollection.find(query).toArray()
            res.send(result);
        })


//advertise api

        app.put('/addbooks/advertise/:id', async(req ,res)=>{
           
            const id =req.params.id;
            
            const filter = {_id:ObjectId(id)};
            const options = {upsert:true}
            const updatedDoc ={
                $set:{
                    advertise: 'now'
                }
            }
            const result =await addBookCollection.updateOne(filter , updatedDoc, options);
            res.send(result)
        });



        app.put('/addbooks/approve/:id', async(req ,res)=>{
           
            const id =req.params.id;
            
            const filter = {_id:ObjectId(id)};
            const options = {upsert:true}
            const updatedDoc ={
                $set:{
                    status: 'approve'
                }
            }
            const result =await addBookCollection.updateOne(filter , updatedDoc, options);
            res.send(result)
        });


        app.put('/addbooks/report/:id', async(req ,res)=>{
           
            const id =req.params.id;
            
            const filter = {_id:ObjectId(id)};
            const options = {upsert:true}
            const updatedDoc ={
                $set:{
                    report: 'Reported'
                }
            }
            const result =await addBookCollection.updateOne(filter , updatedDoc, options);
            res.send(result)
        });








        app.put('/users/admin/:id',async(req ,res)=>{
           
            const id =req.params.id;
            
            const filter = {_id:ObjectId(id)};
            const options = {upsert:true}
            const updatedDoc ={
                $set:{
                    role: 'admin'
                }
            }
            const result =await addUsersCollection.updateOne(filter , updatedDoc, options);
            res.send(result)
        });

        app.get('/users/admin/:email' , async(req ,res)=>{
            const email = req.params.email;
            const query  = {email};
            const user = await addUsersCollection.findOne(query)
            res.send({isAdmin: user?.role === 'admin'});
        })



        app.get('/users/seller/:email' , async(req ,res)=>{
            const email = req.params.email;
            const query  = {email};
            const user = await addUsersCollection.findOne(query)
            res.send({isSeller: user?.select === 'Seller'});
        })

        app.delete('/users/admin/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await addUsersCollection.deleteOne(query)
            res.send(result)
        })
        app.delete('/addbooks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await addBookCollection.deleteOne(query)
            res.send(result)
        })



        



       



    }
    finally{

    }

}
run().catch(console.log)


app.get('/' , async(req ,res)=>{
    res.send('buy sell running')
})
app.listen(port,()=>console.log(port))
