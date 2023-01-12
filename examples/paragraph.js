class Paragraph {
  /**
   * @param {Canvas} canvas
   * @param {string} text
   * @param {string} text_info
   * @param {string} text_color
   * @param {number[]} coord
   * @param {number} max_width
   * @param {bool} identity
   * @param {bool} centered
   */
  constructor(canvas, text, text_info, text_color, coord, max_width, identity, centered=false, addon=false) {
    this.canvas = canvas;
    this.text = text;
    this.text_info = text_info;
    this.text_color = text_color;
    this.coord = coord;
    this.max_width = max_width;
    this.identity = identity;
    this.centered = centered;
    this.addon = addon;
    if (this.identity) {
      this.canvas.addEvent("customtextchange", [this]);
    }
    //sets this.lines
    this.calculate_lines();
    this.canvas.components.push(this);
  }
  calculate_lines() {
    let lines = [];
    let line = "";
    this.canvas.context.font = this.text_info;
    let words = this.text.split(" ");
    for (let w=0; w < words.length; w++) {
      line += words[w];
      let width = this.canvas.context.measureText(line).width;
      if (width > this.max_width) {
        //remove last word
        line = line.split(" ").slice(0, -1).join(" ");
        lines.push(line);
        line = words[w];
      }
      if (w === words.length-1) {
        lines.push(line);
        break;
      }
      line += " ";
    }
    this.lines = lines;
  }
  customtextchange(text_obj) {
    if (text_obj.detail[this.identity] !== undefined && text_obj.detail[this.identity] !== false) {
      if (typeof text_obj.detail[this.identity] === "string") {
        this.text = text_obj.detail[this.identity];
      } else {
        this.text = text_obj.detail[this.identity][0];
        this.addon = text_obj.detail[this.identity][1];
      }
      this.calculate_lines();
    }
  }
  update() {
    let text_height = Number(this.text_info.split("px")[0]);
    for (let l=0; l < this.lines.length; l++) {
      let line = this.lines[l];
      this.canvas.context.font = this.text_info;
      this.canvas.context.fillStyle = this.text_color;
      if (this.centered) {
        let width = this.canvas.context.measureText(line).width;
        this.canvas.context.fillText(line, Math.round(this.coord[0]-width/2), this.coord[1] + (text_height+2)*l, this.max_width);
      } else {
        this.canvas.context.fillText(line, this.coord[0], this.coord[1] + (text_height+2)*l, this.max_width);
      }
    }
    if (this.addon) {
      if (this.centered) {
        let width = this.canvas.context.measureText(this.addon).width;
        this.canvas.context.fillText(this.addon, Math.round(this.coord[0]-width/2), this.coord[1] + (text_height+2)*(this.lines.length+1), this.max_width);
      } else {
        this.canvas.context.fillText(this.addon, this.coord[0], this.coord[1] + (text_height+2)*(this.lines.length+1), this.max_width);
      }
    }
  }
}
