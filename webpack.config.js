module.exports = {
	entry: './src/js/app.jsx',
	output: {
		filename: 'public/js/bundle.js'
	},
	module: {
		loaders: [{
			test: /\.jsx?$/,
			loader: 'babel-loader',
			query: {
				presets: ['react', 'latest']
			}
		}]
	}
};
