import React from 'react';
import axios from 'axios';
import ListItem from '../components/ListItem.jsx'
import { ListGroup } from 'react-bootstrap'

export default class TodoList extends React.Component {
	constructor(props) {
		super(props);

		this.addTodo = this.addTodo.bind(this);
		this.deleteTodo = this.deleteTodo.bind(this);
		this.fetchTodos = this.fetchTodos.bind(this);
		this.updateTodo = this.updateTodo.bind(this);

		this.state = {
			todos: []
		};

		// Go get our todos
		this.fetchTodos();
	}

	fetchTodos() {
		axios.get('/todos')
			.then((response) => {
				var todos = (response.data || {}).todos || [];

				this.setState({
					todos
				});
			});
	}

	deleteTodo(todoId) {
		axios.delete(`/todos/${todoId}`)
			.then((response) => {
				var todos = this.state.todos;
				todos = todos.filter((todo) => {
					return todo.id != todoId;
				});

				this.setState({
					todos
				});
			});
	}

	updateTodo(todoId) {
		axios.put(`/todos/${todoId}`, {completed: true})
			.then((response) => {
				var todos = this.state.todos;
				todos = todos.map((todo) => {
					if (todo.id === todoId) {
						todo.completed = true;
					}

					return todo;
				});

				this.setState({
					todos
				});
			});

	}

	addTodo(event) {
		event.preventDefault();

		var title = this.refs.newTodo.value;
		var todo = { title };

		axios.post('/todos', todo)
			.then((response) => {
				var todos = this.state.todos;

				todo.id = (response.data || {}).id;

				todos.push(todo);

				this.refs.newTodo.value = '';
				this.setState({
					todos
				});
			});
	}

	buildTodos() {
		return this.state.todos.map((todo, idx) => {
			return <ListItem title={todo.title}
				key={todo.id}
				id={todo.id}
				completed={todo.completed}
				updateFunc={this.updateTodo}
				deleteFunc={this.deleteTodo}
			/>;
		});
	}

	render() {
		return <div id='todo-list'>
			<ListGroup>
				{this.buildTodos()}
			</ListGroup>

			<form onSubmit={this.addTodo}>
				<input type="text" ref="newTodo" />
				<button  type="submit">Submit</button>
			</form>
		</div>;
	}
}
