# dojo

To run the JSX => JS watcher process:

* Open a command line in the root folder
* Run `npm install babel-cli`
* Run `npm install babel-preset-es2015 babel-preset-react`
* Run `babel --presets es2015,react --watch scripts/react --out-file scripts/app.js`
