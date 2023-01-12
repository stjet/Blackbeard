class Slider {
  /**
   * @param {Canvas} canvas
   * @param {[number[], number[]]} coords
   * @param {string[]} points
   * @param {string} default_point
   * @param {string} color
   * @param {string} circle_color
   * @param {string} text_info
   * @param {Function} onchange
   */
  constructor(canvas, coords, points, default_point, color, circle_color, text_info, onchange) {
    this.canvas = canvas;
    //[[start], [end]]
    this.coords = coords;
    this.points = points;
    this.current = default_point;
    this.color = color;
    this.circle_color = circle_color;
    this.text_info = text_info;
    this.onchange = onchange;
    //indicates whether being currently dragged or not
    this.dragging = false;
    //onclick events, drag (onmousedown, onmouseup)
    this.canvas.addEvent("click", [this]);
    this.canvas.addEvent("mousedown", [this]);
    this.canvas.addEvent("mouseup", [this]);
    this.canvas.components.push(this);
  }
  mousedown(e) {
    let p_interval = (this.coords[1][0] - this.coords[0][0])/(this.points.length - 1);
    for (let i=0; i < this.points.length; i++) {
      let p_dist = distance([this.coords[0][0]+(p_interval*i), this.coords[0][1]], [e.offsetX, e.offsetY]);
      if (p_dist < 15) {
        this.dragging = true;
      }
    }
  }
  mouseup(e) {
    if (!this.dragging) return;
    let p_interval = (this.coords[1][0] - this.coords[0][0])/(this.points.length - 1);
    for (let i=0; i < this.points.length; i++) {
      let p_dist = distance([this.coords[0][0]+(p_interval*i), this.coords[0][1]], [e.offsetX, e.offsetY]);
      //if points are less than 15 pixels apart that would be bad. dont do that people!
      if (p_dist < 15) {
        this.current = this.points[i];
        this.onchange(this.current);
      }
    }
  }
  click(e) {
    let p_interval = (this.coords[1][0] - this.coords[0][0])/(this.points.length - 1);
    for (let i=0; i < this.points.length; i++) {
      let p_dist = distance([this.coords[0][0]+(p_interval*i), this.coords[0][1]], [e.offsetX, e.offsetY]);
      //if points are less than 15 pixels apart that would be bad. dont do that people!
      if (p_dist < 15) {
        this.current = this.points[i];
        this.onchange(this.current);
      }
    }
  }
  update() {
    this.canvas.context.fillStyle = this.color;
    this.canvas.context.strokeStyle = this.color;
    this.canvas.context.font = this.text_info;
    //this is the horizontal line where you drag at
    let path = new Path2D();
    path.moveTo(this.coords[0][0], this.coords[0][1]);
    path.lineTo(this.coords[1][0], this.coords[1][1]);
    //change line size?
    this.canvas.context.stroke(path);
    let p_interval = (this.coords[1][0] - this.coords[0][0])/(this.points.length - 1);
    for (let i=0; i < this.points.length; i++) {
      //the little vertical lines indicating where a point is
      let path2 = new Path2D();
      path2.moveTo(this.coords[0][0]+(p_interval*i), this.coords[0][1]-6);
      path2.lineTo(this.coords[0][0]+(p_interval*i), this.coords[0][1]+6);
      this.canvas.context.stroke(path2);
      this.canvas.context.fillText(this.points[i], this.coords[0][0]+(p_interval*i)-3, this.coords[0][1]+20);
    }
    //create circle indicator where the current point is
    let path3 = new Path2D();
    this.canvas.context.fillStyle = this.circle_color;
    path3.arc(this.coords[0][0]+(p_interval*this.points.indexOf(this.current)), this.coords[0][1], 7, 0, 2*Math.PI);
    this.canvas.context.fill(path3);
  }
}
