var express = require('express');
var stylus = require('stylus');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// process.env.NODE_ENV permet de savoir si on en Dev/recette/production/etc...
// On met comme valeur par défaut Dev si la propriété n'est pas définie
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'developpement';

var app = express();

function compile(str, path) {
    return stylus(str).set('filename', path);
}

app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(stylus.middleware ({
    src: __dirname + '/public',
    compile: compile
}));

app.use(express.static(__dirname + '/public'));

//DATABASE

if (env === 'developpement') {
    mongoose.connect('mongodb://localhost/multivision');
}
else {
    mongoose.connect('mongodb://jeames:multivision@ds119568.mlab.com:19568/multivision');
}


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error...'));
db.once('open', function callback() {
    console.log('multivision db opened');
});

var messageSchema = mongoose.Schema({message: String});
var Message = mongoose.model('Message', messageSchema);

var mongoMessage;
Message.findOne().exec(function (err, messageDoc) {
    mongoMessage = messageDoc.message;
    console.log(mongoMessage);
});

// PARTIALS

app.get('/partials/:partialPath', function(req, res) {
    res.render('partials/' + req.params.partialPath);
});

app.get('*', function(req,res) {
    res.render('index', {
        mongoMessage: mongoMessage
    });
});

var port = process.env.PORT || 3030;
app.listen(port);
console.log('Listening on port ' + port + '...');