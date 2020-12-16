var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');

var indexRouter = require('./routes/router');

var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

server.listen(3000, function() {
  console.log('Started, port: 3000')
})

var players = require('./public/json/players.json');
var arts = require('./public/json/arts.json');
var setting = require('./public/json/setting.json');
var count = 0;
var now = '';

io.sockets.on('connection', function (socket){
   // общая рассылка приветствие
   socket.on('echo', (data) => {
       user = data.name;
       const time = setting.myAuc.timeBegin;
       const Minute = time.split(':')[1] *1
       socket.broadcast.json.emit('welcome', { message: `${data.name}-присоединился(лась)`, setting:setting, arts: arts, users:players, start:Minute});
       socket.json.emit('welcome', { message: `${data.name}-присоединился(лась)`, setting:setting, arts: arts, users:players, start:Minute});
   });
   // начало аукциона
   socket.on('startAuction', () => {
       const time = setting.myAuc.timeBegin;
       const Minute = time.split(':')[1] *1;
       const Hour = time.split(':')[0] *1;
       const nowDate = new Date();
       const nowHour = nowDate.getHours() *1;
       const nowMinute = nowDate.getMinutes() *1;
       if(Minute === nowMinute && Hour === nowHour){
           now = "<p>" + 'Аукцион начался';
           socket.broadcast.emit('start', {start: true, all:players.arr});
           socket.emit('start', {start: true, all: players.arr});
       }
       else{
           socket.emit('start', {start: false});
       }

   });
   // сделать ставку
   socket.on('bid', (data) => {
       let newPrice = data.upPrice *1;
       let oldPrice;
       let wid = "-";
       let flag = 0;
       // получили текущей счет usera
       let cash = 0;
       let r = 0;
       let id = 0;
       for(let i = 0; i < players.arr.length; i++){
           if(data.playerr === players.arr[i].name){
               cash = players.arr[i].money;
               r = i;
           }
       }
       cash *= 1;
       if(newPrice > cash){
           flag = -1;
           socket.broadcast.emit('messageBid', {flag:false});
           socket.emit('messageBid', {flag:false});
       }
       else {
           // находим старую цену
           for(let i = 0; i < arts.arr.length; i++){
               if(arts.arr[i].name === data.name){
                   oldPrice = arts.arr[i].current_price;
               }
           }
           oldPrice *= 1;
           if(oldPrice  >= newPrice){
               flag = -1;
               socket.broadcast.emit('messageBid', {flag:false});
               socket.emit('messageBid', {flag:false});
           }
           else {
               wid = data.playerr;
               for(let g = 0; g < players.arr.length; g++){
                   if(players.arr[g].name === data.picUser){
                       let curmo = players.arr[g].money;
                       curmo *= 1;
                       curmo += oldPrice *1;
                       players.arr[g].money = curmo;
                   }
               }
               // списываем у нового сумму
               cash -= newPrice;
               players.arr[r].money -= newPrice;
               // отдает клиенту
               for(let i = 0; i < arts.arr.length; i++){
                   if(arts.arr[i].name === data.name){
                       arts.arr[i].current_price = newPrice;
                       arts.arr[i].owner = wid;
                       console.log(arts.arr[i].name + " " + arts.arr[i].owner);
                       id = arts.arr[i].id;
                   }
               }
               now = "<p>" + wid + ' поднял цену на кортину ' + data.name +  ', новая цена ' + newPrice;
               socket.broadcast.emit('messageBid', {flag:true, price:newPrice, picUser:wid, cash:players.arr, ID:id});
               socket.emit('messageBid', {flag:true, price:newPrice, picUser:wid, cash:players.arr, ID:id});

           }
       }
   });
   // проверка времени прихода usera
   socket.on('UserInAuction', (data) => {
       const dateSettings = setting.myAuc.dateBegin;
       const timeSettings = setting.myAuc.timeBegin;
       const settingsMinute = timeSettings.split(':')[1] *1;
       const settingsHour = timeSettings.split(':')[0] *1;
       const settingsDay = dateSettings.split('-')[2] *1;
       const settingsMonth = dateSettings.split('-')[1] *1;
       const settingsYear = dateSettings.split('-')[0] *1;
       let flag = 0;

       if(data.userYear === settingsYear && data.userMonth === settingsMonth){
           if(data.userDay < settingsDay){flag = -1;}
           if(data.userDay > settingsDay){flag = 1;}
           if(data.userDay === settingsDay){
               if(data.userHour > settingsHour){flag = 1;}
               if(settingsHour - data.userHour > 1){flag = -1;}
               if(settingsHour - data.userHour === 1 || settingsHour - data.userHour === 0){
                   let defferenceMinut = data.userMinute - settingsMinute;
                   if(defferenceMinut < 0){
                       defferenceMinut *= -1;
                       if(defferenceMinut > 3){flag = -1;}
                   }
                   if(defferenceMinut > 3){flag = 1;}
               }
           }
       }
       else {
           let defferernceYear = data.userYear - settingsYear;
           if(defferernceYear < 0){flag = -1;}
           if(defferernceYear > 0){flag = 1;}
       }

       if(flag !== 0){socket.emit('message', {flag:flag});}
       if(flag === 0){socket.emit('start',{start: false});}


   });
   socket.on('AfterAuction', ()=>{
       count++;
       if(count === 1) {now = "<p>" + 'Аукцион окончен';}
       socket.emit('End', {count: count});
   });

   socket.on('toAdmin',(data)=> {
       const DN = now;
       now = '';
       socket.emit('admin2310', {pics:arts.arr, players:players.arr, now:DN});

   });

})

module.exports = app;
