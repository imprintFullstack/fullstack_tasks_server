const express = require('express');
const path = require('path');
const request = require("request");
const app = express();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const bodyParser = require('body-parser')

const port = process.env.PORT || 3000;
const jwtKey = "hellllllow123";

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get('/api/user',[authMiddleware], (req, res) => {
    res.sendFile(path.join(__dirname, './json_data', 'user.json'));
});

app.post('/api/search/songName',[authMiddleware], (req, res) => {
    console.log(req.body.name);
    let songName = req.body.name;
    const songsPath = path.join(__dirname, './json_data', 'songs.json');
    try {
        let file = fs.readFileSync(songsPath);
        file = JSON.parse(file);
        const result = file.chart.filter((x)=> x.heading.title == songName);
        res.json(result);
        
    } catch (error) {
        res.json(error);
    }
});

app.get('/api/songs',[authMiddleware], (req, res) => {
    // const options = {
    //     method: 'GET',
    //     url: 'https://www.shazam.com/shazam/v2/en-US/IL/web/-/tracks/world-chart-world',
    //     qs: { pageSize: '200', startFrom: '0' },
    //     headers: { }
    // };
    // request(options, function (error, response, body) {
    //     if (error) res.json(error);
    //     const data = JSON.parse(body);
    //     res.json(data);
    // });
    res.sendFile(path.join(__dirname, './json_data', 'songs.json'));
});

function authMiddleware(req, res, next){
    try {
      const token = req.headers.authorization.split("Bearer "); 
      const data = jwt.verify(token[1], jwtKey);
      if(data.email == "aviv@cycurity.com" && data.name == "aviv"){
        next();
      }
    } catch (error) {
        console.log(error);
        res.status(403).json({error:"Not Authorize"});
    }
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// cosnt token = jwt.sign({ email: 'aviv@cycurity.com', name: "aviv" }, 'hellllllow123');
