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

});