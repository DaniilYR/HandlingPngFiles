var express = require('express');
var router = express.Router();
var book_json = require('../public/json/lib');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Домашняя библиотека' });
});

router.get('/library', function(req, res, next) {
  res.render('library',{title: 'library', books: book_json});
});

router.post('/new', function (req, res) {
  for(let value of book_json){
    if(value.name === req.body.name){
      res.redirect('/library');
      return
    }
  }

  let reserv = book_json.pop();
  book_json.push(reserv);
  let newId = reserv.id+1;

  book_json.push({
    "id": newId,
    "name": req.body.name,
    "author": req.body.author,
    "date": req.body.date,
    "in_library": "да",
    "person": "-",
    "date_return": "-"
  });
  res.redirect('/library');

});

router.post('/del/:number', function (req,res) {
  let id = req.params.number * 1;
  book_json = book_json.filter(it => {
    return it.id !== id;
  });
  res.redirect('/library');
});

router.get('/book/:number', function (req, res) {
  let id = req.params.number * 1;
  const value = book_json.filter(it => {
    return it.id === id;
  });
  res.render('book', {title: 'library', ID: `${value[0].id}`, name: `${value[0].name}`,
    author: `${value[0].author}`, date: `${value[0].date}`, in_library: `${value[0].in_library}`,
    person: `${value[0].person}`, date_return: `${value[0].date_return}`})
});

router.post('/book/read/:number', function (req,res){
  let id = req.params.number*1;
  for (let value of book_json) {
    if (value.id === id) {
      value.person = req.body.name;
      value.date_return = req.body.date_return;
      value.in_library = "нет";
      break;
    }
  }
  //res.redirect('/library');
  res.redirect('/book/' + id);
});

router.post('/book/return/:number', function (req,res){
  let id = req.params.number *1;
  for (let value of book_json) {
    if (value.id === id) {
      value.person = "-";
      value.date_return = "-";
      value.in_library = "да";
      break;
    }
  }
  //res.redirect('/library');
  res.redirect('/book/' + id);
})

router.post('/book/change/:number', function (req,res){
  let id = req.params.number *1;
  for (let value of book_json) {
    if (value.id === id) {
      if (req.body.name)
        value.name = req.body.name;
      if (req.body.author)
        value.author = req.body.author;
      if (req.body.date)
        value.date = req.body.date;
      break;
    }
  }
  res.redirect('/book/' + id);
  //res.redirect('/library');
})

router.post('/book/home', function (req,res){
  res.redirect('/library');
});

router.get('/filter/:functionName', function (req,res){
  let id = req.params.functionName;
  if(id === 'inLib'){
    let idArray = [];
    book_json.forEach((v, i) => {
      if (v.in_library === "нет")
        idArray.push(v.id)
    });
    res.end(JSON.stringify(idArray));
    return;
  }

  if(id === 'allBooks'){
    let allArray = [];
    for (let value of book_json)
      allArray.push(value.id)
    res.end(JSON.stringify(allArray));
    return;
  }

  if (id === 'dateReturn') {
    let dateArray = [];
    var curDate = new Date();
    book_json.forEach((v, i) => {
      let vDate = new Date(v.date_return + 'T23:59:59.999Z')
      if (vDate > curDate || v.in_library === "да") {
        dateArray.push(v.id);
      }
    });
    res.end(JSON.stringify(dateArray));
    return;
  }

})

module.exports = router;
