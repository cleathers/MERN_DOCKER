var express = require('express');
var router = express.Router();
var Todo = require(`${process.cwd()}/models/Todos.js`);

/* GET users listing. */
router.get('/', function(req, res, next) {
	Todo.find()
		.then(function(todos) {
			todos = todos || [];

			var sanitized = todos.reduce(function(list, todo) {
				var clean = {
					title: todo.title,
					completed: todo.completed
				};

				list.push(clean);
				return list;
			}, []);

			res.json({todos: sanitized});
		})
		.catch(function(err) {
			res.status(500).json({error: true});
		});
});

router.post('/', function(req, res) {
	var title = req.param('title', false);

	if (!title) {
			return res.status(500).json({error: true});
	}

	var newTodo = new Todo({
		title: title
	});

	newTodo.save()
		.then(function(todo) {
			res.json({success: true});
		})
		.catch(function(err) {
			res.status(500).json({error: true});
		});
});

module.exports = router;
