const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');

const app = express();
const port = 5000;

app.use(bodyParser.json());


mongoose.connect('mongodb://localhost:27017/mydbase2')
    .then(() => { console.log('Connected to MongoDB'); })
    .catch(err => { console.error('Error connecting to MongoDB', err); });


const dataSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String
});

const Data = mongoose.model('Data', dataSchema);

app.get('/data', async (req, res) => {

    try {
        const documents = await Data.find({});

        const csvWriter = createCsvWriter({
            path: 'output2.csv',
            header: [
                { id: 'name', title: 'Name' },
                { id: 'phone', title: 'Phone' },
                { id: 'email', title: 'Email' }
            ]
        });

        await csvWriter.writeRecords(documents);

        res.sendFile(path.join(__dirname,'index.html'));
        
        console.log('CSV file exported successfully');
    }

    catch (error) {
        console.error('Error:', error);
    }

    finally {
        //await mongoose.disconnect();
    }

});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

