# Contributing

Dojo is written in TypeScript / JavaScript, using React and SCSS. If you would like to contribute to this project, you are welcome to do so.

## Initial set up

You will need to have `Git` and `Node.js` installed.

* Open a terminal in the root folder
* Run `npm install`
* Check that you're using the latest dependencies by running `npm update`

## Compiling and running the app

* Open a terminal in the root folder
* Run `npm start`

Your default browser should open; if it does not, open it and navigate to [http://localhost:3000](http://localhost:3000).

The page should automatically reload if you make edits.

If there are any build errors, you will see them in the terminal and the browser debug console.

## Making a change to the app

Check that your changes don't break the project's style rules:

* Open a terminal in the root folder
* Run `npm run lint`

Remember to update the app version number in `package.json` before pushing any change to the repository.

## Publishing a new version of the app

* Open a terminal in the root folder
* Run `npm run deploy`

This will build the app in the `build` folder and attempt to deploy it.
