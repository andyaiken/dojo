# dojo

Initial set up:

* Open a command line in the root folder
* Run `npm install http-server`
* Run `npm install babel-cli`
* Run `npm install babel-preset-es2015 babel-preset-react`

To compile JSX to JS as changes are made:

* Open a command line in the root folder
* Run `babel --presets es2015,react --watch scripts/react --out-file scripts/app.js`

To start the web server:

* Open a command line in the root folder
* Run `http-server`
* Open a web browser to `http://localhost:8080`
