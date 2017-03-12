import React from 'react'
import ReactDOM from 'react-dom'
import TodoList from './containers/TodoList.jsx'

let entry = <div className='container'>
	<TodoList />
</div>;

ReactDOM.render(
	entry,
	document.getElementById('app')
);

