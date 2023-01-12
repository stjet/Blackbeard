class Toggle {
  /**
   * @param {Canvas} canvas
   * @param {[number[], number[]]} coords
   * @param {Function} get_function
   * @param {Function} change_function
   */
  constructor(canvas, coords, get_function, change_function) {
    this.canvas = canvas;
    this.coords = coords;
    this.get_function = get_function;
    this.change_function = change_function;
    //this.path = new Path2D();
    this.canvas.addEvent("click", [this], false);
    this.canvas.components.push(this);
  }
  click(e) {
    //e.offsetX e.offsetY
    if (this.canvas.context.isPointInPath(this.path, e.offsetX, e.offsetY)) {
      if (this.get_function()) {
        this.change_function(false);
      } else {
        this.change_function(true);
      }
    }
  }
  update() {
    let path = new Path2D();
    path.moveTo(...this.coords);
    //width: 70
    //radius: 15
    path.arc(this.coords[0], this.coords[1]+15, 15, Math.PI/2, Math.PI*3/2);
    path.rect(this.coords[0], this.coords[1], 40, 30)
    path.arc(this.coords[0]+40, this.coords[1]+15, 15, -Math.PI/2, -Math.PI*3/2);
    canvas.context.lineWidth = 3;
    canvas.context.strokeStyle = "black";
    canvas.context.stroke(path);
    if (this.get_function()) {
      canvas.context.fillStyle = "green";
    } else {
      canvas.context.fillStyle = "red";
    }
    this.path = path;
    canvas.context.fill(path);
    //inner circle
    canvas.context.fillStyle = "white";
    let path_inner = new Path2D();
    if (this.get_function()) {
      path_inner.arc(this.coords[0]+40, this.coords[1]+16, 13, 0, Math.PI*2);
    } else {
      path_inner.arc(this.coords[0], this.coords[1]+16, 13, 0, Math.PI*2);
    }
    canvas.context.fill(path_inner);
  }
}
