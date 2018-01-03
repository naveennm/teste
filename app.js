 var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

    // configuration =================

    var uri = 'mongodb://localhost:27017/test';

var options = {
  "server" : {
    "socketOptions" : {
      "keepAlive" : 300000,
      "connectTimeoutMS" : 30000
    }
  },
  "replset" : {
    "socketOptions" : {
      "keepAlive" : 300000,
      "connectTimeoutMS" : 30000
    }
  }
}

mongoose.connect(uri, function(err) {
    if(err){
        console.log(err);
    }
    console.log("d");
});

   // mongoose.connect('mongodb://mconnect:mconnect123@ds239117.mlab.com:39117/test123');       // connect to mongoDB database on modulus.io

    app.use(express.static(__dirname + '/public'));   
    app.use(express.static(__dirname + '/views'));              // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());


var Todo = mongoose.model('Todo', {
  text : String
});


app.use(bodyParser.urlencoded({
    extended: false
}))

// app.get('/', function (req, res) {
//    res.sendFile(__dirname + '/views/index.html');
// })

  app.get('/', function(req, res) {
        res.sendfile('views/main.html'); // load the single view file (angular will handle the page changes on the front-end)
    });


  app.get('/api/todos', function(req, res) {

        // use mongoose to get all todos in the database
        Todo.find(function(err, todos) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(todos); // return all todos in JSON format
        });
    });

    // create todo and send back all todos after creation
    // app.post('/api/todos', function(req, res) {
    //     console.log(req.body.text);
    //     // create a todo, information comes from AJAX request from Angular
    //     Todo.create({
    //         text : req.body.text
    //     }, function(err, todo) {
    //         if (err)
    //             res.send(err);

    //         // get and return all the todos after you create another
    //         return res.json('No data found');
    //     });

    // });
  app.post('/api/todos', function(req, res) {

        // create a todo, information comes from AJAX request from Angular
        Todo.create({
            text : req.body.text,
            done : false
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });

    });

    // delete a todo
    app.delete('/api/todos/:todo_id', function(req, res) {
        Todo.remove({
            _id : req.params.todo_id
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });
    });



app.put('/api/todos/:todo_id', function(req, res) {

        // create a todo, information comes from AJAX request from Angular
      // Todo.updateById(req.body.id, req.body.text, function(err, result) {
      Todo.findById(req.params.todo_id, function (err, result){
        if (err) {
            return res.json('No data found');
        } 



var newvalues = { text : req.body.text};
console.log(req.params.todo_id);
console.log(req.body.text);
  Todo.updateOne({_id:req.params.todo_id}, {$set : newvalues}, function(err, result) {


      //  Todo.updateById(req.params.todo_id, { text: req.body.text }, function(err, updatedTodo) {
          if (err) {
            return res.json(err);
          } 
          Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });
      });
    //});
    });



    var port = process.env.port || 8080;

    app.listen(port);