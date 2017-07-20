const TagBrush = require('./TagBrush');
const TagInput = require('./TagInput');

/** Sets up a given days tag interface. Wraps an input and a d3 brush behavior and spits out new tags. */
const Tagger = ({
    svg,
    sel,
    height,
    width,
    scales,
    date,
    onTag,
  }) => {
  let allowBrush = true;

  // set up input
    const tagInput = new TagInput({
      svg,
      sel,
      height,
      width,
      date,
      scales,
      onTag,
    });

    new TagBrush({
      svg,
      width,
      height,
      allowBrush,
      scales,
      onBrush: (range) => {
        if (allowBrush) {
          tagInput.move(range);
        }
      },
      onClickOff: () => tagInput.hide(),
    });

    const changePlaceHolder = (tag) => {
      tagInput.changePlaceholder(tag);
    };

    return {
      changePlaceHolder,
    };
};


module.exports = Tagger;
