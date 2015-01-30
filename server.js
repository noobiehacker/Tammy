// server.js

    // set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
    var database = require('./config/database');
    var Report     = require('./app/models/report');

    // configuration =================

    mongoose.connect(database.url);     // connect to mongoDB

    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());
    
    //==========routes
    var router = express.Router();              // get an instance of the express Router
    app.use('/api', router);

    // middleware to use for all requests
    router.use(function(req, res, next) {
        console.log('Something is happening.');
        next(); // make sure we go to the next routes and don't stop here
    });
    
    router.get('/', function(req, res) {
        res.json({ message: 'hooray! welcome to our api!' });   
    });

    router.route('/reports')

    .post(function(req, res) {
        
        var report = new Report();      // create a new instance of the Bear model
        report.name = req.body.name  // set the bears name (comes from the request)

        // save the bear and check for errors
        report.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'report created!' });
        });
        
    })

    .get(function(req, res) {
        Report.find(function(err, reports) {
            if (err)
                res.send(err);

            res.json(reports);
        });
    });

    // load the routes
    require('./app/routes')(app);
  
    // listen (start app with node server.js) ======================================
    app.listen(8080);
    console.log("App listening on port 8080");