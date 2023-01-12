class Text {
  /**
   * @param {Canvas} canvas
   * @param {number[]} coords
   * @param {string} text
   * @param {string} text_info
   * @param {string} color
   * @param {string} stroke_color
   * @param {number} maxwidth
   * @param {string} identity
   */
  constructor(canvas, coords, text, text_info, color, stroke_color, maxwidth, identity) {
    this.canvas = canvas;
    this.coords = coords;
    this.text = text;
    this.text_info = text_info;
    this.stroke_color = stroke_color;
    this.color = color;
    this.maxwidth = maxwidth;
    this.identity = identity;
    if (this.identity) {
      this.canvas.addEvent("customtextchange", [this]);
      this.canvas.addEvent("customcoordschange", [this]);
    }
    //this.display should be set from outside
    this.display = true;
    this.shadowBlur = 5;
    this.lineWidth = 10;
    this.canvas.components.push(this);
  }
  customtextchange(text_obj) {
    //if it is "0" then we should let it happen
    if (text_obj.detail[this.identity] !== undefined && text_obj.detail[this.identity] !== false) {
      this.text = text_obj.detail[this.identity];
    }
  }
  customcoordschange(coords_obj) {
    //if text changes, coords may need to change too
    if (coords_obj.detail[this.identity]) {
      this.coords = coords_obj.detail[this.identity];
    }
  }
  update() {
    if (!this.display) {
      return;
    }
    if (this.text === undefined || this.text === false) {
      return;
    }
    this.canvas.context.font = this.text_info;
    //eg: shadow-white
    if (this.stroke_color) {
      if (this.stroke_color.startsWith('shadow-')) {
        if (window.settings.shadow) {
          this.canvas.context.shadowColor = this.stroke_color.split("-")[1];
          this.canvas.context.shadowBlur = this.shadowBlur;
          this.canvas.context.lineWidth = this.lineWidth;
        }
      } else {
        this.canvas.context.strokeStyle = this.stroke_color;
        this.canvas.context.strokeText(this.text, this.coords[0], this.coords[1], this.maxwidth);
      }
    }
    if (this.color) {
      this.canvas.context.fillStyle = this.color;
      if (this.maxwidth) {
        this.canvas.context.fillText(this.text, this.coords[0], this.coords[1], this.maxwidth);
      } else {
        this.canvas.context.fillText(this.text, this.coords[0], this.coords[1]);
      }
    }
    if (this.stroke_color) {
      if (this.stroke_color.startsWith('shadow-')) {
        //reset
        this.canvas.context.shadowBlur = 0;
        this.canvas.context.lineWidth = 1;
      }
    }
  }
}
