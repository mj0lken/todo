import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  state = {
    currentTodo: "",
    username: "",
    todos: [],
    user: null,
    updating: "",
    updateTodo: ""
  };

  componentDidMount() {
    this.fetchTodos();
  }

  updatingTodo = item => {
    this.setState({ updating: item._id });
  };

  handleChange = e => {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    if (this.state.updating) {
      this.updateTodo(this.state.updateTodo);
      this.setState({
        updateTodo: "",
        updating: ""
      });
    } else if (this.state.currentTodo) {
      this.postTodo(this.state.currentTodo);
      this.setState({
        currentTodo: "",
        username: ""
      });
    }
  };

  fetchTodos = () => {
    fetch(`http://localhost:4000/todos`)
      .then(response => response.json())
      .then(todos => {
        this.setState({ todos });
        console.log(todos);
      });
  };

  postTodo = postedTodo => {
    fetch(`http://localhost:4000/todos`, {
      method: `POST`,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title: postedTodo })
    })
      .then(response => response.json())
      .then(newTodo => {
        const updatedTodo = [...this.state.todos];
        updatedTodo.push(newTodo);
        this.setState({ todos: updatedTodo });
      });
  };

  deleteTodo = id => {
    fetch(`http://localhost:4000/todos/${id}`, {
      method: `DELETE`
    })
      .then(response => response.json())
      .then(deletedTodo => {
        const filteredTodos = this.state.todos.filter(todo => {
          return todo._id !== deletedTodo._id;
        });
        this.setState({ todos: filteredTodos });
      });
  };

  updateTodo = item => {
    fetch(`http://localhost:4000/todos/${this.state.updating}`, {
      method: `PATCH`,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title: item })
    })
      .then(response => response.json())
      .then(newTodo => {
        const updatedTodos = this.state.todos.filter(todo => {
          if (todo._id === newTodo._id) {
            return newTodo;
          } else {
            return todo;
          }
        });
        this.setState({ todos: updatedTodos });
      });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Time 2 do</h1>
        </header>
        <main className="main-chat">
          <section className="add-todo">
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                name="currentTodo"
                placeholder="What should be done?"
                onChange={this.handleChange}
                value={this.state.currentTodo}
              />
              <button>Add 2do</button>
            </form>
            <form onSubmit={this.handleSubmit}>
              {this.state.updating && (
                <div className="upgrade-form">
                  <input
                    type="text"
                    name="updateTodo"
                    placeholder="Change your goal"
                    onChange={this.handleChange}
                    value={this.state.updateTodo}
                  />
                  <button className="btn-upgrade">Update</button>
                  <button
                    className="btn-upgrade red"
                    onClick={() => this.setState({ updating: "" })}
                  >
                    Ignore
                  </button>
                </div>
              )}
            </form>
            {/* <button className="btn-logout" onClick={this.logout}>Logout</button> */}
          </section>
          <section className="display-todos">
            <div className="wrapper todos-boxes">
              <ul>
                {this.state.todos.map(item => {
                  return (
                    <li key={item.id}>
                      <h3 className="hoverable" onClick={() => this.deleteTodo(item._id)}>
                        {" "}
                        <span className="hover">DELETE</span>{" "}
                        <span className="normal">2DO</span>{" "}
                      </h3>
                      <p onClick={() => this.updatingTodo(item)}>
                        {" "}
                        {item.title}{" "}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        </main>
      </div>
    );
  }
}

export default App;
