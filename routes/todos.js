var express = require('express');
var router = express.Router();
var Todo = require(`${process.cwd()}/models/Todos.js`);

/* GET todos listing. */
router.get('/', function(req, res, next) {
	Todo.find().exec()
		.then(function(todos) {
			todos = todos || [];

			var sanitized = todos.reduce(function(list, todo) {
				var clean = {
					id: todo.id,
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

/* POST create new todo */
router.post('/', function(req, res) {
	var title = req.body.title || false;

	if (!title) {
			return res.status(500).json({error: true});
	}

	var newTodo = new Todo({
		title: title
	});

	newTodo.save()
		.then(function(todo) {
			res.json({id: todo.id});
		})
		.catch(function(err) {
			res.status(500).json({error: true});
		});
});

/* PUT update todo completed status */
router.put('/:id', function(req, res) {
	var id = req.params.id || false;
	var completed = req.body.completed;

	if (!id || completed === undefined) {
		return res.status(500).json({error: true});
	}

	Todo.findOneAndUpdate({_id: id}, {completed: completed}).exec()
		.then(function(a1, a2) {
			res.json({completed: completed});
		})
		.catch(function(err) {
			res.status(500).json({error: true});
		});;
});

/* DELETE delete todo by id */
router.delete('/:id', function(req, res) {
	var id = req.params.id || false;

	if (!id) {
		return res.status(500).json({error: true});
	}

	Todo.remove({ _id: id }).exec()
		.then(function(a1, a2) {
			res.json({deleted: true});
		})
		.catch(function(err) {
			res.status(500).json({error: true});
		});;
});

module.exports = router;
