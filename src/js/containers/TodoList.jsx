import React from 'react';
import axios from 'axios';
import ListItem from '../components/ListItem.jsx'
import { Row, Col, ControlLabel, Form, Button, InputGroup, FormControl, FormGroup, ListGroup } from 'react-bootstrap'

export default class TodoList extends React.Component {
	constructor(props) {
		super(props);

		this.addTodo = this.addTodo.bind(this);
		this.deleteTodo = this.deleteTodo.bind(this);
		this.fetchTodos = this.fetchTodos.bind(this);
		this.updateTodo = this.updateTodo.bind(this);
		this.controlNewTodo = this.controlNewTodo.bind(this);

		this.state = {
			todos: [],
			newTodoValue: ''
		};
	}

	componentDidMount() {
		// Go get our todos
		this.fetchTodos();
	}

	controlNewTodo(event) {
		this.setState({
			newTodoValue: event.target.value
		});
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

	updateTodo(todoId, completed) {
		axios.put(`/todos/${todoId}`, {completed})
			.then((response) => {
				var todos = this.state.todos;
				todos = todos.map((todo) => {
					if (todo.id === todoId) {
						todo.completed = completed;
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

		var title = this.state.newTodoValue;
		var todo = { title };

		axios.post('/todos', todo)
			.then((response) => {
				var todos = this.state.todos;

				todo.id = (response.data || {}).id;

				todos.push(todo);

				this.setState({
					todos,
					newTodoValue: ''
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
		return <div>
			<Row id='todo-list'>
				<Col xs={3}>
					<Form onSubmit={this.addTodo}>
						<FormGroup>
							<InputGroup>
								<InputGroup.Button>
									<Button type="submit" bsStyle="primary">Submit</Button>
								</InputGroup.Button>
								<FormControl ref="newTodo"
									type="text"
									onChange={this.controlNewTodo}
									value={this.state.newTodoValue}
									placeholder="New Todo" />
							</InputGroup>
						</FormGroup>
					</Form>
				</Col>
				<Col xs={6}>
					<ListGroup>
						{this.buildTodos()}
					</ListGroup>
				</Col>
			</Row>
		</div>
	}
}
