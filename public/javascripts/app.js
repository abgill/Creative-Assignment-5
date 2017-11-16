var pts = [];
var canvas;
var context;

function loadImages(sources, callback) {
    var images = {};
    var loadedImages = 0;
    var numImages = 0;
    // get num of sources
    for(var src in sources) {
        numImages++;
    }
    for(var src in sources) {
        images[src] = new Image();
        images[src].onload = function() {
            if(++loadedImages >= numImages) {
                callback(images);
            }
        };
        images[src].src = sources[src];
    }
}


var sources = {
    map: 'images/map.gif',
    marker: 'images/marker.png'
};


$(document).ready(function () {


    canvas = document.getElementById('mapCanvas');
    context = canvas.getContext('2d');

    $.ajax({
        url: "getPts",
        success: function (result) {
            pts = result;
            drawMap();
            updatePinList();
        }
    });

    $("#mapCanvas").click(function (e) {
        var Xcord = e.pageX - $(this).offset().left;
        var Ycord = e.pageY - $(this).offset().top;

        var name = prompt("Enter Your name");

        if (name != null || name != "") {
            $.ajax({
                type: "POST",
                url: "/setpt",
                data: {
                    x: Math.floor(Xcord - 12),
                    y: Math.floor(Ycord - 25),
                    name: name
                },
                success: function (result) {
                    pts = result;
                    drawMap();
                    updatePinList();
                }
            });
        }


    })
});

function drawMap() {
    loadImages(sources, function(images) {
        context.drawImage(images.map, 0,0);

        for(var i =0; i<pts.length; i++){
            context.drawImage(images.marker,pts[i].x,pts[i].y,25,25);
        }

    });
}

function updatePinList() {
    var lst ="<ul>";

    for(var i =0; i < pts.length; i++){
        lst += '<li>'
        lst += pts[i].name + ": ";
        lst += pts[i].x + ", " + pts[i].y;
        lst += '<button x=\'' + pts[i].x +'\'' + ' y=\'' + pts[i].y + '\' onclick="delPin(this.getAttribute(\'x\'),this.getAttribute(\'y\'))"' +'class="btn-danger">';
        //lst += pts[i].x + ", " + pts[i].y + "</button>"
        lst += "Delete</button><hr></li>";
    }

    lst += '</ul>';

    $("#pinList").html(lst);

}

function delPin(x,y) {

    $.ajax({
        type: "POST",
        url: "/delpt",
        data: {
            x: Math.floor(x),
            y: Math.floor(y)
        },
        success: function (result) {
            pts = result;
            drawMap();
            updatePinList();
        }
    });

}