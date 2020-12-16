const express = require("express");
const fs = require('fs');
const path = require('path');
const app = express();

// создаем парсер для данных в формате json
const jsonParser = express.json();

// настройка CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, PATCH, PUT, POST, DELETE, OPTIONS");
  next();
});

var stocks = require('./stocks.json');
var brokers = require('./brokers.json');
var settings = require("./settings.json");

// обработчик по маршруту localhost:3000/postuser
app.post("/postuser", jsonParser, function (req, res) {

  // если не переданы данные, возвращаем ошибку
  if(!req.body) return res.sendStatus(400);

  if(req.body.name === 'Add'){
    //console.log('TUT');
    let newStock = {
      "title": req.body.title,
      "price": req.body.price,
      "count": req.body.count,
      "maxCount": req.body.maxCount
    }
    stocks.arr.push(newStock);
    fs.writeFile(path.join(__dirname,'.','stocks.json'),JSON.stringify(stocks),function(err){
      if(err) throw err;
    })
    res.json(stocks);
  }

  if(req.body.name === 'Del'){
    var index = -1;
    for(let i = 0; i < stocks.arr.length; i++) {
      if (stocks.arr[i].title === req.body.title) {
        index = i;
      }
    }
    if (index !== -1) {
      stocks.arr.splice(index,1);
    }
    fs.writeFile(path.join(__dirname,'.','stocks.json'),JSON.stringify(stocks),function(err){
      if(err) throw err;
    })
  }

  if(req.body.name === 'Change'){
    for(let i = 0; i < stocks.arr.length; i++){
      if(req.body.title === stocks.arr[i].title){
        stocks.arr[i].price = req.body.price;
        stocks.arr[i].count = req.body.count;
        stocks.arr[i].maxCount = req.body.maxCount;
      }
    }
    fs.writeFile(path.join(__dirname,'.','stocks.json'),JSON.stringify(stocks),function(err){
      if(err) throw err;
    })

  }
  if(req.body.name === 'Get'){
    res.json(stocks);
  }
});

app.post("/broker", jsonParser, function (req, res){
  // если не переданы данные, возвращаем ошибку
  if(!req.body) return res.sendStatus(400);

  if(req.body.name === 'Get'){
    res.json(brokers);
  }

  if(req.body.name === 'Add'){
    let newBroker = {
      "brokerName" : req.body.brokerName,
      "money" : req.body.money
    }
    brokers.arr.push(newBroker)
    fs.writeFile(path.join(__dirname,'.','brokers.json'),JSON.stringify(brokers),function(err){
      if(err) throw err;
    })
    res.json(brokers);
  }

  if(req.body.name === 'Change'){

    for(let i = 0; i < brokers.arr.length; i++){
      if(req.body.brokerName === brokers.arr[i].brokerName){
        brokers.arr[i].money = req.body.money;
      }
    }

    fs.writeFile(path.join(__dirname,'.','brokers.json'),JSON.stringify(brokers),function(err){
      if(err) throw err;
    })
  }

  if(req.body.name === 'Del'){
    var index = -1;
    for(let i = 0; i < brokers.arr.length; i++) {
      if (brokers.arr[i].brokerName === req.body.brokerName) {
        index = i;
      }
    }
    if (index !== -1) {
      brokers.arr.splice(index,1);
    }

    fs.writeFile(path.join(__dirname,'.','brokers.json'),JSON.stringify(brokers),function(err){
      if(err) throw err;
    })
  }

});

app.post("/set", jsonParser, function (req, res){
  if(!req.body) return res.sendStatus(400);
  if(req.body.name === 'Get'){
    res.json(settings);
  }
  if(req.body.name === 'Change'){
    settings.arr[0].beginTimeH = req.body.beginTimeH;
    settings.arr[0].beginTimeM = req.body.beginTimeM;
    settings.arr[0].endTimeH = req.body.endTimeH;
    settings.arr[0].endTimeM = req.body.endTimeM;
    settings.arr[0].interval = req.body.interval;
    fs.writeFile(path.join(__dirname,'.','settings.json'),JSON.stringify(settings),function(err){
      if(err) throw err;
    })
  }
})

app.listen(3000);
