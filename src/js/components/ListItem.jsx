import React from 'react';
import { Button, ListGroupItem, Glyphicon } from 'react-bootstrap'

export default class ListItem extends React.Component {
	constructor(props) {
		super(props);

		this.markComplete = this.markComplete.bind(this);
		this.removeTodo = this.removeTodo.bind(this);
	}

	markComplete(event) {
		event.preventDefault();

		this.props.updateFunc(this.props.id);
	}

	removeTodo(event) {
		event.preventDefault();

		this.props.deleteFunc(this.props.id);
	}

	render() {
		return <ListGroupItem data-id={this.props.id} className={'clearfix' + (this.props.completed ? ' completed' : '')}>
			{this.props.title}
			<Button bsStyle="danger" className="pull-right margin-right"  onClick={this.removeTodo}>
				<Glyphicon glyph="remove" className="margin-right" /><span>Remove Todo</span>
			</Button>
			<Button bsStyle="success" className="pull-right" onClick={this.markComplete}>
				<Glyphicon glyph="ok" className="margin-right" /><span>Mark Complete</span>
			</Button>
		</ListGroupItem>;
	}
}
