var socket = io.connect('http://localhost:3000');

socket.on('connect',function(){
    var text = $('title').text();
    if(document.location.href === "http://localhost:3000/main" || document.location.href === "http://localhost:3000/administration"){
        document.cookie = `username=${text}`
    }
    socket.emit('echo', {name:text});
});

socket.on('connect',function(){
    if(document.location.href === "http://localhost:3000/main") {
        let data = new Date();
        const userDay = data.getDate() * 1;
        const userMonth = data.getMonth() * 1 + 1;
        const userYear = data.getFullYear() * 1;
        const userHour = data.getHours() * 1;
        const userMinute = data.getMinutes() * 1;
        socket.emit('UserInAuction', {
            userDay: userDay,
            userMonth: userMonth,
            userYear: userYear,
            userHour: userHour,
            userMinute: userMinute
        });
    }
});

socket.on('welcome', function(data) {
    var text = "<p>" + data.message;
    $('#msg_field').append(text);
    $('#start').html(data.start);
});

socket.on('start', (data)=>{

    const userName = document.cookie.split('=')[1];
    const r = document.location.href.split('/')[3];
    if (data.start === true && userName !== 'admin'&& r !== 'auction') {
        document.location.href = `/auction/${userName}`;
    } else {
        socket.emit('startAuction');
    }
})

socket.on('End', (data) => {
    document.location.href=`/players/${data.count}`;
    socket.broadcast.disconnect();
    socket.disconnect();
});

socket.on('message', (data) => {
    if(data.flag *1 === 1){alert("Вы опаздали на аукцион");}
    if(data.flag *1 === -1){alert("Вы пришли слишком рано");}
    document.location.href= "/";
})

socket.on('messageBid', (data) =>{
    const userName = document.cookie.split('=')[1];
    if(data.flag === true){
        console.log("IN MESSAGEBID");
        console.log(data);
        //меняем цену
        $(`#price${data.ID}`).html(`Цена: ${data.price}`);
        // меняем владельца
        $(`#widower${data.ID}`).html(`Владелец: ${data.picUser}`);
        // меняем тек. счет
        const pl1 = document.cookie.split('=')[1];
        for(let i = 0; i < data.cash.length; i++){
            if(data.cash[i].name === pl1){
                $('#cash').html(`Текущей счет: ${data.cash[i].money}`);
            }
        }
    }
})

function Bid(button){
    const ID = button.id.split(" ")[1];
    const name = $(`#PicName${ID}`).html().split('>')[2];
    const upPrice = $(`#UpPrice${ID}`).val() *1;
    const oldPrice = $(`#price${ID}`).html().split(' ')[1] *1;
    const newPrice = oldPrice + upPrice;
    const picUser = $(`#widower${ID}`).html().split(' ')[1];
    const pl = document.cookie.split('=')[1];
    const up = $(`#minMax${ID}`).html().split(' ')[5] *1;
    const down = $(`#minMax${ID}`).html().split(' ')[3] *1;
    if(upPrice >= down && upPrice <= up){
        socket.emit('bid', {name: name, playerr: pl, picUser:picUser, upPrice: newPrice});
    }
}
