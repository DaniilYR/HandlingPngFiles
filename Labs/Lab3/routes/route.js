var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

var arts = require('../public/json/arts.json');
var players = require('../public/json/players.json');
var auction = require('../public/json/auction.json');

/* GET домашняя стрвница (список картин). */
router.get('/', function(req, res, next) {
  res.render('paintings', { pictures: arts.arr});
});

/* GET переход к карточке картины. */
router.get('/painting/:id', function (req, res){
  const id = req.params.id *1;
  var picture = arts.arr.find(p => p.id === id);
  if (picture) {
    res.render('painting', { title: 'Картина', picture: picture});
  }
});

/* GET список игроков ( участников аукциона). */
router.get('/players', function (req, res){
  res.render('players', {participants: players.arr});
});

/* GET переход к карточке игрока (участника аукциона). */
router.get('/player/:id', function (req, res) {
  const id = req.params.id;
  var player = players.arr.find(p => p.id == id);
  if (player) {
    res.render('player', { title: 'Участник', participant: player, pictures:arts.arr});
  }
});

/* GET страница настроек аукциона. */
router.get('/ASettings', (req, res, next) => {
  res.render('ASettings', {title: 'Настройки аукциона', pictures: arts.arr, auction: auction.myAuc});
});

/* добавление картины. */
router.get('/addPic', function (req, res){
  console.log("IN ROUTERS");
  let id = arts.arr.length+1;
  let newPic = {
    "id": id,
    "name": req.query.name,
    "author": req.query.author,
    "date": req.query.date,
    "beginning_price": "-",
    "pt": req.query.pt,
    "inAuction": false,
    "min_step": "-",
    "max_step": "-"
  }
  arts.arr.push(newPic);

  fs.writeFile(path.join(__dirname,'..','public','json','arts.json'),JSON.stringify(arts),function(err){
    if(err) throw err;
  })

  return res.send(newPic);

});

/* добавление участика. */
router.get('/addPl', function (req, res){
  let id = players.arr.length;
  let newPl = {
    "id": id,
    "name": req.query.name,
    "card": req.query.card,
    "money": req.query.money,
    "auction": ""
  }

  players.arr.push(newPl);

  fs.writeFile(path.join(__dirname,'..','public','json','players.json'),JSON.stringify(players),function(err){
    if(err) throw err;
  })

  return res.send(newPl);

});

/* изменение настроек аукциона. */
router.get('/changeSet', function (req, res){
  var auc = req.query;
  auc.id="auction";
  auction.myAuc = auc;

  fs.writeFile(path.join(__dirname,'..','public','json','auction.json'),JSON.stringify(auction),function(err){
    if(err) throw err;
  })

  return res.send(auction.myAuc);
});

/* изменения картины. */
router.get('/changePic', function (req, res){
  console.log("IN CHANGE");
  var pic = req.query;
  let id = req.query.id *1;
  var index = -1;
  for(let i = 0; i < arts.arr.length; i++) {
    if (arts.arr[i].id === id) {
      index = i;
    }
  }
  if (arts.arr[index].inAuction === true) {
    arts.arr[index].name = req.query.name;
    arts.arr[index].author = req.query.author;
    arts.arr[index].date = req.query.date;
    arts.arr[index].beginning_price = req.query.beginning_price;
    arts.arr[index].min_step = req.query.min_step;
    arts.arr[index].max_step = req.query.max_step;
    pic.inAuction = true;
  } else {
    arts.arr[index].name = req.query.name;
    arts.arr[index].author = req.query.author;
    arts.arr[index].year = req.query.year;
    pic.inAuction = false;
  }

  //console.log(arts.arr[index]);

  pic.functionName = 'changePic';

  fs.writeFile(path.join(__dirname,'..','public','json','arts.json'),JSON.stringify(arts),function(err){
    if(err) throw err;
  })

  //console.log(pic);

  return res.send(pic);

});

/* удаления картины со ставок. */
router.get('/removeFromAuction', function (req, res){
  let id = req.query.id *1;
  var pic = req.query;
  var index = -1;
  for(let i = 0; i < arts.arr.length; i++) {
    if (arts.arr[i].id === id) {
      index = i;
    }
  }
  arts.arr[index].inAuction = false;

  pic.functionName = 'removeFromAuction';

  fs.writeFile(path.join(__dirname,'..','public','json','arts.json'),JSON.stringify(arts),function(err){
    if(err) throw err;
  })

  return res.send(pic);

})

/* удаления картины. */
router.get('/delPic', function (req, res){
  var pic = req.query;
  let id = pic.id *1;
  var index = -1;
  for(let i = 0; i < arts.arr.length; i++) {
    if (arts.arr[i].id === id) {
      index = i;
    }
  }
  if (index !== -1) {
    arts.arr.splice(index,1);
  }

  fs.writeFile(path.join(__dirname,'..','public','json','arts.json'),JSON.stringify(arts),function(err){
    if(err) throw err;
  })

  pic.functionName = 'delPic';

  return res.send(pic);

})

/* добавление картины на ставки. */
router.get('/addInAuction', function (req, res){
  var pic = req.query;
  var index = -1;
  for(let i = 0; i < arts.arr.length; i++) {
    if (arts.arr[i].id === (pic.id*1)) {
      index = i;
      break;
    }
  }
  arts.arr[index].inAuction = true;
  arts.arr[index].beginning_price = pic.beginning_price;
  arts.arr[index].min_step = pic.min_step;
  arts.arr[index].max_step = pic.max_step;
  pic = arts.arr[index];

  fs.writeFile(path.join(__dirname,'..','public','json','arts.json'),JSON.stringify(arts),function(err){
    if(err) throw err;
  })

  pic.functionName = 'addInAuction';

  console.log(pic);

  return res.send(pic);
});

/* удаления игрока. */
router.get('/delPl', function (req, res){
  var pl = req.query;
  let id = pl.id *1;
  var index = -1;
  for(let i = 0; i < players.arr.length; i++) {
    if (players.arr[i].id === id) {
      index = i;
    }
  }
  if (index !== -1) {
    players.arr.splice(index,1);
  }

  fs.writeFile(path.join(__dirname,'..','public','json','players.json'),JSON.stringify(players),function(err){
    if(err) throw err;
  })

  return res.send(pl);

});

/* добавление картины в желание игрока. */
router.get('/addPicToPl', function (req, res){
  var pl = req.query;
  let id = pl.id*1;
  var index = -1;
  for(let i = 0; i < players.arr.length; i++) {
    if (players.arr[i].id === id) {
      index = i;
      break;
    }
  }
  if(players.arr[index].auction === "")
    players.arr[index].auction = []
  players.arr[index].auction.push({picture: pl.picture, maxPrice: pl.maxPrice});

  fs.writeFile(path.join(__dirname,'..','public','json','players.json'),JSON.stringify(players),function(err){
    if(err) throw err;
  })

  return res.send(pl);
});

/* изменение денежного счета игрока. */
router.get('/changeMoney', function (req, res){
  var pl = req.query;
  let id = pl.id *1;;
  let index = -1;
  for(let i = 0; i < players.arr.length; i++) {
    if (players.arr[i].id === id) {
      index = i;
      break;
    }
  }
  players.arr[index].money = pl.money;

  fs.writeFile(path.join(__dirname,'..','public','json','players.json'),JSON.stringify(players),function(err){
    if(err) throw err;
  })

  return res.send(pl);

})
module.exports = router;
