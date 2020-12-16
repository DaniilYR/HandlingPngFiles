var id = document.location.href.split('/painting/')[1].split('#')[0];

$(document).ready(()=> {
    // изменить инлрмацию о картине
    $('#__save').click(()=>{

        if($('#changeMin_').val()*1 < 0){
            alert("Допускаются только положительные значения\nЗначение заменено на положительное");
            let dop = $('#changeMin_').val()*-1;
            $('#changeMin_').val(dop);
        }

        if($('#changeMin_').val()*1 > $('#changeMax_').val()*1){
            alert("Начение минимального шага должно быть меньше чем значение максимального\nЗначение заменены");
            let dopMin = $('#changeMin_').val();
            let dopMax = $('#changeMax_').val();
            $('#changeMin_').val(dopMax);
            $('#changeMax_').val(dopMin);
        }

        var formData = {
            id: id,
            name: $('#changeName').val(),
            author: $('#changeAuthor').val(),
            date: $('#changeYear').val(),
            description: $('#changeDes').val(),
            inAuction: null,
            beginning_price: $('#changePrice_').val(),
            min_step: $('#changeMin_').val(),
            max_step:$('#changeMax_').val()
        }

        sendAjax('/changePic', formData);

    });
    // удалить картину из аукциона
    $('#removePicButton').click(()=>{
        var data = {id:id}
        sendAjax('/removeFromAuction', data);
    });
    // удалить картину
    $('#modalDelete').click(()=>{
        var data = {id: id};
        sendAjax('/delPic', data);
    });
    // добавить картину в аукцион
    $('#save').click(()=>{

        if($('#changeMin').val()*1 < 0){
            alert("Допускаются только положительные значения\nЗначение заменено на положительное");
            let dop = $('#changeMin').val()*-1;
            $('#changeMin').val(dop);
        }

        if($('#changeMin').val()*1 > $('#changeMax').val()*1){
            alert("Начение минимального шага должно быть меньше чем значение максимального\nЗначение заменены");
            let dopMin = $('#changeMin').val();
            let dopMax = $('#changeMax').val();
            $('#changeMin').val(dopMax);
            $('#changeMax').val(dopMin);
        }

        var formData1 = {
            id: id,
            name: $('#changeName').val(),
            author: $('#changeAuthor').val(),
            date: $('#changeYear').val(),
            description: $('#changeDes').val(),
            inAuction: null,
            beginning_price: $('#changePrice').val(),
            min_step: $('#changeMin').val(),
            max_step:$('#changeMax').val()
        }

        sendAjax('/addInAuction', formData1);
    });
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

function foo(data){
    //alert(data.functionName);
    if(data.functionName === 'changePic'){
        $('#td1').text($('#changeName').val());
        $('#td2').text($('#changeAuthor').val());
        $('#td3').text($('#changeYear').val());
        if(data.inAuction === true) {
            $('#td5').text('Да');
            $('#td6').text($('#changePrice_').val());
            $('#td7').text($('#changeMin_').val());
            $('#td8').text($('#changeMax_').val());
        }
    }
    if(data.functionName === 'delPic'){
        setTimeout(function() {document.location.href='/';}, 400);
    }
    if(data.functionName === 'removeFromAuction'){
        $('#tr5').remove();
        $('#tr6').remove();
        $('#tr7').remove();
        $('#tr8').remove();
        $('#addAuction').text('Поставить в аукцион');
        $('#addAuction').attr({form:'addPicToAuc', href:'#modalAddPic'});
        setTimeout(function() {document.location.href=`/painting/${id}`;}, 200);
    }
    if(data.functionName === 'addInAuction'){
        $('#addAuction').text('Удалить из аукциона');
        $('#addAuction').attr({form:'removePicFromAuc', href:'#modalRemovePic'});
        $("#tab tr:last").after('<tr id="tr5">' + '<td>' + 'В аукционе?'  + '<td id="td5">' + 'Да' + '</tr>' + '<tr id="tr6">'
            + '<td>' + 'Начальная цена' + '<td id="td6">' + $('#changePrice').val() + '</tr>' + '<tr id="tr7">'
            + '<td>' + 'Мин. шаг' + '<td id="td7">' + $('#changeMin').val() + '</tr>' + '<tr id="tr8">'
            + '<td>' + 'Макс. шаг' + '<td id="td8">' + $('#changeMax').val() + '</tr>');
        setTimeout(function() {document.location.href=`/painting/${id}`;}, 200);
    }
}
