const TagBrush = require('./TagBrush');
const TagInput = require('./TagInput');

/** Sets up a given days tag interface. Wraps an input and a d3 brush behavior and spits out new tags. */
class Tagger {
/** constructor docs */
  constructor({
    svg,
    sel,
    height,
    width,
    scales,
    date,
    onTag,
  }) {
    this.allowBrush = true;
    
    // set up input
    this.tagInput = new TagInput({
      svg,
      sel,
      height,
      width,
      date,
      scales,
      onTag,
    });

    // set up brush
    const tagBrush = new TagBrush({
      svg,
      width,
      height,
      allowBrush: this.allowBrush,
      scales,
      onBrush: (range) => {
        if (this.allowBrush) {
          this.tagInput.move(range);
        }
      },
      onClickOff: () => this.tagInput.hide(),
    });
  }

  /** Updates this days placeholder text */
  changePlaceHolder(tag) {
    console.log('running change placeholder at tagger level.');
    // this.tagInput.changePlaceholder(tag);
  }
};

module.exports = Tagger;
