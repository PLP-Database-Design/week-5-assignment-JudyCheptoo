// Import our dependencies
const express = require("express");
const app = express()
const mysql = require('mysql2');
const dotenv = require('dotenv');

//configure environment variables
dotenv.config();

//Create a connection object
const db = mysql.createConnection({
    host:process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})


//test the connection
db.connect((err) =>{
    //Connection is not successful
    if(err) {
        return console.log('Error connecting to the database:', err)
    }
    //Connection is successful
    console.log("Successfully connected to MySQL:", db.threadId)
})

//this part is not important
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


//Question 1:Retrieve all patients
app.get('', (req, res) => {
    const getpatients = "SELECT patient_id, first_name, last_name, date_of_birth FROM patients"
    db.query(getpatients, (err, data) => {
        // if I have an error
        if(err) {
            return res.status(400).send("Failed to get patients", err)
        }

        res.status(200).render('data', {data})
    })
})

// Question 2:Retrieve all providers
app.get('', (req, res) => {
    const getproviders = "SELECT first_name, last_name, providers_speciality FROM providerss"
    db.query(getproviders, (err, data) => {
        // if I have an error
        if(err) {
            return res.status(400).send("Failed to get providers", err)
        }

        res.status(200).render('data', {data})
    })
})

//Question 3:Filter patients by First Name
app.get('', (req, res) => {
    const {first_name } = req.query;
    const patients = 'SELECT first_name, last_name, provider_specialty FROM patients WHERE first_name = ?';
    db.query(patients, [first_name], (err, data) => {
        // if I have an error
      if (err) {
        return res.status(400).send('Failed to filter patients by first_name', err)
      }

      res.status(200).render('data', {data});
    });
  });

  //Question 4: Retrieve all providers by their speciality
  app.get('', (req, res) => {
    const { provider_specialty } = req.query;
    const providers = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
    db.query(providers, [provider_specialty], (err, data) => {
        // if I have an error
      if (err) {
        return res.status(400).send('Failed to retrieve providers by speciality', err)
      }

      res.status(200).render('data', {data});
    });
  });



// Start and listen to the server
app.listen(3300, () => {
    console.log(`server is running on port 3300`)
})