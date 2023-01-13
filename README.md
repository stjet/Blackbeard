# Blackbeard

Blackbeard is a very simple but powerful game engine for HTML Canvas, to make games in the browser.

Two somewhat complex examples that use Blackbeard are an [interactive traffic thing](https://github.com/jetstream0/Traffic) and the [Muskets and Bayonets web game](https://github.com/jetstream0/Muskets-and-Bayonets). These two examples use slightly older and modified versions of the engine, but they are close enough to use as reference.

Put `blackbeard.js` and link to it in `<head>`, like so:

```js
<!DOCTYPE html>
<html>
  <head>
    ...boilerplate
    <script src="/path/to/blackbeard.js"></script>
  </head>
  <body>
    ...site here
  </body>
</html>
```

Blackbeard is roughly 100 lines so there should be no worries about size. For this reason, no CDN link is provided. You can do it, I believe in you.

# Documentation

## Initializing

In the `<body>`, add your javascript (`<script>` tag, inline or with `src`, either is fine).

You can put the following to initialize a Blackbeard Canvas.

```js
let canvas = new Canvas([width, height], id);
```

Where `width` and `height` are integers, and `id` is a string that will be the id of the HTML element, like so:

```js
let canvas = new Canvas([1200, 700], "game-canvas");
```

This will create the `<canvas>` HTML element for you. Adding styling to the element is fine, but be careful. Adding padding directly will result in click coordinates being wrong. Instead, wrap in a `<div>` and apply the padding to the `<div>`.

By default, the `<canvas>` will be created as a direct child of the `<body>` element, but you can change that by passing in a third parameter (an `HTMLElement` that the `<canvas>` should be a child of):

```js
let canvas = new Canvas([1200, 700], "game-canvas", document.getElementById("game-div"));
```

If you do this, make sure the `<script>` tag is at the very bottom. If you have HTML elements (such as your intended parent element) after the `<script>` tag, your script will not be able to see them.

## Updating the Canvas

Now, you want to call the `canvas.update()` function whenever you want the canvas to be updated. Typically, you want this done automatically every x milliseconds.

For example, if you want 12 frames (updates) per second, you can add a `setInterval` function that runs a update every `1000/12` milliseconds (1000 milliseconds is 1 second):

```js
setInterval(function() {
  canvas.update();
}, 1000/12);
```

Keep in mind `setInterval` and is not precise to the millisecond.

12 is a pretty arbitrary number, and may not work for all purposes. For animations, you may want a higher number, around 24 maybe?

If you set it too high, you may experience performance problems.

## Adding Components

Great! Now you should have a blank, probably white (or whatever the background color is) canvas. Now what?

Add some components! There are many prewritten components under `examples/` that you can use, but you probably want to write your own.

If you do write your own, it is suggested to be familiar with the Canvas API. This [MDN page](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) has links to good resources.

Let's write a Blackbeard component together.

A Blackbeard component is a class with at least two functions: `constructor` (mandatory for javascript classes), and `update` (called every time `canvas.update()` is called).

To practice, we will be writing a very simple rectangle component.

Here's the outline:

```js
class Rectangle {
  constructor() {
    //
  }
  update() {
    //
  }
}
```

Now let's see how to register the component with the canvas:

```js
class Rectangle {
  constructor(canvas) {
    this.canvas = canvas;
    this.canvas.components.push(this);
  }
  update() {
    //
  }
}
```

`this.canvas.components` is the array of components. `push` adds the component to the end of the array. You can use [splice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) instead to put the component at any index.

The components are drawn in order. For example, if the first element of the `this.canvas.components` array is a rectangle at a position, and the second is a triangle at the same position, the triangle will be on top of the rectangle. 

And accept some parameters for upper left hand corner coord, fill color, stroke color, line_width, size.

```js
class Rectangle {
  constructor(canvas, coord, size, fill_color, stroke_color) {
    //coord is [x, y]
    this.coord = coord;
    this.width = size[0];
    this.height = size[1];
    this.fill_color = fill_color;
    this.stroke_color = stroke_color;
    this.canvas = canvas;
    this.canvas.components.push(this);
  }
  update() {
    //
  }
}
```

We also want to have the `update` function actually do something when called. Specifically, we want it to draw a rectangle. Shocker.

```js
class Rectangle {
  constructor(canvas, coord, size, fill_color, stroke_color, line_width) {
    //coord is [x, y]
    this.coord = coord;
    this.width = size[0];
    this.height = size[1];
    this.fill_color = fill_color;
    this.stroke_color = stroke_color;
    this.line_width = line_width
    this.canvas = canvas;
    this.canvas.components.push(this);
  }
  update() {
    this.canvas.context.beginPath();
    this.canvas.context.rect(this.coord[0], this.coord[1], this.width, this.height);
    if (this.fill_color) {
      this.canvas.context.fillStyle = this.fill_color;
      this.canvas.context.fill();
    }
    if (this.stroke_color) {
      this.canvas.context.lineWidth = this.lineWidth;
      this.canvas.context.strokeStyle = this.stroke_color;
      this.canvas.context.stroke();
    }
  }
}
```

And that's it. Hopefully simple enough.

You can now create a rectangle component.

```js
new Rectangle(canvas, [50, 100], [75, 60], "green", "black", 3);
```

Beautiful!

![Selling as NFT, just 10 easy payments of 5.99 ETH!](/examples/images/greenrectangle.png)

## Events

Blackbeard also takes full advantage of HTML events. Components can respond to various events quite easily.

Let's modify our previous rectangle component to change color to blue when clicked.

This will require two changes.

First, registering the `click` event with the Blackbeard canvas, in the `constructor`.

```js
this.canvas.addEvent("click", [this]);
```

Simple, now we need to add a `click` function to our class, to handle the event.

```js
class Rectangle {
  ...
  click(e) {
    //check to see if within bounds
    if ((e.offsetX >= this.coord[0] && e.offsetX < this.coord[0]+this.width) && (e.offsetY >= this.coord[1] && e.offsetY < this.coord[1]+this.height)) {
      this.fill_color = "blue";
    }
  }
  ...
}
```

Full code:

```js
class Rectangle {
  constructor(canvas, coord, size, fill_color, stroke_color, line_width) {
    //coord is [x, y]
    this.coord = coord;
    this.width = size[0];
    this.height = size[1];
    this.fill_color = fill_color;
    this.stroke_color = stroke_color;
    this.line_width = line_width
    this.canvas = canvas;
    this.canvas.addEvent("click", [this]);
    this.canvas.components.push(this);
  }
  click(e) {
    //check to see if within bounds
    if ((e.offsetX >= this.coord[0] && e.offsetX < this.coord[0]+this.width) && (e.offsetY >= this.coord[1] && e.offsetY < this.coord[1]+this.height)) {
      this.fill_color = "blue";
    }
  }
  update() {
    this.canvas.context.beginPath();
    this.canvas.context.rect(this.coord[0], this.coord[1], this.width, this.height);
    if (this.fill_color) {
      this.canvas.context.fillStyle = this.fill_color;
      this.canvas.context.fill();
    }
    if (this.stroke_color) {
      this.canvas.context.lineWidth = this.lineWidth;
      this.canvas.context.strokeStyle = this.stroke_color;
      this.canvas.context.stroke();
    }
  }
}
```

Works great!

![truly revolutionary](/examples/images/greentoblue.gif)

## Functions

This section documents Blackbeard's the `Canvas` class functions.

### constructor

Create a Blackbeard Canvas class.

Example:

```js
new Canvas([500, 500], "game-canvas");
```

Parameters:
- size (number[]): width, height
- id (string): html id of `<canvas>` element
- parent (HTMLElement | undefined): if `undefined`, will be the child of the `<body>`, if element passed in, will be child of that element
- contextOptions (object | undefined): See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext#contextattributes)

### update

Call to redraw Canvas, and call all components' `update` function.

Example:

```js
setInterval(function() {
  canvas.update();
}, 1000/12);
```

Parameters: none

### clear

Clear canvas (blank).

Example:

```js
canvas.clear();
```

Parameters: none

### reset

Remove all components and all event listeners.

Example:

```js
canvas.reset();
```

Parameters: none

### addEvent

Subscribe components to a HTML event (custom events work too).

Example:

```js
//as part of a component's `constructor`
this.canvas.addEvent("click", [this], false);
```

Parameters:
- event (string): Name of event
- objects: Array of components that will subscribe to events
- overwrite (bool, default=false): Replace existing components 

### clearDeadEvents

Remove event subscription for components which no longer exist.

Example:

```js
canvas.clearDeadEvents();
```

Parameters: none
