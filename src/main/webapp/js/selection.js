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

function go_fun() {
    draw_wordle();
    draw_relation();
    drawReason();
}