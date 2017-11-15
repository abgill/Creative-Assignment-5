var express = require('express');
var router = express.Router();

var mongoose = require('mongoose'); //Adds mongoose as a usable dependency

mongoose.connect('mongodb://localhost/worldmap', { useMongoClient: true });

var PtSchema = mongoose.Schema({ //Defines the Schema for this database
    x: Number,
    y: Number
});

var Pt = mongoose.model('Pt', PtSchema); //Makes an object from that schema as a model

var db = mongoose.connection; //Saves the connection as a variable to use
db.on('error', console.error.bind(console, 'connection error:')); //Checks for connection errors
db.once('open', function() { //Lets us know when we're connected
    console.log('Connected');
});



var pts = [{
    x:15,
    y: 15
},{
    x:200,
    y:200
}];


router.get('/getpts', function (req, res, next) {
    console.log("In get route");
    Pt.find(function(err,ptList) {
        if (err) return console.error(err);
        else {
            console.log(ptList);


        }
        res.json(ptList);
    })
})

router.post('/setpt', function (req, res, next) {
    console.log("in post route")
    var newPt = new Pt(req.body);
    console.log(newPt);

    newPt.save(function(err, post) { //[4]
        if (err) return console.error(err);
        console.log(post);
        res.sendStatus(200);
    });
});

router.delete('/del', function (req, res, next) {
    Pt.find(function (err, ptList) {
        if(err) return console.error(err);
        else {
            for(var i = 0; i < ptList.length; i++){
                ptList[i].remove();
            }
        }

    })
    res.end();
})



module.exports = router;
