class Link extends TextButton {
  /**
   * @param {Canvas} canvas
   * @param {string} link
   * @param {number[]} coords
   * @param {string} text
   * @param {string} text_info
   * @param {string} text_color
   * @param {string} feedback_text_color
   * @param {boolean} underline
   */
  constructor(canvas, link, coords, text, text_info, text_color, feedback_text_color, underline) {
    //measure text width, get bounding box
    canvas.context.font = text_info;
    let textWidth = canvas.context.measureText(text).width;
    //get text height
    let textHeight = Number(text_info.split("px")[0]);
    //coords is at bottom left of text 
    let boundingbox = [[coords[0]-5, coords[1]-textHeight-5], [coords[0]+textWidth+5, coords[1]+5]];
    //call new TextButton() essentially
    super(canvas, [coords, boundingbox], text, text_info, false, text_color, feedback_text_color, false, false, underline, function() {
      window.open(link, '_blank');
    });
    this.link = link;
  }
  update() {
    super.update();
  }
}
