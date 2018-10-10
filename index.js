const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.json());


// Handles any requests that don't match the ones above
// app.get('*', (req,res) =>{
//     res.sendFile(path.join(__dirname+'/client/build/index.html'));
// });

const portNumber = process.env.PORT || 5000;

const server = app.listen(portNumber, ()=>{
    let port = server.address().port;
    console.log('Server listening on port '+ port);
});

var con = mysql.createConnection({
    host: "localhost",
    user: "squarefeetusers",
    password: "asdf1234",
    database: "squarefeet"
  });

//sample api
app.get('/api/getList', (req,res) => {
    const list = ["item1", "item2", "item3"];
    //res.json(list);
    //console.log('Sent list of items');

    con.connect((err) => {
        if (err) throw err;
        console.log("Connected!");
        con.query("select * from userinfo;", function (err, result) {
          if (err) throw err;
          res.send(result);
          console.log(result);
        });
      });

});

app.post('/api/login', (req,res) => {
   let email = req.body.email;
   query = "select email from userinfo where email = '" + email + "';"

//    con.connect((err) => {
//     if (err) throw err;
//     console.log("Connected!");
//     con.query("select * from userinfo", function (err, result) {
//       if (err) throw err;
//       console.log("Database created");
//     });
//   });
   
});
