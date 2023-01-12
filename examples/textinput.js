class TextInput {
  /**
   * @param {Canvas} canvas
   * @param {[number[], number[][]]} coords
   * @param {string} placeholder
   * @param {string} text_info
   * @param {string} inactive_color
   * @param {string} active_color
   * @param {string} background_color
   * @param {string} border
   * @param {boolean} dotted_border
   * @param {number} max_length
   * @param {string[]?} fb_add
   */
  constructor(canvas, coords, placeholder, text_info, inactive_color, active_color, background_color, border, dotted_border, max_length, fb_add) {
    this.canvas = canvas;
    //coords: [text location: [x, y], [bounding box [x, y], [x, y]]]
    this.coords = coords;
    this.placeholder = placeholder;
    this.current_text = this.placeholder;
    this.text_info = text_info;
    this.inactive_color = inactive_color;
    this.active_color = active_color;
    this.background_color = background_color;
    this.border = border;
    this.dotted_border = dotted_border;
    this.max_length = max_length;
    //front back add: [text to add to front, text to add to back]
    //eg: input is "Queso", fb_add = ["¿", "?"], input output is "¿Queso?" but current_text is just "Queso"
    this.fb_add = fb_add;
    this.active = false;
    let self = this;
    //onclick modify contents
    this.click = function(e) {
      //check if within coords
      if ((e.offsetX > self.coords[1][0][0] && e.offsetX < self.coords[1][1][0]) && (e.offsetY > self.coords[1][0][1] && e.offsetY < self.coords[1][1][1])) {
        //mobile keyboard popup
        if (window.game_is_mobile_device) {
          self.current_text = "";
          self.active = true;
          let prompt_text = prompt();
          if (!prompt_text) {
            self.active = false;
            self.current_text = self.placeholder;
            return;
          }
          self.current_text = prompt_text;
          if (self.max_length) {
            if (self.current_text.length > self.max_length) {
              self.current_text = self.current_text.slice(0, self.max_length);
            }
          }
          if (!self.current_text) {
            self.current_text = self.placeholder;
          }
          self.active = false;
          return;
        }
        if (self.current_text === self.placeholder) {
          self.current_text = "";
        }
        self.active = true;
      } else {
        if (self.current_text === "") {
          self.current_text = this.placeholder;
        }
        self.active = false;
      }
    };
    this.canvas.addEvent("click", [this]);
    //detect key inputs while active
    this.keydown = function(e) {
      if (self.active) {
        //ignore key press is over max length
        if (e.key === "Backspace" || e.key === "Delete") {
          self.current_text = self.current_text.substring(0, self.current_text.length-1);
        } else {
          if (self.current_text.length >= self.max_length && self.max_length) {
            return;
          }
          if (e.key.length !== 1) {
            return;
          }
          self.current_text += e.key;
        }
      }
    }
    this.canvas.addEvent("keydown", [this]);
    //onhover pointer
    this.set_cursor = false;
    this.mousemove = function(e) {
      if ((e.offsetX > self.coords[1][0][0] && e.offsetX < self.coords[1][1][0]) && (e.offsetY > self.coords[1][0][1] && e.offsetY < self.coords[1][1][1])) {
        self.set_cursor = true;
        document.body.style.cursor = "text";
        //button feedback
      } else {
        if (self.set_cursor) {
          self.set_cursor = false;
          document.body.style.cursor = "default";
        }
      }
    }
    this.canvas.addEvent("mousemove", [this]);
    this.canvas.components.push(this);
  }
  update() {
    if (this.background_color) {
      this.canvas.context.fillStyle = this.background_color;
      let width = this.coords[1][1][0]-this.coords[1][0][0];
      let height = this.coords[1][1][1]-this.coords[1][0][1];
      this.canvas.context.fillRect(this.coords[1][0][0], this.coords[1][0][1], width, height);
      if (this.border) {
        if (this.active) {
          this.canvas.context.strokeStyle = this.active_color;
        } else {
          this.canvas.context.strokeStyle = this.inactive_color;
        }
        if (this.dotted_border) {
          this.canvas.context.setLineDash([10, 10]);
        }
        this.canvas.context.strokeRect(this.coords[1][0][0], this.coords[1][0][1], width, height);
        if (this.dotted_border) {
          this.canvas.context.setLineDash([]);
        }
      }
    }
    this.canvas.context.font = this.text_info;
    let maxwidth = this.coords[1][1][0] - this.coords[1][0][0] - (this.coords[0][0]-this.coords[1][0][0]) - 3;
    if (this.active) {
      this.canvas.context.fillStyle = this.active_color;
    } else {
      this.canvas.context.fillStyle = this.inactive_color;
    }
    if (this.fb_add) {
      this.canvas.context.fillText(this.fb_add[0]+this.current_text+this.fb_add[1], this.coords[0][0], this.coords[0][1], maxwidth);
    } else {
      this.canvas.context.fillText(this.current_text, this.coords[0][0], this.coords[0][1], maxwidth);
    }
  }
}
