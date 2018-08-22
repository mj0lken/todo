const express = require("express");
const mongoose = require("mongoose");
const cors = require(`cors`);

const app = express();
const URL = `mongodb://USER:PASSWORD@ds139341.mlab.com:39341/mongo-trial`
app.use(cors());

mongoose.connect(
  URL,
  { useNewUrlParser: true }
);

app.use(express.static("public"));

app.use(express.json()); // So we can handle JSON-data from the user
app.use(express.urlencoded({ extended: true })); // So we can handle form-data from the user

// ! Mongoose Schema for todos
const Todo = mongoose.model("Todo", {
  title: {
    type: String,
    require: true
  },
  completed: {
    type: Boolean,
    defult: false
  }
});

// ! BELOW IS THE RESTish API

app.get("/", function(request, response) {
  response.sendFile("index.html");
});

app.get(`/todos`, function(request, response) {
  Todo.find({}).then(documents => {
    response.json(documents);
  });
});

app.post(`/todos`, function(request, response) {
  const newTodo = new Todo({ title: request.body.title, completed: false });

  newTodo.save().then(document => {
    response.json(document);
  });
});

app.get("/todos/:id", function(request, response) {

  Todo.find(request.params.id).then(documents => {
    response.json(documents);
  });
});

app.delete("/todos/:id", (request, response) => {
  Todo.findByIdAndRemove(request.params.id)
  .then(document => {
    response.json(document);
  });
});

app.patch("/todos/:id", (request, response) => {
  Todo.findByIdAndUpdate(request.params.id, {
    title: request.body.title
  })
  .then(document => {
    response.json(document);
  });
});

app.listen(4000);
