To run the JSX => JS watcher process:

* Open a command line in the `DM Dojo` folder
* Run `npm install -g babel-cli`
* Run `npm install babel-preset-es2015 babel-preset-react`

* Open a command line in the `Dojo` folder
* Run `babel --presets es2015,react --watch scripts/react --out-file scripts/app.js`
