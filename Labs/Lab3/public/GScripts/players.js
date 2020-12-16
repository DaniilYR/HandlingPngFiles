$(document).ready(() => {
  $('#save').click(() => {
    sendAjax('/addPl');
  });
});

function sendAjax(url) {
  var formData = {
    name: $('#newParticipantName').val(),
    card: $('#newParticipantCard').val(),
    money: $('#newParticipantMoney').val(),
    auction: ""
  };
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
  $("#mbody tr:last").after('<tr>' + '<td>' + '<a href=/player/' + data.id + '>' + $('#newParticipantName').val() + '<td>' + $('#newParticipantCard').val() + '<td>' + $('#newParticipantMoney').val() + '</tr>');
}

$('#_save').click();