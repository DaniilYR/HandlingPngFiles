$(document).ready(()=> {
    $( ".column" ).sortable({
        connectWith: ".column",
        handle: ".portlet-header",
        cancel: ".portlet-toggle",
        placeholder: "portlet-placeholder ui-corner-all"
    });

    $( ".portlet" )
        .addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
        .find( ".portlet-header" )
        .addClass( "ui-widget-header ui-corner-all" )
        .prepend( "<span class='ui-icon ui-icon-circle-triangle-s portlet-toggle'></span>");

    $( ".portlet-toggle" ).on( "click", function() {
        var icon = $(this);
        icon.toggleClass( "ui-icon-circle-triangle-s ui-icon-circle-triangle-n" );
        icon.closest( ".portlet" ).find( ".portlet-content" ).toggle();
    });

    $('#progressbar').progressbar({value: 0});
    let flag = true;
    function progress(){
        $("#progressbar > div").css({ 'background': 'Green' });
        var val = $('#progressbar').progressbar("value") || 0;
        $('#progressbar').progressbar("value", val+30);
        if(val < 95)
            setTimeout(progress, 1000);
        else {
            $('#l1').html("Аукцион: ");
            $('.BUpPrice').css({'pointer-events' : 'visible'});
            $('#progressbar').progressbar("value", 0);
            setTimeout(progressTwo, 1000);
        }
    }



    $('.BUpPrice').css({'pointer-events' : 'none'});
    $('.disable').css({'pointer-events' : 'none'});

    setTimeout(progress, 1000);

    function progressTwo(){

        $("#progressbar > div").css({ 'background': 'Green' });
        let val = $('#progressbar').progressbar("value") || 0;
        $('#progressbar').progressbar("value", val+2);
        if(val < 100) {
            setTimeout(progressTwo, 1000);
        }
        else {
            $('.disable').css({'pointer-events': 'initial'});
            alert("Аукцион окончен, спасибо за участие");
            socket.emit('AfterAuction');

        }
    }

});
