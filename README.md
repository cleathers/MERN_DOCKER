# MERN Docker Walkthrough

### Build Image with Node, Express and Webpack installed
1. [Install Docker](https://docs.docker.com/engine/installation/)
1. [Install Kitematic](https://kitematic.com/) Not necessary but provides a nice GUI for containers
1. Build image with the command line utilities needed to create a project
	- `$ docker build -t node-express-webpack .`
	- See [Dockerfile](https://github.com/cleathers/MERN_DOCKER/blob/master/Dockerfile)
		- note the `WORKDIR` command, as that's where we'll be mounting our data volumes. You're welcome to change this value, but make sure that this value matches the second half of the `-v` option you'll see below.
	- [Alpine Linux Node Base Image](https://hub.docker.com/r/mhart/alpine-node-auto/)

### Create Express Skeleton
1. Now that we have our image built, we can use the normal express and webpack utilities like normal. We can link docker to our host system using the `-v` option. The option requires an absolute path for the host system which you can get easily with `$(pwd)`, and a reference to the working directory we mentioned in our `Dockerfile`. So for our image the option looks like `$(pwd):/var/www`.
	- `$ docker run -it -v $(pwd):/var/www node-express-webpack express .`  Setup our express app
	- `$ docker run -it -v $(pwd):/var/www node-express-webpack npm install`  Install express app dependencies
1. You now should be able to run the app and visit it at `localhost:3000`. You can change the port that is exposed by changing the first half of the `-p` options. So `-p 8080:3000` would expose the app on `localhost:8080`.
	- `$ docker run -it -p 3000:3000 -v $(pwd):/var/www node-express-webpack ./bin/www`
	- `$ docker run -it -p 3000:3000 -v $(pwd):/var/www node-express-webpack node debug bin/www`  Start the app in debug mode

### Setup Mongo
1. Using the `-d` option lets the container run in the background. You can see what containers are running on your system with the `docker ps` command or just look in Kitematic.
	- `$ docker run --name mongod -d mongo`
	- Note the `--name mongod` option, we'll use this name to "link" our Mongo container to the Express one.
	- [Mongo Base Image](https://hub.docker.com/_/mongo/)
	- [Robomongo](https://robomongo.org/): A "workbench" type application for Mongo Databases

### Connect Express to Mongo
1. Now that your Mongo container is running in the background we can link it to our Express container using the `--link` option.
	- `$ docker run -it --link mongod:mongod -p 3000:3000 -v $(pwd):/var/www -e MONGOD_URL=mongod node-express-webpack ./bin/www`
	- This is mostly the same command as ealier, but now we're using the `--link mongod:mongod` option to connect our containers together. The Express container is able to access the Mongo container at the host name defined in the link option. For this particular application I'm passing the hostname into the application using an environment variable with the `-e` option.

### React and Webpack
#### Webpack
1. In order to use React's fancy JSX syntax, you'll need to use some sort of compiler so that the browser can read what we wrote. We'll use webpack for that. The image we built earlier already has this dependency, but there are a couple of other dependencies we'll need to install in order to compile jsx files specifically.
	- `$ docker run -it -v $(pwd):/var/www node-express-webpack npm install --save babel-core babel-loader babel-preset-latest babel-preset-react react react-dom`
	- The Babel dependencies get us the compiler code, the react packages get us code that we'll use for the Frontend.
1. We'll need to create a `webpack.config.js` file in order for webpack to know what to do with our code. This file just exports a webpack configuration object. The key properties to note are:
	- `entry`: Webpack will automatically bundle all dependencies required to run the file(s) in this properties.
	- `output`: This is where Webpack will place the bundled file. [Reference for multiple output files](http://codyreichert.github.io/blog/2015/07/04/webpack-create-multiple-bundles-with-entry-points/)
	- `module.loaders`:
		- `test`: a regexp for what filetypes to include
		- `loader`: which loader strategy to use
		- `query.presets`: An array of Babel presets to use
1. Run the Webpack bundler like so:
	- `$ docker run -it -v $(pwd):/var/www node-express-webpack webpack`
	- Provided you didn't run into any errors, you should now see a bundled file in the location of the output property in the `webpack.config.js`.

#### React
1. The entrypoint to this react app can be found at `./src/js/app.jsx`.
	- The line that invokes `ReactDOM.render` is responsible for attaching your React code to the page. The first argument is a reference to the Component you'd like to load to the page. The second argument is a reference to the DOM node you'd like to attach the React app to.
1. Application Structure:
	- For simple applications, I'd suggest placing Components which handle data and state within the `src/js/containers` directory. Components which just accept properties and don't maintain state should go in the `./src/js/components`. If you need to communicate a change from a child component back up to the parent, you can pass the child a function belonging to the parent as a prop.
	- For more complex applications I'd suggest using [Redux](http://redux.js.org/) or [Vue.js](https://vuejs.org/).
1. Props && State
	- Props are passed into a component from a parent component.
	- State is maintained within an instance of a component.
	- State can be changed using the `setState` function.
	- You can access a components state or props using `this.state` or `this.props`.
1. The Component Lifecycle
	- There are a few different lifecycle methods you can hook into. The most commonly used one is `render` as it's required to create a component.
	- A components `render` function is ran whenever that component has either recieved new props or has changed it's state.
	- Sometimes you'll want to modify state before or after a components `render` method has been called. React offers a few different methods that allow you to hook into different parts of the components lifecycle. [More information on that can be found here](https://facebook.github.io/react/docs/react-component.html).

