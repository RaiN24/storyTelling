function reason_select_fun(i) {
    //var mytext = $("#mywords").val();
    //var mytext = document.getElementById("mywords");
    //mytext = document.getElementById("reason-select");
    //mytext.innerHTML = "lect Me <i class='fa fa-caret-down'></i>";
    //mytext = document.getElementById("reason-select");
    if (i == 0) {
        document.getElementById("reason-select").innerHTML = "Trump-Up <i class='fa fa-caret-down'></i>";
        document.getElementById("reason-select").setAttribute("value", "Trump-Up");
    } else if (i == 1) {
        document.getElementById("reason-select").innerHTML = "Trump-Down <i class='fa fa-caret-down'></i>";
        document.getElementById("reason-select").setAttribute("value", "Trump-Down");
    } else if (i == 2) {
        document.getElementById("reason-select").innerHTML = "Clinton-Up <i class='fa fa-caret-down'></i>";
        document.getElementById("reason-select").setAttribute("value", "Clinton-Up");
    } else if (i == 3) {
        document.getElementById("reason-select").innerHTML = "Clinton-Down <i class='fa fa-caret-down'></i>";
        document.getElementById("reason-select").setAttribute("value", "Clinton-Down");
    }
}

function is_noun_fun(i) {
    if (i == 0) {
        document.getElementById("noun-select").innerHTML = "All words <i class='fa fa-caret-down'></i>";
        document.getElementById("noun-select").setAttribute("value", "all");
    } else if (i == 1) {
        document.getElementById("noun-select").innerHTML = "Noun words <i class='fa fa-caret-down'></i>";
        document.getElementById("noun-select").setAttribute("value", "noun");
    }
    draw_wordle();
}

function delete_click() {
    $("#" + this.innerText).remove();
    //alert(this.innerText);
    var ul = document.getElementById("delete-words");
    var deleteText = "";
    var tmpText = "";
    for (var i = 0; i < ul.children.length; i++) {
        //console.log(ul.children[i].innerText);
        //tmpText = String(ul.children[i].innerText);
        //deleteText.concat(ul.children[i].innerText);
        deleteText = deleteText + ul.children[i].innerText;
        deleteText = deleteText.substring(0, deleteText.length - 1);
        deleteText = deleteText + " ";
        //alert(deleteText);
    }
    //deleteText.replace(" ", "");
    //alert(deleteText);
    document.getElementById("delete-words").setAttribute("value", deleteText);
    go_fun();
}


function go_fun() {
    draw_wordle();
    draw_relation();
    drawReason();
}
