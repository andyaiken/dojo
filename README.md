# dojo

Dojo is a web app for D&D (5E) dungeon masters.

It can be used to design monsters and to plan and run combat encounters.

Dojo is written in TypeScript / JavaScript, using React and SCSS. If you would like to contribute to this project, you are welcome to do so.

## Initial set up

* Open a terminal in the root folder
* Run `npm install`

## Compiling and running the app

* Open a terminal in the root folder
* Run `npm start`
* Your default browser should open; if it does not, open it and navigate to [http://localhost:3000](http://localhost:3000)

The page should automatically reload if you make edits. If there are errors, you will see them in the terminal and the browser debug console.

## Publishing the app

* Open a terminal in the root folder
* Run `npm run deploy`

This will build the app in the `build` folder and attempt to deploy it. You need to have git installed.

## Code structure

- public
- src
  - components
    - cards
    - controls
    - list-items
    - modals
    - panels
    - screens
  - models
  - resources
    - data
    - images
      - maptiles
  - style
    - css
    - scss
