class ProgressBar {
  /**
   * @param {Canvas} canvas
   * @param {[number[], number, number]} coords
   * @param {number} max
   * @param {string?} fill_color
   * @param {string?} border_color
   */
  constructor(canvas, coords, value_function, max, fill_color, border_color) {
    this.canvas = canvas;
    //[[top left corner], width, height]
    this.coords = coords;
    //call this function to get the current value (this way live updates are possible)
    this.value_function = value_function;
    this.max = max;
    this.fill_color = fill_color;
    this.border_color = border_color;
    this.finished = false;
    this.display = true;
    this.canvas.components.push(this);
  }
  update() {
    if (!this.display) return;
    //calculate progress
    let progress = Math.round(this.coords[1]*(this.value_function()/this.max));
    if (progress >= this.coords[1]) {
      progress = this.coords[1];
      this.finished = true;
    }
    //fill
    this.canvas.context.fillStyle = this.fill_color;
    this.canvas.context.fillRect(...this.coords[0], progress, this.coords[2]);
    //outline/border
    this.canvas.context.strokeStyle = this.border_color;
    this.canvas.context.strokeRect(...this.coords[0], this.coords[1], this.coords[2]);
  }
}
