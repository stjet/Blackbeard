class TextButton {
  /**
   * @param {Canvas} canvas
   * @param {[number[], number[][]]} coords
   * @param {string} text
   * @param {string} text_info
   * @param {string} background_color
   * @param {string} text_color
   * @param {string} feedback_text_color
   * @param {boolean} rounded
   * @param {string} border
   * @param {boolean} underline
   * @param {Function} onclick
   * @param {bool} obey_click_temp_disabled
   */
  constructor(canvas, coords, text, text_info, background_color, text_color, feedback_text_color, rounded, border, underline, onclick, obey_click_temp_disabled, lineWidth=1) {
    this.canvas = canvas;
    //coords is [[text_x, text_y], [[button_top_x, button_top_y], [button_bottom_x, button_bottom_y]]]
    this.coords = coords;
    this.text = text;
    this.text_info = text_info;
    this.background_color = background_color;
    this.text_color = text_color;
    this.feedback_text_color = feedback_text_color;
    this.feedback = false;
    this.rounded = rounded;
    this.border = border;
    this.underline = underline;
    //this.path = undefined;
    this.display = true;
    this.set_cursor = false;
    let self = this;
    this.click_unwrapped = onclick;
    this.obey_ctd = obey_click_temp_disabled;
    this.lineWidth = lineWidth;
    this.click = function(e) {
      if (self.obey_ctd) {
        if (canvas.click_temp_disabled) return;
      }
      //check if within coords
      if ((e.offsetX > self.coords[1][0][0] && e.offsetX < self.coords[1][1][0]) && (e.offsetY > self.coords[1][0][1] && e.offsetY < self.coords[1][1][1]) && this.display) {
        //button feedback
        self.feedback = true;
        setTimeout(function() {
          self.feedback = false;
        }, 175);
        //now run given function, pass in optional self parameter
        self.click_unwrapped(self);
      }
    };
    this.mousemove = function(e) {
      if ((e.offsetX > self.coords[1][0][0] && e.offsetX < self.coords[1][1][0]) && (e.offsetY > self.coords[1][0][1] && e.offsetY < self.coords[1][1][1]) && self.display) {
        if (self.obey_ctd) {
          if (canvas.click_temp_disabled) return;
        }
        self.set_cursor = true;
        document.body.style.cursor = "pointer";
        //button feedback
        self.feedback = true;
      } else {
        if (self.set_cursor) {
          self.set_cursor = false;
          document.body.style.cursor = "default";
        }
        self.feedback = false;
      }
    }
    //dont overwrite!
    this.canvas.addEvent("click", [this]);
    this.canvas.addEvent("mousemove", [this]);
    this.canvas.components.push(this);
  }
  update() {
    if (!this.display) {
      return;
    }
    //button
    this.canvas.context.lineWidth = this.lineWidth;
    if (this.coords[1] && this.background_color) {
      //draw outline
      //fill
      if (this.rounded) {
        let path = new Path2D();
        //top left corner (arc measures are radians, clockwise)
        path.arc(this.coords[1][0][0]+15, this.coords[1][0][1]+15, 15, Math.PI, 3/2*Math.PI);
        //top right
        path.arc(this.coords[1][1][0]-15, this.coords[1][0][1]+15, 15, 3/2*Math.PI, 2*Math.PI);
        //bottom right
        path.arc(this.coords[1][1][0]-15, this.coords[1][1][1]-15, 15, 0, Math.PI/2);
        //bottom left
        path.arc(this.coords[1][0][0]+15, this.coords[1][1][1]-15, 15, Math.PI/2, Math.PI);
        path.lineTo(this.coords[1][0][0], this.coords[1][0][1]+15);
        this.canvas.context.fillStyle = this.background_color;
        this.canvas.context.fill(path);
        if (this.border) {
          this.canvas.context.strokeStyle = this.border;
          this.canvas.context.stroke(path);
        }
      } else if (this.background_color) {
        //much easier
        if (this.border) {
          this.canvas.context.strokeStyle = this.border;
          this.canvas.context.strokeRect(this.coords[1][0][0], this.coords[1][0][1], this.coords[1][1][0]-this.coords[1][0][0], this.coords[1][1][1]-this.coords[1][0][1]);
        }
        this.canvas.context.fillStyle = this.background_color;
        this.canvas.context.fillRect(this.coords[1][0][0], this.coords[1][0][1], this.coords[1][1][0]-this.coords[1][0][0], this.coords[1][1][1]-this.coords[1][0][1]);
      }
    }
    //text
    if (this.text) {
      if (this.feedback) {
        //change color of text
        this.canvas.context.fillStyle = this.feedback_text_color;
      } else {
        this.canvas.context.fillStyle = this.text_color;
      }
      //playaround with font and font size
      this.canvas.context.font = this.text_info;
      this.canvas.context.fillText(this.text, this.coords[0][0], this.coords[0][1]);
      if (this.underline) {
        let measurement = this.canvas.context.measureText(this.text);
        let line = new Path2D();
        //example: "18px Arial" into 18
        //let text_height = Math.ceil(Number(this.text_info.split("px")[0]));
        //text coordinates are from lower left corner so above not needed
        line.moveTo(this.coords[0][0], this.coords[0][1]+2);
        line.lineTo(this.coords[0][0]+Math.ceil(measurement.width), this.coords[0][1]+2);
        this.canvas.context.strokeStyle = this.text_color;
        if (this.feedback) {
          this.canvas.context.strokeStyle = this.feedback_text_color;
        } else {
          this.canvas.context.strokeStyle = this.text_color;
        }
        this.canvas.context.stroke(line);
      }
    }
  }
}
