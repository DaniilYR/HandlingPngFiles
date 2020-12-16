var express = require('express');
var router = express.Router();

var players = require('../public/json/players.json');
var arts = require('../public/json/arts.json');


/* GET home page. */
router.get('/', function(req, res) {

  res.render('index', { title: 'Аукцион' });
});

var cname;
router.post('/in', function (req, res){
  let name = req.body.name;
  if(name === "admin"){
    res.redirect('administration');
    return;
  }
  else {
    for(let i = 0; i < players.arr.length; i++){
      if(req.body.name*1 === players.arr[i].id*1){
        cname = players.arr[i].name;
        res.redirect('main');
        return;
      }
    }
  }
  res.end("NO");
});

router.get('/main', function (req, res){
  res.render('main', {title: cname});
})

router.get('/players/:count' , function (req, res){
  let count = req.params.count *1;
  if(count === 1) {
    for (let i = 0; i < arts.arr.length; i++) {
      if (arts.arr[i].owner !== "") {
        for (let j = 0; j < players.arr.length; j++) {
          if (arts.arr[i].owner === players.arr[j].name) {
            players.arr[j].auction += (arts.arr[i].name + '\n');
          }
        }
      }
    }
  }
  res.render('players',{players: players.arr});
});

router.get('/auction/:user', function (req, res){
  let user = req.params.user;
  console.log(user);
  res.render('auction', {arts: arts.arr, user: user, players: players.arr});
})

router.get('/administration', function (req,res){
  res.render('administration', {title: 'admin', arts: arts.arr, players:players.arr});
});

module.exports = router;
