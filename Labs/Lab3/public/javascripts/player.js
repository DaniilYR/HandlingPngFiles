var id = document.location.href.split('/player/')[1].split('#')[0];

$(document).ready(()=> {
    // Удалить игрока
    $('#modalDelete').click(() => {
        var data = { id: id};
        sendAjax('/delPl', data);
        setTimeout(function() {document.location.href='/players';}, 400);
    });
    // Добавить картину вжелания
    $('#___save').click(()=>{
        var data = {id: id, picture: $('#addNewPic').val(), maxPrice: $('#addPartMoney').val()}
        sendAjax('/addPicToPl', data);
        $("#mbody tr:last").after('<tr>'+'<td>' + $('#addNewPic').val() + '<td>'+ $('#addPartMoney').val() + '</tr>');
        setTimeout(function() {document.location.href='/player/'+id;});
    })
    //изменить счет игрока
    $('#__save').click(()=>{
        var data = {id:id, money:  $('#changePartMoney').val()}
        sendAjax('/changeMoney', data);
        $("#money").text($('#changePartMoney').val())
    })
});

function sendAjax(url, data){
    $.ajax({
        url: url,
        type: "GET",
        data: data,
        dataType: "json",
        contentType: "application/json",
        async: false,
        error: function (e){
            console.log(data);
            console.log("ERROR: ", e.status);
        },
        success: foo
    });
}

function foo(){
    console.log("Success");
}

