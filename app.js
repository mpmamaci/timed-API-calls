const express = require("express");
const fetch = require("node-fetch");

const fs = require("fs");
const https = require("https");

const app = express();

var currentState = "";

app.get("/status", function (req, res) {
  res.send(currentState);
});

app.get("/api/:minutes", function (req, res) {
  const minutes = req.params.minutes;
  const pw = req.query.p;
  if (!validPw(pw)) {
    res.status = 401;
    res.send("Invalid Password");
    return;
  }
  setTimeout(async () => {
    currentState = "Idle";
    const response = await fetch("HTTP Address");
    if (response.status == 200) {
      const currenDate = getCurrentTime();
      console.log("MESSAGE at: " + currenDate);
    } else {
      const body = await response.body.json();
      console.error("Error during MESSAGE");
      console.error(body.errors[0].message);
    }
  }, minutes * 60000);

  const time = calcTime(new Date().getTime() + minutes * 60000);
  currentState = "MESSAGE at: " + time;
  res.send("MESSAGE in " + minutes + " Minutes -> " + "At " + time);
});

https
  .createServer(
    {
      key: fs.readFileSync("server.key"),
      cert: fs.readFileSync("server.cert"),
    },
    app
  )
  .listen(9696, function () {
    console.log("Server listening on port 9696!");
  });

function getCurrentTime() {
  const currentDate = new Date();
  const seconds = currentDate.getSeconds();
  const minutes = currentDate.getMinutes();
  const hours = currentDate.getHours() + 2; // Local German Time
  const date = currentDate.getDate();
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const dateString =
    hours +
    ":" +
    minutes +
    ":" +
    seconds +
    "  " +
    date +
    "-" +
    (month + 1) +
    "-" +
    year;
  return dateString;
}

function calcTime(unix_timestamp) {
  const date = new Date(unix_timestamp);
  const hours = date.getHours() + 2; // Local German Time
  const minutes = "0" + date.getMinutes();
  const seconds = "0" + date.getSeconds();

  const formattedTime =
    hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
  return formattedTime;
}

function validPw(pw) {
  // TODO: Load password from env
  if (pw === "PASSWORD") {
    return true;
  } else {
    return false;
  }
}
