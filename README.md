This tutorial will help you get started as a **frontend** dev for ShOC.

**Help!**
* If you get confused start by using your googling skills! We are happy to answer your questions but debugging is also a very important part of development. Ask for help when you're out of options or you don't know where to start looking. 

**Know the Tech Stack:**
*  Package Management Tool: Yarn 
*  Frontend: typescript + React 16(with hooks) 
*  Other: git 

**What you need to start:**
*  A terminal
*  yarn
*  git 
*  an IDE such as VS Code

**Study Material**
- [Intro to Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)
- [React Docs](https://reactjs.org/docs/getting-started.html)

**React + Typescript Checklist**
Part 1: Getting Started! We're going to make snake! (look it up if you don't know the game!)

*After each step, check in with a developer before you start on the next checklist item*  
1. Clone the tutorial down to your computer. Then, change the text in the tutorial app to "Hello World" and start up the frontend by typing `yarn start` in iTerm (or the command line of choice). (You might need to run yarn install to update dependencies) 
>Relevant Material: 
>* [No Shit Git](https://rogerdudler.github.io/git-guide/)

2. Next, create the Board using **ES6 arrow functions**: 
* "Board" in a board.tsx
* import React at the top (see other pages if you don't know how to do this)
* Add this at the end to allow other components to see this one `export default Board`
* Your return should look something like this: (`return <div>Board</div>`)
Make a commit and push!
>Relevant Material: 
>* [React Components](https://reactjs.org/docs/components-and-props.html) (note: Be sure you're using arrow functions and not classes or regular functions)

3. Let's do some styling! Make the background color of the Board component the color of your choice by making a scss file and attaching a className to the main div in your Board component. 
* First off, we need Sass so type in `yarn add node-sass` in terminal to add it to your package.json.
* Then make an scss file, add the following code: 
`.board-background{
	backgroundColor: blue; 
	width: 500px; 
	height: 500px; 
	display: grid;
	grid-template-columns: repeat(50, 10px);
	grid-template-rows: repeat(50, 10px);
	grid-gap: 0;
}` 
and import it in your index.tsx file like so: `import './styles.scss'`.
* Attach the style  below to your board div with the className prop: `<div className='board-background'>Board</div>`
* Import and display the Board component in your App.tsx file. You can delete all of the pre-made code from create-react-app
>Relevant Material: 
>* [SCSS/SASS Basics](https://sass-lang.com/guide)

4. We have lots more styles to create.
* Make a cell, snake-head, snake-tail, and food style in your stylesheet. 
* They all need a width and height of 10px and any color you desire. 
* cell needs a border with any color .5px and solid: `border: #aaaaaa .5px solid` 

5. Next lets make the grid! 
* First add an interface called Coordinates: 
* Then add a State Hook called grid(the stuff in the <> brackets is typescript telling us that our grid variable is a 2D array with Coordinates in it): 
`const [grid, setGrid] = React.useState<Coordinates[][]>()`
* Next we need to create a grid initializer. This will set up our grid! The React.useEffect Hook will be very useful in managing component lifecycle. Add the following right under your State Hook declarations: `React.useEffect(() => {initGrid()},[])`
* Add the function initGrid that we just used above! 
`const initGrid = () => {
		const grid = [];
		for (let row = 0; row < 50; row++) {
			const cols = [];
			for (let col = 0; col < 50; col++) {
				cols.push({row, col});
			}
			grid.push(cols);
		}
		setGrid(grid);
	}` 
* Add the function that draws the grid: 
`const drawGrid = () => {
		return grid && grid.map((row)=>
			row.map((coords) => {
				return <div key={`${coords.row}-${coords.col}`}>
				</div>
			}))
	}`
* Finally, we need to display that grid in our return function(What we're saying here is that in order to draw the Grid, grid first has to be initialized): `return <div className='board-background'>{grid && drawGrid()}</div>`
* Commit and push after you get it checked!
>Relevant Material: 
>* [Typescript Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)
>* [React State Hook](https://reactjs.org/docs/hooks-state.html)
>* [React useEffect Hook](https://reactjs.org/docs/hooks-effect.html)

6. Lets display our snake head.
* Make a State Hook called snakeHead and type it to type Coordinates. Initialize it with {row: 5 and col: 10}
* Create a function `getObjectStyleInCell` that checks if the snakehead is in the grid. 
* The function `getObjectStyleInCell` should take in a row and column, return the scss classname you made previously ('snake-head') if the row and column that is returned matches your snakeHead state or return the style 'cell'. (this will be an if-else statement)
* Add your new function into the empty div in drawGrid. The new function will be for getting a className.

7. Your snake needs a tail. We will give it 3 tail pieces to begin with. 
* Create a tailArray State Hook with type Coordinates[] and initialize it with the following: `[{row: 5, col: 9}, {row: 5, col: 8}, {row: 5, col: 7}]` These tail pieces will be right behind your snake head. 
* Add another if statement to check if the coordinates match the tail... this one will be a little trickier. We will need to use the array.find() method to check if the Tail Array contains the correct coordinate. `let tailFound = tailArray.find((tail) => {return (x===tail.row && y === tail.col)})`

8. Generate the food! Same deal except we want the food to appear randomly.  
* First create a State Hook called food with type Coordinates initialized with {row: -1, col: -1}.
* In our useEffect we can add a function called placeFood() which will be our food randomizing function.
* `const placeFood = () => {
	setFood({row: Math.floor(Math.random() * 50), col: Math.floor(Math.random() * 50)})
}`
* Finally we need to add another if statement to our `getObjectStyleInCell` function to check if the coordinates match the food coordinates.
* Have you been committing and pushing every step?

9. Next we need keyboard listeners! 
* Add the listener to your useEffect: `document.addEventListener('keydown', onKeyDown); 
return () => {
	document.removeEventListener('keydown', onKeyDown);
			window.clearInterval(timer);
	}`
* So now that our app is listening, we can make a function to handle what happens when we get these keyboard events! Make a function called onKeyDown (notice that this function is what the eventListener in the previous bullet is checking for) that checks what key you pressed. (This will be if statements. Console log if you don't know what something does!) 

10. This is cool and all but our snake needs to move and do stuff. We need something that 'ticks' the game along. Something that updates the game every hundred or so milliseconds.
* Create a State Hook called tick with initial state 0 and type number
* Create a State Hook called snakeVelocity with initial state {xv: 0, yv: 0} (feel free to add an interface for this one)
* Add the interval maker to your useEffect `const timer = window.setInterval(() => {
	setTick(prevState => prevState + 1);
}, 1000);`
* Make sure to handle the unmounting in the return statement in useEffect `window.clearInterval(timer);`
* Now if you `console.log(tick)`, you'll see it updates every second.
* That snakeVelocity that we created is for our `onKeyDown` function. We want to `setSnakeVelocity` based on which arrow key we click. Add that in your code.

11. We need another useEffect but this time it will take a dependency 'tick'. This means that anytime 'tick' advances, our useEffect Hook will trigger.
* `React.useEffect(() => {//Add code here}, [tick])`
* In the useEffect we need three things. 1. If the velocity of the snake is not 0, we want the new tail piece coordinate to be the tail piece ahead of it. If it's the lead tail piece it should take the coordinate of the snake head. 2. The snakeHead needs to advance to the next spot according to the snake velocity. 3. The gamelogic should be checked (this can be an empty function called `gameLogic()` for now)
* Your snake should move now! Congrats

12. Game logic is a thing.
* Let's build that gameLogic function now. It needs three things. 1. Check if your head is at the same place as a food. If it is, you should get a new tail piece and you should place a new food. 2. If you hit a wall, for now you can `console.log('You hit the wall')` 3. If you hit your tail you can `console.log('You hit your tail')`

13. Now lets add the ability to lose the game
* Create a hook called lost with initial value false and type boolean
* Then where you console logged in the last part you can just `setLost(true)`
* Now we'll add our first Ternary! If you haven't lost, render the stuff you've been rendering, or else render a div that says you lost.
>Relevant Material: 
>* [Ternary Operators](https://guide.freecodecamp.org/c/ternary-operator/)

14. Almost done! Let's add the ability to pause or restart the game. 
* Create two hooks, pause and restart that both initialize as false and have type boolean.
* Next make two buttons at the bottom with a new scss className called button that has a background color and hover `&:hover{backgroundColor: 'someColor'}` so it looks like a button. Then give them onClick props that setPause (or reset) to !pause.
* If pause is true, your snake velocity should be set to 0 and you shouldn't be able to play the game. If you toggle the pause again you should be able to start again from the same place.
* For reset, give your original useEffect the dependency `restart`. Then initialize all your other variables. Then, everytime restart is toggled, it will reinitialize all your variables. 
`setSnakeHead({row: 5, col: 10})
setTailArray([{row: 5, col: 9}, {row: 5, col: 8}, {row: 5, col: 7}])
setLost(false)
setSnakeVelocity({xv: 0, yv: 0})
setTick(0)`


YOU MADE IT. Wipe the sweat off your brow and give yourself a pat on the back


  

