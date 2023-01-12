class Modal {
  /**
   * @param {Canvas} canvas
   * @param {number[]} coords
   * @param {string} color
   * @param {bool} rounded
   * @param {number} background_opacity
   * @param {string} border
   */
  constructor(canvas, coords, color, rounded, background_opacity, border) {
    this.canvas = canvas;
    this.canvas.scroll_temp_disabled = true;
    this.canvas.keydown_temp_disabled = true;
    this.click_temp_disabled_snapshot = this.canvas.click_temp_disabled;
    this.canvas.click_temp_disabled = true;
    this.canvas.touchmove_temp_disabled = true;
    //[[x, y], [x, y]]
    this.coords = coords;
    this.color = color;
    this.rounded = rounded;
    this.background_opacity = background_opacity;
    this.border = border;
    //members of the modal
    this.members = [];
    this.canvas.components.push(this);
    this.intervals = [];
    //https://stackoverflow.com/questions/4011793/this-is-undefined-in-javascript-class-methods
    this.close = this.close.bind(this);
  }
  close() {
    //reenable map stuff
    this.canvas.scroll_temp_disabled = false;
    this.canvas.keydown_temp_disabled = false;
    //to prevent issue when two modals are opened
    //when modal closed, click is only reenabled if at the beginning it was already enabled (modal already opened)
    //if at beginning it was disabled, leave it disabled
    if (!this.click_temp_disabled_snapshot) {
      this.canvas.click_temp_disabled = false;
    }
    this.canvas.touchmove_temp_disabled = false;
    //set cursor back to normal
    document.body.style.cursor = "default";
    //should also enable canvas onclick and stuff
    //remove self and members
    this.canvas.components = this.canvas.components.filter(function (item) {
      return this !== item && !this.members.includes(item);
    }, this);
    this.intervals.forEach(function(interval) {
      clearInterval(interval);
    });
  }
  update() {
    //disable canvas onclick and stuff
    //greyed out background
    this.canvas.context.fillStyle = "rgba(255, 255, 255, "+String(this.background_opacity)+")";
    this.canvas.context.fillRect(0, 0, this.canvas.canvas.width, this.canvas.canvas.height);
    //actual modal
    if (this.rounded) {
      let path = new Path2D();
      //top left corner (arc measures are radians, clockwise)
      path.arc(this.coords[0][0]+15, this.coords[0][1]+15, 15, Math.PI, 3/2*Math.PI);
      //top right
      path.arc(this.coords[1][0]-15, this.coords[0][1]+15, 15, 3/2*Math.PI, 2*Math.PI);
      //bottom right
      path.arc(this.coords[1][0]-15, this.coords[1][1]-15, 15, 0, Math.PI/2);
      //bottom left
      path.arc(this.coords[0][0]+15, this.coords[1][1]-15, 15, Math.PI/2, Math.PI);
      path.lineTo(this.coords[0][0], this.coords[0][1]+15);
      this.canvas.context.fillStyle = this.color;
      this.canvas.context.fill(path);
      if (this.border) {
        this.canvas.context.strokeStyle = this.border;
        this.canvas.context.stroke(path);
      }
    } else {
      let path = new Path2D();
      path.moveTo(...this.coords[0]);
      path.lineTo(this.coords[1][0], this.coords[0][1]);
      path.lineTo(...this.coords[1]);
      path.lineTo(this.coords[0][0], this.coords[1][1]);
      path.lineTo(...this.coords[0]);
      this.canvas.context.fillStyle = this.color;
      this.canvas.context.fill(path);
      if (this.border) {
        this.canvas.context.strokeStyle = this.border;
        this.canvas.context.stroke(path);
      }
    }
  }
}
