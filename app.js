var express = require("express");
var cors = require("cors");
var app = express();
const dbConnection = require("./database");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

app.use(cors());

app.post("/test", jsonParser, function (req, res, next) {
  dbConnection.execute(
    "SELECT * FROM employee WHERE emp_role = ?", [req.body.emp_role],
    function (err, results, fields) {
      if (err) {
        res.json({ msg: "error" });
      }
      console.log(results);
      console.log(fields);
    }
  );
  //res.json({msg: 'This is CORS-enabled for all origins!'})
});

app.use("/", (req, res) => {
  res.status(404).send("<h1>404 Page Not Found!</h1>");
});

app.listen(3333, function () {
  console.log("CORS-enabled web server listening on port 3333");
});
