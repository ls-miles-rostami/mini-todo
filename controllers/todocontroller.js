var bodyParser = require('body-parser');
var mongoose = require('mongoose')


//connet to databse // Get information from mlab account and create a user for the specific database
mongoose.connect('mongodb://<dbuser>:<dbpassword>@ds159328.mlab.com:59328/mini-todo')

//create a schema - blueprint
var todoSchema = new mongoose.Schema({
  item: String
})

// create a mondel and pass it the schema
var Todo = mongoose.model('Todo',todoSchema)




// var data = [{item:'get milk'},{item:'walk dog'}, {item:'kick some coding ass'}]
var urlencodedParser = bodyParser.urlencoded({ extended: false })
module.exports = function(app){

  app.get('/todo', function(req,res){
    // get data from mongodb and pass it to the view
    Todo.find({},function(err,data){
      if (err) throw err;
      res.render('todo', {todos: data});
    })// we passed an empty object because we want all the items in the model/collection

  });

  app.post('/todo', urlencodedParser , function(req,res){
    // get data from the view and add it to mongodb
    var newTodo = Todo(req.body).save(function(err,data){
      if (err) throw err;
      res.json(data)
    });
  });

  app.delete('/todo/:item', function(req,res){
    // delete the request item from mongodb
    Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove(function(err,data){
      if (err) throw err
      res.json(data)
    });
  });

};
