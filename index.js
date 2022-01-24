var express = require("express");
var mysql = require("mysql2");
var cors = require("cors");

var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const cookieParser = require("cookie-parser");
//const session = require("express-session");

const bcrypt = require("bcrypt");
const saltRounds = 10;

var app = express();
app.use(cors());

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(
//   session({
//     key: "userId",
//     secret: "subscribe",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       expires: 60 * 60 * 24,
//     },
//   })
// );

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  database: "ot_request",
});

//--------------------------EMPLOYEE API------------------------------
//GET EMPLOYEES DATA FORM DB
app.get("/employee", jsonParser, function (req, res) {
  db.execute("SELECT * FROM employees", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//Add Employees (Register)
app.post("/register", jsonParser, function (req, res) {
  bcrypt.hash(req.body.emp_password, saltRounds, function (err, hash) {
    db.execute(
      "INSERT INTO employees (emp_firstname, emp_surname, emp_address, emp_tel, emp_email, emp_username, emp_password, dep_id, role_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        req.body.emp_firstname,
        req.body.emp_surname,
        req.body.emp_address,
        req.body.emp_tel,
        req.body.emp_email,
        req.body.emp_username,
        hash,
        req.body.dep_id,
        req.body.role_id,
      ],
      function (err, results, fields) {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        }
        res.json({ status: "ok" });
      }
    );
  });
});

//LOGIN
app.post("/login", jsonParser, function (req, res, next) {
  db.execute(
    "SELECT * FROM employees WHERE emp_username= ?",
    [req.body.emp_username],
    (err, users, fields) => {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      if (users.length == 0) {
        res.json({ status: "error", message: "no user found" });
        return;
      }
      bcrypt.compare(
        req.body.emp_password,
        users[0].emp_password,
        function (err, result) {
          if (result) {
            res.json({ status: "ok", message: "login success" });
            return;
          } else {
            res.json({ status: "error", message: "login failed" });
          }
        }
      );
    }
  );
});

// app.post("/login", jsonParser, (req, res) => {
//   const email = req.body.email;
//   const password = req.body.password;
//   db.execute(
//     "SELECT * FROM users WHERE email = ? && password = ?",
//     [email, password],
//     (err, result) => {
//       if (err) {
//         res.status(500).send(err);
//       } else {
//         if (result.length > 0) {
//           res.status(200).send({
//             email: result[0].email,
//             fname: result[0].fname,
//           });
//         } else {
//           res.status(400).send("user no existe");
//         }
//       }
//     }
//   );
// });

//--------------------------DEPARTMENT API------------------------------

//GET DEPARTMENT DATA FORM DB
app.get("/department", jsonParser, function (req, res) {
  db.execute("SELECT * FROM department", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//ADD DEPARTMENT
app.post("/department", jsonParser, function (req, res) {
  db.execute(
    "INSERT INTO department (dep_name) VALUES (?)",
    [
      req.body.dep_name,

    ],
    function (err, results, fields) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok" });
    }
  );
});


//UPDATE DEPARTMENT DATA FORM DB
app.put("/department", jsonParser, function (req, res) {
  db.execute(
    "UPDATE department SET dep_name = ? WHERE dep_id = ?",
    [req.body.dep_name, req.body.dep_id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

//DELETE DEPARTMENT DATA FORM DB
app.delete("/department/:dep_id", jsonParser, function (req, res) {
  db.execute("DELETE FROM department WHERE dep_id = ?", [req.params.dep_id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//ADD ACTIVITY
app.post("/activity", jsonParser, function (req, res) {
  db.execute(
    "INSERT INTO activity (act_name, act_place,act_date, act_time, act_image, act_desc) VALUES (?, ?, ?, ?, ?, ?)",
    [
      req.body.act_name,
      req.body.act_place,
      req.body.act_date,
      req.body.act_time,
      req.body.act_place,
      req.body.act_desc,
  
    ],
    function (err, results, fields) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok" });
    }
  );
});

//GET ACTIVITY
app.get("/activity", jsonParser, function (req, res) {
  db.execute("SELECT * FROM activity", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//ADD EMPLOYEES
app.post("/employees", jsonParser, function (req, res) {
  bcrypt.hash(req.body.emp_password, saltRounds, function (err, hash){
  db.execute(
    "INSERT INTO employees (emp_firstname, emp_surname, emp_address, emp_tel, emp_email, emp_username, emp_password, dep_id, role_id, emp_card_id, emp_dob, emp_images, position_id, create_at, update_at, record_status, emp_gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', ?, NOW(), NOW(), '1', ?)",
    [
      req.body.emp_firstname,
      req.body.emp_surname,
      req.body.emp_address,
      req.body.emp_tel,
      req.body.emp_email,
      req.body.emp_username,
      hash,
      req.body.dep_id ,
      req.body.role_id ,
      req.body.emp_card_id ,
      req.body.emp_dob ,
      req.body.position_id ,
      req.body.emp_gender ,

  
    ],
    function (err, results, fields) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok" });
    }
  );
});
});

//SELECT DATA IN EMPLOYEES
app.get("/employeesview", jsonParser, function (req, res) {
  db.execute(
  "SELECT employees.emp_id,employees.emp_firstname,employees.emp_surname,department.dep_name,positions.position_name FROM employees LEFT JOIN department ON employees.dep_id = department.dep_id LEFT JOIN positions ON employees.position_id = positions.position_id"
  , (err, result) => {
  if (err) {
    console.log(err);
  } else {
    res.send(result);
  }
});
});

//GET OT_ASSIGNMENT DATA FORM DB
app.get("/otassignment", jsonParser, function (req, res) {
  db.execute("SELECT * FROM ot_assignment", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//GET OT BY ID
app.get("/otassignment/:ot_id", jsonParser, function (req, res) {
  db.execute("SELECT ot_assignment.ot_id,ot_assignment.ot_name,department.dep_name,ot_assignment.ot_desc,ot_assignment.ot_starttime,ot_assignment.ot_finishtime,ot_assignment.ot_apply,ot_assignment.ot_request,ot_assignment.ot_stump,ot_assignment.ot_status,ot_assignment.ot_rate,TIMEDIFF(ot_assignment.ot_finishtime,ot_assignment.ot_starttime) AS summary FROM ot_assignment LEFT JOIN department ON ot_assignment.dep_id = department.dep_id WHERE ot_assignment.ot_id = ?", [req.params.ot_id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//ADD OT_ASSIGNMENT
app.post("/otassignment", jsonParser, function (req, res) {
  db.execute(
    "INSERT INTO ot_assignment ( ot_name, ot_rate, dep_id, ot_desc, ot_starttime, ot_finishtime, ot_apply, ot_request, ot_stump, ot_status, create_at, update_at, record_status) VALUES ( ?, ?, ?, ?, ?, ?, ?, 0, 0, 1, NOW(), NOW(), 1)",
    [
      req.body.ot_name,
      req.body.ot_rate,
      req.body.dep_id,
      req.body.ot_desc,
      req.body.ot_starttime,
      req.body.ot_finishtime ,
      req.body.ot_apply ,

    ],
    function (err, results, fields) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok" });
    }
  );
});


//SELECT DATA IN OT_ASSIGNMENT
app.get("/otassignview", jsonParser, function (req, res) {
  db.execute(
  "SELECT ot_assignment.ot_id,ot_assignment.ot_name,department.dep_name,ot_assignment.ot_desc,ot_assignment.ot_starttime,ot_assignment.ot_finishtime,ot_assignment.ot_apply,ot_assignment.ot_request,ot_assignment.ot_stump,ot_assignment.ot_status,ot_assignment.ot_rate,TIMEDIFF(ot_assignment.ot_finishtime,ot_assignment.ot_starttime) AS summary FROM ot_assignment LEFT JOIN department ON ot_assignment.dep_id = department.dep_id"
  , (err, result) => {
  if (err) {
    console.log(err);
  } else {
    res.send(result);
  }
});
});

//GET ROLE DATA FORM DB
app.get("/role", jsonParser, function (req, res) {
  db.execute("SELECT * FROM role", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//ADD ROLE
app.post("/role", jsonParser, function (req, res) {
  db.execute(
    "INSERT INTO role (role_name) VALUES (?)",
    [
      req.body.role_name,

    ],
    function (err, results, fields) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok" });
    }
  );
});

//GET POSITION DATA FORM DB
app.get("/positions", jsonParser, function (req, res) {
  db.execute("SELECT * FROM positions", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//ADD POSITION
app.post("/positions", jsonParser, function (req, res) {
  db.execute(
    "INSERT INTO positions (position_name, dep_id, create_at, update_at ) VALUES (?, ?, NOW(), NOW())",
    [
      req.body.position_name,
      req.body.dep_id, 

    ],
    function (err, results, fields) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok" });
    }
  );
});

//SELECT DATA IN POSITIONS
app.get("/positionsview", jsonParser, function (req, res) {
  db.execute(
  "SELECT positions.position_id,positions.position_name,department.dep_name FROM positions LEFT JOIN department ON positions.dep_id = department.dep_id"
  , (err, result) => {
  if (err) {
    console.log(err);
  } else {
    res.send(result);
  }
});
});


app.listen(3333, () => {
  console.log("running server port 3333");
});
 