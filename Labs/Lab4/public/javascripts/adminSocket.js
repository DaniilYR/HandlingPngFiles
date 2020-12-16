var soc = io.connect('http://localhost:3000');

soc.on('connect', ()=>{
    soc.emit('toAdmin', {countD: 'fromAdmin2310'});
});

soc.on('admin2310', (data)=>{

    var count = 0;

    for(let j = 0; j < data.pics.length; j++){
        if(data.pics[j].inAuction === true) {
            count++;
            $(`#AdminPrice${data.pics[j].id}`).html(`Цена: ${data.pics[j].current_price}`);
            $(`#AdminWidower${data.pics[j].id}`).html(`Владелец: ${data.pics[j].owner}`);
        }
    }

    for(let i = 0; i < data.players.length; i++){
        $(`#cash${data.players[i].id}`).html(`Счет: ${data.players[i].money}`);
    }

    if(data.now !== '') {
        $('#new').append(data.now);
        count = '';
    }

    soc.emit('toAdmin', {countD: count});
});
