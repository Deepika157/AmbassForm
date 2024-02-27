const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');


var app = express()
var cors = require('cors')

app.use(cors())
const port = 5000;

app.use(bodyParser.json());


mongoose.connect('mongodb://localhost:27017/mydbase2')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
    });


const dataSchema = new mongoose.Schema({
    name: String,
    lastname: String,
    email: String,
    phone: String,
    dob: String,
    location:String,
    gender: String,
    niche: String,
    channel:String,
    followers: String,
    reach:String,
    engage:String,
    hire: String,
    creator: String,
    fees: String
});


const Data = mongoose.model('Data', dataSchema);

app.post('/submitData', async (req, res) => {
    try {
        console.log(res.body)

        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const lastname = req.body.lastname;
        const dob = req.body.dob;
        const location= req.body.location;
        const gender = req.body.gender;
        const niche = req.body.niche;
        const channel= req.body.channel;
        const reach = req.body.reach;
        const followers = req.body.followers;
        const hire = req.body.hire;
        const creator= req.body.creator;
        const engage= req.body.engage;
        const fees= req.body.fees;

        console.log(req.body)

        const newData = new Data({
            name,
            lastname,
            email,
            phone,
            dob,
            location,
            gender,
            niche,
            channel,
            followers,
            reach,
            engage,
            fees,
            creator,
            hire
        });

        await Data.insertMany(newData);

        res.status(201).send('User created successfully');
        console.log(newData);
    } catch (error) {

        console.error('Error saving user:', error);
        res.status(500).send('An error occurred while saving user');
    }
});


app.get('/data', async (req, res) => {

    try {
        const documents = await Data.find({}, { _id: 0, __v: 0 });

        // const result = await collection.find({  });
        console.log(documents)
        const csvArray = documents.map((document) => {
            return {
                name: document.name,
                lastname: document.lastname,
                email: document.email,
                phone: document.phone,
                location: document.location,
                dob: document.dob,
                gender: document.gender,
                niche: document.niche,
                channel: document.channel,
                followers: document.followers,
                reach:document.reach,
                engage:document.engage,
                fees:document.fees,
                creator: document.creator,
                hire: document.hire
            }
        })
        const csvWriter = createCsvWriter({
            path: 'output.csv',
            header: [
                { id: 'name', title: 'FIRST NAME' },
                { id: 'lastname', title: 'LAST NAME' },
                { id: 'phone', title: 'PHONE NUMBER' },
                { id: 'email', title: 'EMAIL ADDRESS' },
                { id: 'dob', title: 'DOB' },
                {id: 'location', title:'LOCATION'},
                { id: 'gender', title: 'GENDER' },
                { id: 'niche', title: 'NICHE' },
                { id: 'channel', title: 'INSTAGRAM HANDLE' },
                { id: 'followers', title: 'HOW MANY INSTAGRAM FOLLOWERS DO YOU HAVE?' },
                {id: 'reach', title: 'REACH'},
                {id: 'engage', title:'ENGAGEMENT'},
                {id:'fees', title:'FEES'},
                {id: 'creator', title:'ARE YOU A FULL-TIME OR PART-TIME CREATOR?'},
                {id: 'hire', title: 'WHY WE HIRE YOU?'}
            ]
        });
        await csvWriter.writeRecords(documents);

        if (documents) {
            // res.status(200).send(JSON.stringify(documents))
            const filePath = path.join(__dirname, 'output.csv');

            // res.sendFile(filePath);
            const options = {
                root: path.join(__dirname)
            };
            res.sendFile("output.csv", options, function (err) {
                if (err) {
                    console.error('Error sending file:', err);
                } else {
                    console.log('Sent:', "output.csv");
                }
            })
        }
        else {
            res.status(400)
        }
        console.log('CSV file exported successfully');
    }

    catch (error) {
        console.error('Error:', error);
    }
    finally {

    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});