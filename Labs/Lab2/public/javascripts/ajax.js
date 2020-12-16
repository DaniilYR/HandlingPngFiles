function sendRequest(r_method, r_path, r_args, r_handler){
    var xhr = new XMLHttpRequest();

    if(!xhr){
        alert("ERROR");
        return;
    }

    xhr.onreadystatechange = function (){
        if(xhr.readyState == 4){
            r_handler(xhr);
        }
    };

    xhr.open(r_method, r_path, true);
    xhr.send(null);

}

function inLib(button){
    var Handler = function (xhr){
        let result = JSON.parse(xhr.responseText);
        for(let id of result) {
            //document.getElementById(id).style.visibility = "hidden";
            document.getElementById(id).style.display='none';
        }
    }
    sendRequest("GET", `/filter/${button.id}`, "", Handler);
}

function allBooks(button){
    var Handler = function (xhr){
        let result = JSON.parse(xhr.responseText);
        for(let id of result) {
            //document.getElementById(id).style.visibility = "visible";
            document.getElementById(id).closest('tr').style.display='table-row';
        }
    }
    sendRequest("GET", `/filter/${button.id}`, "", Handler);
}

function dateReturn(button){
    var Handler = function (xhr){
        let result = JSON.parse(xhr.responseText);
        for(let id of result) {
            //document.getElementById(id).style.visibility = "hidden";
            document.getElementById(id).style.display='none';
        }
    }
    sendRequest("GET", `/filter/${button.id}`, "", Handler);
}