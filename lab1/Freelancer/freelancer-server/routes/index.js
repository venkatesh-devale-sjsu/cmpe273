var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connectionPool = mysql.createPool({
  connectionLimit : 1000,
  host : 'localhost',
  user : 'root',
  password : 'root',
  database : 'freelancer'
})


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/signup', function(req, res, next) {
  console.log(req.body);

  const username = req.body.username;
  const password = req.body.password;
  const emailid = req.body.emailid;
  const usertype = req.body.radioHireOrEmployer;

  connectionPool.getConnection((err, connection) => {
    if(err) {
      res.json({
        code : 100,
        status : "Error in connecting to database"
      });
      
    } else {
      console.log('Connected to database with thread '+ connection.threadId);
      var sql = 'INSERT INTO users (username, email, password, usertype) VALUES (?, ?, ?, ?)';
      connection.query(sql,[username, emailid, password, usertype], (err, result) => {
        if(err) {
          console.log(err.name);
          console.log(err.message);
          res.json('ERROR');
        }
        else {
          console.log("New user signed up...");
          res.json('SIGNUP_SUCCESS');
        }
      });
      
    }
  })
  
});

router.post('/login', function(req, res, next) {
  console.log(req.body);
  connectionPool.getConnection((err, connection) => {
    if(err) {
      res.json({
        code : 100,
        status : "Error in connecting to database"
      });
      
    } else {
      console.log('Connected to database with thread '+ connection.threadId);
      var sql = 'SELECT * from users WHERE username = ' + mysql.escape(req.body.username) +' AND password = ' + mysql.escape(req.body.password);
      connection.query(sql, (err, result) => {
        if(result.length == 0) {
          res.json('ERROR');
        }
        else {
          console.log(result);
          res.json(result);
        }
      });
      
    }
  })
});

router.post('/updateprofile', function(req, res, next) {
  console.log(req.body);
  const username = req.body.username;
  const email = req.body.email;
  const phone = req.body.phone;
  const aboutme = req.body.aboutme;

  connectionPool.getConnection((err, connection) => {
    if(err) {
      console.log('Cannot connect to DB..');
    } else {
      console.log('Connected to database with thread '+ connection.threadId);
      var sql = 'UPDATE users SET email = ' + mysql.escape(email) + ', phone = ' + mysql.escape(phone) + ', aboutme = ' + mysql.escape(aboutme) +
                  ' WHERE username = ' + mysql.escape(username);
      console.log(sql);
      connection.query(sql,(err, result) => {
        if(err) {
          console.log(err.name);
          console.log(err.message);
          //res.json('ERROR');
        }
        else {
          console.log("user updated...");
          res.json('UPDATE_SUCCESS');
        }
      });
    }
  })
});

router.post('/getprofile', function(req, res, next) {
  console.log(req.body);
  connectionPool.getConnection((err, connection) => {
    if(err) {
      res.json({
        code : 100,
        status : "Error in connecting to database"
      });
      
    } else {
      console.log('Connected to database with thread '+ connection.threadId);
      var sql = 'SELECT * from users WHERE username = ' + mysql.escape(req.body.username);
      connection.query(sql, (err, result) => {
        if(result.length == 0) {
          res.json('ERROR');
        }
        else {
          console.log(result);
          res.json(result);
        }
      });
      
    }
  })
});


router.post('/postproject', function(req, res, next) {
  console.log('In server side...', req.body);
  const employer = req.body.owner;
  const title = req.body.title;
  const description = req.body.description;
  const skills_required = req.body.skillsRequired;
  const budgetrange = req.body.budgetrange;
  const id = req.body.id;

  connectionPool.getConnection((err, connection) => {
    if(err) {
      res.json('DB Connection error');
    } else {
      var sql = 'INSERT INTO projects (id, title, description, skills_required, budgetrange, employer) VALUES (?, ?, ?, ?, ?, ?)';
      connection.query(sql, [id, title, description, skills_required, budgetrange, employer], (err, result) => {
          if(err) {
            console.log(err);
            res.json('ERROR');
          } else {
            console.log('Project inserted successfully...');
            res.json('PROJECT_INSERTED_SUCCESS');
          }
        })
    }
  })
  
});


router.post('/getallopenprojects', function(req, res, next) {
  console.log('In getallopenprojects');
  connectionPool.getConnection((err, connection) => {
    if(err) {
      res.json({
        code : 100,
        status : "Error in connecting to database"
      });
      
    } else {
      console.log('Connected to database with thread '+ connection.threadId);
      var sql = 'SELECT * from projects WHERE open = ' + mysql.escape('open');
      connection.query(sql, (err, result) => {
        if(result.length == 0) {
          res.json('ERROR');
        }
        else {
          console.log(result);
          res.json(result);
        }
      });
      
    }
  })
});

router.post('/getmypublishedprojects', function(req, res, next) {
  console.log('In getmypublishedprojects');
  connectionPool.getConnection((err, connection) => {
    if(err) {
      res.json({
        code : 100,
        status : "Error in connecting to database"
      });
      
    } else {
      console.log('Connected to database with thread '+ connection.threadId);
      var sql = 'SELECT * from projects WHERE employer = ' + mysql.escape(req.body.username);
      connection.query(sql, (err, result) => {
        if(result.length == 0) {
          res.json('ERROR');
        }
        else {
          console.log(result);
          res.json(result);
        }
      });
      
    }
  })
});


router.post('/insertBidAndUpdateNumberOfBids', function(req, res, next) {
  console.log(req.body);
  const pid = req.body.project_id;
  const bidAmount = req.body.bid;
  const days = req.body.deliveryDays;
  const freelancer = req.body.freelancer;
  let bids = 0;
  connectionPool.getConnection((err, connection) => {
    if(err) {
      res.json({
        code : 100,
        status : "Error in connecting to database"
      });
      
    } else {
      console.log('Connected to database with thread '+ connection.threadId);
      var sqlInsert = 'INSERT INTO bids (projectid, freelancer, period, bidamount) VALUES (?, ?, ?, ?)';
      connection.query(sqlInsert,[pid, freelancer, days, bidAmount], (err, result) => {
        if(err) {
          //console.log(err.name);
          //console.log(err.message);
          res.json('ERROR');
        }
        else {
          console.log("Bid inserted Successfully...");
          res.json('BID INSERTED SUCCESS');
        }
      });
       
      var getNumberOfBids = 'SELECT number_of_bids from projects WHERE id = ' + mysql.escape(pid);
      connection.query(getNumberOfBids, (err, result) => {
        if(err) 
          console.log(err);
        else {
          bids = result[0].number_of_bids;
        console.log('After getNumberOfBids...'+bids);
        var ubids = bids + 1;
        var updateBids = 'UPDATE projects SET number_of_bids = ' + ubids + ' WHERE id = ' + mysql.escape(pid);
          connection.query(updateBids, (err, result) => {
            if(err)
              console.log(err);
            else
              console.log('After updateBids...',result);
        
        });
        }
        
      });
      
      
      
      
    }
  })
  
});


module.exports = router;
