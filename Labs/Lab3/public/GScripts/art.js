var id = document.location.href.split('/painting/')[1].split('#')[0];
$(document).ready(() => {
  // изменить инлрмацию о картине
  $('#__save').click(() => {
    var formData = {
      id: id,
      name: $('#changeName').val(),
      author: $('#changeAuthor').val(),
      date: $('#changeYear').val(),
      description: $('#changeDes').val(),
      inAuction: null,
      beginning_price: $('#changePrice_').val(),
      min_step: $('#changeMin_').val(),
      max_step: $('#changeMax_').val()
    };
    sendAjax('/changePic', formData);
    $('#td1').text($('#changeName').val());
    $('#td2').text($('#changeAuthor').val());
    $('#td3').text($('#changeYear').val());

    if ($('#changePrice_').val() !== "") {
      $('#td5').text('Да');
      $('#td6').text($('#changePrice_').val());
      $('#td7').text($('#changeMin_').val());
      $('#td8').text($('#changeMax_').val());
    }
  }); // удалить картину из аукциона

  $('#removePicButton').click(() => {
    var data = {
      id: id
    };
    sendAjax('/removeFromAuction', data);
    $('#tr5').remove();
    $('#tr6').remove();
    $('#tr7').remove();
    $('#tr8').remove();
    $('#addAuction').text('Поставить в аукцион');
    $('#addAuction').attr({
      form: 'addPicToAuc',
      href: '#modalAddPic'
    });
  }); // удалить картину

  $('#modalDelete').click(() => {
    var data = {
      id: id
    };
    sendAjax('/delPic', data);
    setTimeout(function () {
      document.location.href = '/';
    }, 400);
  }); // добавить картину в аукцион

  $('#save').click(() => {
    var data = {
      id: id,
      inAuction: true,
      beginning_price: $('#changePrice').val(),
      min_step: $('#changeMin').val(),
      max_step: $('#changeMax').val()
    };
    sendAjax('/addInAuction', data);
    $('#addAuction').text('Удалить из аукциона');
    $('#addAuction').attr({
      form: 'removePicFromAuc',
      href: '#modalRemovePic'
    });
    $("#tab tr:last").after('<tr id="tr5">' + '<td>' + 'В аукционе?' + '<td id="td5">' + 'Да' + '</tr>' + '<tr id="tr6">' + '<td>' + 'Начальная цена' + '<td id="td6">' + $('#changePrice').val() + '</tr>' + '<tr id="tr7">' + '<td>' + 'Мин. шаг' + '<td id="td7">' + $('#changeMin').val() + '</tr>' + '<tr id="tr8">' + '<td>' + 'Макс. шаг' + '<td id="td8">' + $('#changeMax').val() + '</tr>');
  });
});

function sendAjax(url, data) {
  $.ajax({
    url: url,
    type: "GET",
    data: data,
    dataType: "json",
    contentType: "application/json",
    async: false,
    error: function (e) {
      console.log(data);
      console.log("ERROR: ", e.status);
    },
    success: foo
  });
}

function foo() {
  console.log("Success");
}