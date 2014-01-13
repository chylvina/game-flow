$(document).ready(function () {
    $('#box').html('jQuery test');

    $.ajax({
        url: "json.json"
    })
    .done(function (data) {
            $( '#ajax1' ).html(JSON.stringify(data));
        })
        .error(function() {
            $( '#ajax1' ).html('local ajax failed.');
        });

    $.ajax({
        url: "http://google.com"
    })
        .done(function (data) {
            $( '#ajax2' ).html(JSON.stringify(data));
        })
        .error(function() {
            $( '#ajax2' ).html('load http://google.com failed.');
        });
});