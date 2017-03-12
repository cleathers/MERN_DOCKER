import React from 'react';
import { Row, Col, Button, ButtonToolbar, ButtonGroup, ListGroupItem, Glyphicon } from 'react-bootstrap'

export default class ListItem extends React.Component {
	constructor(props) {
		super(props);

		this.toggleButtonIcon = this.toggleButtonIcon.bind(this);
		this.toggleStatus = this.toggleStatus.bind(this);
		this.removeTodo = this.removeTodo.bind(this);
	}

	toggleButtonIcon() {
		let unmark = 'ok';
		let completed = 'minus';

		return this.props.completed ? completed : unmark;
	}

	toggleStatus(event) {
		event.preventDefault();

		this.props.updateFunc(this.props.id, !this.props.completed);
	}

	removeTodo(event) {
		event.preventDefault();

		this.props.deleteFunc(this.props.id);
	}

	render() {
		return <ListGroupItem data-id={this.props.id} className={`clearfix list-item${this.props.completed ? ' completed' : ''}`} >
			<Row>
				<Col xs={6} >
					<p>{this.props.title}</p>
				</Col>
				<Col xs={6}>
					<ButtonToolbar className="pull-right list-buttons">
						<ButtonGroup>
							<Button bsStyle="success" onClick={this.toggleStatus}>
								<Glyphicon glyph={this.toggleButtonIcon()} />
							</Button>
							<Button bsStyle="danger" onClick={this.removeTodo}>
								<Glyphicon glyph="remove" />
							</Button>
						</ButtonGroup>
					</ButtonToolbar>
				</Col>
			</Row>
		</ListGroupItem>;
	}
}
