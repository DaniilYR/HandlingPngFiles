$(document).ready(()=> {
    $('#save').click(()=> {
        sendAjax('/changeSet')
    })
});

function sendAjax(url){

    var formData = {
        dateBegin:  $('#dateBegin').val(),
        timeBegin:  $('#timeBegin').val(),
        timeout:  $('#timeout').val(),
        interval:  $('#interval').val(),
        pause:  $('#pause').val(),
        picName:  $('#addNewPic').val(),
    };

    $.ajax({
        url:url,
        type: "GET",
        data: formData,
        dataType: "json",
        contentType: "application/json",
        async: false,
        error: function (e){
            console.log(formData);
            console.log("ERROR: ", e.status);
        },
        success: foo
    });
}

function foo(data){
    $('#td1').text($('#dateBegin').val());
    $('#td2').text($('#timeBegin').val());
    $('#td3').text($('#timeout').val());
    $('#td4').text($('#interval').val());
    $('#td5').text($('#pause').val());
    $('#td6').text($('#addNewPic').val());
}