$(document).ready(() => {
  $('#save').click(() => {
    var formData = {
      name: $('#newPicName').val(),
      author: $('#newPicAuthor').val(),
      date: $('#newPicDate').val(),
      description: $('#newPicDescription').val(),
      pt: $('#newPicImage').val(),
      inAuction: false,
      beginning_price: "-",
      min_step: "-",
      max_step: "-"
    };
    sendAjax('/addPic', formData);
  });
});

function sendAjax(url, formData) {
  $.ajax({
    url: url,
    type: "GET",
    data: formData,
    dataType: "json",
    contentType: "application/json",
    async: false,
    error: function (e) {
      console.log(formData);
      console.log("ERROR: ", e.status);
    },
    success: foo
  });
}

function foo(data) {
  //alert(JSON.stringify(data));
  $("#mbody tr:last").after('<tr>' + '<td>' + '<a href=/painting/' + data.id + '>' + $('#newPicName').val() + '<td>' + $('#newPicAuthor').val() + '<td>' + $('#newPicDate').val() + '<td>' + "Нет" + '<td>' + "-" + '<td>' + "-" + '<td>' + "-" + '</tr>');
}

$('#_save').click();