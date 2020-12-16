setTimeout(timer, 10);

function timer(){
    const d = new Date();
    const s = $('#start').html() *1;
    const r = (s - d.getMinutes())*60 - d.getSeconds();
    if(r > 0)
        $('#timer').html(r);
    setTimeout(timer, 1000);
}
