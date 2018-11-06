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

app.use(bodyParser.urlencoded({
    extended: true
}));


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


app.get('/',(req,res) => {
    res.sendFile('index.html');
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

//WEB-API
app.post('/api/websignup', (req,res) =>{

    console.log(req.body);
    let email = req.body["email"];
    
    console.log(email);

    let query = "select username from webappusers where email = '" + email + "';";
    
    con.query(query, (err, result) => {
        if (err) throw err;
        //res.send(result);
        console.log(result);
        if(result.length != 0){
            //alert('User ID already exists.')
            // res.send('User ID already exists.');
            return;
        }
    });

    let name = req.body["name"];
    let mobile = req.body["mobile"];

    let insertQuery = "INSERT into webappusers values ('" + name + "','" + email + "','" + mobile + "');" 

    console.log(name, email, mobile, insertQuery);

    con.query(insertQuery,(err) =>{
        if(err) {
            throw err;
        }
        console.log('New Record added!');
        res.sendStatus(200);
    })

});

//APP-API
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

    console.log(name, email, password);
    //res.send(200);
    let insertQuery = "INSERT into userinfo values ('" + name + "','" + password + "','" + email + "');" 

    console.log(insertQuery);
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
        
        // this thing will ensure protection of routes which require login from user
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

//payment api has to be protected route
app.post('/api/payment', verifyToken, (req,res) => {

});



