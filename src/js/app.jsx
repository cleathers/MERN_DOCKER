import React from 'react'
import ReactDOM from 'react-dom'
import TodoList from './containers/TodoList.jsx'

ReactDOM.render(
	(<div className='container'>
		<TodoList />
	</div>),
	document.getElementById('app')
);

