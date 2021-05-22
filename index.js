const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mongodb');
const port = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const MongoClient = require('mongodb').MongoClient;
//const { default: App } = require('./react/course-app/src/App.js');
const url = "mongodb://localhost:27017/";

// Connect to the MongoDb server
const client = new MongoClient(url, { useUnifiedTopology: true });
client.connect((err) => {
    if (err) throw err;
      
    /* Change the database:  we use the db( ) method of the connection to access a database.
     The db( ) method returns an object.
     */
    const dbo = client.db('uwwDB');

    app.get('/', (req, res) => {
        res.send('RESTful Api!');
    });

    app.get('/coursebyid/:id', (req, res) => {
        const selectedId = +req.params.id;// course id is saved as an integer


        // Select documents
        dbo.collection("schedule").find({id: selectedId}).toArray((error, courseList) =>{
            if (error) throw error;
            res.send(courseList);
        });
          
    });

  
    app.get('/subjects', (req, res) => {
        // http://localhost:4000/subjects
        dbo.collection("subjects").find({},{projection:{_id:0}}).toArray((error, subjectList) =>{
            if (error) throw error;
            res.send(subjectList);
        });
          
    });
    app.get('/schedule/:location', (req, res) => {

        // Example I used regex to make it easier so you dont have to type the full location http://localhost:4000/schedule/Center%20of%20the%20Arts%202
        const location = req.params.location;
        
        dbo.collection("schedule").find({location: {$regex: location}}, {projection:{_id:0}}).toArray((error, locationList) =>{
            if (error) throw error;
            
            
            res.send(locationList);
        });
          
    });
    app.get('/schedulesubject/:subject', (req, res) => {

        // Example, I used regex http://localhost:4000/schedulesubject/MAGD
        const subject = req.params.subject;
        
        dbo.collection("schedule").find({course: {$regex: subject}}, {projection:{_id:0}}).toArray((error, subjectList) =>{
            if (error) throw error;
            
            
            res.send(subjectList);
        });
          
    });

    app.get('/schedulecourse/:course', (req, res) => {

        // Example http://localhost:4000/schedulesubject/MAGD%20150
        const course = req.params.course;
        
        dbo.collection("schedule").find({course: course}, {projection:{_id:0}}).toArray((error, courseList) =>{
            if (error) throw error;
            
            
            res.send(courseList);
        });
          
    });
    app.get('/scheduleinstructor/:instructor', (req, res) => {

        // Example http://localhost:4000/scheduleinstructor/Miller
        const instructor = req.params.instructor;
        
        dbo.collection("schedule").find({instructor: {$regex: instructor}}, {projection:{_id:0}}).toArray((error, instructorList) =>{
            if (error) throw error;
            
            
            res.send(instructorList);
        });
          
    });
    app.get('/courses/:credits', (req, res) => {

        // Example http://localhost:4000/courses/5
        const credits = +req.params.credits;
        
        dbo.collection("courses").find({maxcredits: credits}, {projection:{_id:0}}).toArray((error, creditsList) =>{
            if (error) throw error;
            
            
            res.send(creditsList);
        });
          
    });
    app.put('/addcourse', (req, res) => {
        const selectedid = req.body;
        console.log(selectedid);
        dbo.collection('schedule').find({id:selectedid.id}).toArray((err, cor) => {
                 if (err) throw err;
    
                 let c = cor[0];
                 console.log(c);
    
                dbo.collection("semesterplan").insertOne({id: selectedid.id, location: c.location, course: c.course, days: c.days, time: c.time, section: c.section, instructor: c.instructor}).then(() => {
                    
                    res.send({status: 1});
                    
                       
             }); 
             
             });
        
    });
    app.get('/semesterplan', (req, res) => {
        dbo.collection("semesterplan").find({},{projection:{_id:0}}).toArray((error, courseList) =>{
            if (error) throw error;
            res.send(courseList);
        });
    });



});


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));