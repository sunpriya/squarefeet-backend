const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');


const app = express();

//Static files from the backend
app.use(express.static(path.join(__dirname, 'client/build')));

//Body parser Middleware
app.use(bodyParser.json());


// Handles any requests that don't match any
// We can use this to redirect user to the home screen
// app.get('*', (req,res) =>{
//     res.sendFile(path.join(__dirname+'/client/build/index.html'));
// });

const portNumber = process.env.PORT || 3000;

const server = app.listen(portNumber, ()=>{
    let port = server.address().port;
    console.log('Server listening on port '+ port);
});

// Database credentials for DB connectivity
var con = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "squarefeetusers",
    password: "asdf1234",
    database: "squarefeet"
  });


//sample test api
app.get('/api/getList', (req,res) => {
    //const list = ["item1", "item2", "item3"];
    //res.json(list);
    //console.log('Sent list of items');

    con.query("select * from userinfo;", (err, result) => {
        if (err) throw err;
        res.send(result);
        console.log(result);
    });

});


app.post('/api/signup', (req,res) =>{

    let email = req.body.email;
    let query = "select name from userinfo where email = '" + email + "';";
    con.query(query, (err, result) => {
        if (err) throw err;
        //res.send(result);
        console.log(result);
        if(result.length != 0){
            res.send('User ID already exists.');
            return;
        }
    });

    let name = req.body.name;
    let password = req.body.password;

    let insertQuery = "INSERT into userinfo values (" + name + "," + email + "," + password + ");" 

    con.query(insertQuery,(err, result) =>{
        if(err) throw err;
        console.log('New Record added!');
        res.sendStatus(200);
    })

});

// app.post('/api/login', (req,res) => {
   
//     let email = req.body.email;
//    let password = req.body.password;
//    query = "select * from userinfo where email = '" + email + "';"

//    con.query(query, (err,result) => {
//        if(err) throw err;
//        if(result.length == 0){
//            res.send("This email id is not registered!!");
//            return;
//        }
//        if(result[0].password == password){
//            res.send("User is verified.");
//        }
//    })

// //    con.connect((err) => {
// //     if (err) throw err;
// //     console.log("Connected!");
// //     con.query("select * from userinfo", function (err, result) {
// //       if (err) throw err;
// //       console.log("Database created");
// //     });
// //   });
   
// });

app.post('/api/login', (req,res) => {
    
    let email = req.body.email;
    let password = req.body.password;
    
    query = "select * from userinfo where email = '" + email + "';"
 
    con.query(query, (err,result) => {
        if(err) throw err;
        
        if(result.length == 0){
            res.send("This email id is not registered!!");
            return;
        }
        
        else if(result[0].password !== password){
            res.send("Username/password is incorrect.");
        }
        
        else{
            jwt.sign({user: result[0]}, 'hashkey', (err, token) => {
                res.json({
                    token
                });
            })
        }
    })
});

// Format of token
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined'){    
        const bearer = bearerHeader.split(' ');
        //Get token from array
        const bearerToken = bearer[1];
        //set token in req header
        req.token = bearerToken;
        next();
    }
    
    else{
        res.sendStatus(403);
    }
}