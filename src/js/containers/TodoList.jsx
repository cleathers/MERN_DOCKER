import React from 'react';
import axios from 'axios';
import ListItem from '../components/ListItem.jsx'

export default class TodoList extends React.Component {
	constructor(props) {
		super(props);

		this.fetchTodos = this.fetchTodos.bind(this);
		this.addTodo = this.addTodo.bind(this);

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

	addTodo(event) {
		event.preventDefault();

		var title = this.refs.newTodo.value;
		var todo = { title };

		axios.post('/todos', todo)
			.then((response) => {
				var todos = this.state.todos;

				todos.push(todo);

				this.refs.newTodo.value = '';
				this.setState({
					todos
				});
			});
	}

	buildTodos() {
		return this.state.todos.map((todo, idx) => {
				return <ListItem title={todo.title} key={idx}/>;
		});
	}

	render() {
		return <div id='todo-list'>
			<ul>
				{this.buildTodos()}
				<ListItem title="blood bathing" />
				<ListItem title="dreadmill training" />
			</ul>

			<form onSubmit={this.addTodo}>
				<input type="text" ref="newTodo" />
				<button  type="submit">Submit</button>
			</form>
		</div>;
	}
}
