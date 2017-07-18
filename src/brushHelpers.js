const d3 = require('d3');

const getTimeOfDay = (secs) => {
  const hour = Math.floor(secs / 3600);
  const amPm = hour < 12 ? 'AM' : 'PM';
  const hour12 = hour <= 12 ? hour : hour - 12;
  const mins = Math.floor((secs - hour * 3600) / 60);
  const minPad = ('0' + mins).substr(mins.toString().length - 1);
  return `${hour12}:${minPad}${amPm}`;
};

// makes an invisible div to be used as the text input for tagging activities.
const makeTagInput = ({sel}) => {
  const tagBody = sel
    .append('div')
    .attr('class', 'tooltip')
    .style('position', 'absolute')
    .style('text-align', 'left')
    .style('padding', '8px')
    .style('font', '14px optima')
    .style('background', 'lightsteelblue')
    .style('border', 0)
    .style('border-radius', '8px')
    .style('top', '28px');

  const tagText = tagBody.append('span');

  // line break to give space
  tagBody.append('br');

  const tagForm = tagBody.append('form').on('submit', () => {
    // deal with form submit default behavior
    d3.event.preventDefault();
    console.log('user has submitted form');
  });

  // Wrap tagging in a form element to allow for enter to be used to submit a tag.
  const tagInput = tagForm
    .append('input')
    .attr('type', 'text')
    .attr('name', 'activity_tag')
    .style('margin-top', '4px');

  // submit button
  tagForm
    .append('input')
    .attr('type', 'submit')
    .attr('value', 'tag')
    .style('margin-left', '3px');

  // change the time of our tag window
  const changeTime = ([start, end]) => {
    tagText.text(`Between ${getTimeOfDay(start)} and ${getTimeOfDay(end)}:`);
  };

  // fade tagger to invisible
  const hide = () => {
    tagBody
      .transition()
      .duration(200)
      .style('opacity', 0)
      .style('display', 'none');
  };

  // move tagger around. Transition property allows it to be animated or not.
  const move = (position, transition = true) => {
    console.log('im being moved now');
    tagBody
      .transition()
      .duration(transition ? 200 : 0)
      .style('opacity', 0.9)
      .style('display', 'inline')
      .style('left', `${position + 40}px`);
  };

  return {
    move,
    changeTime,
    hide,
    main: tagBody,
    message: tagText,
    input: tagInput,
  };
};

const makeBrush = ({
  width,
  height,
  padding = 15, // This is how much the chart div is padded from the left side of the page.
  scales,
  tagInput,
  onBrush = (extents) => console.log(extents),
}) => {
  /** converts pixel units to seconds into day and passes the extend of our brush to our callback. */
  function brushMove() {
    try {
      const s = d3.event.selection;
      const timeRange = s.map((t) => scales.toSeconds(t));

      // update our tagging tooltip
      tagInput.changeTime(timeRange);
      tagInput.move(s[0], false);

      // do passed action for brushing.
      onBrush(timeRange);
    } catch (err) {
      console.log('oops, didn\'t select anything');
      tagInput.hide();
    }
  }

  return d3
    .brushX()
    .extent([[0, 0], [width, height]])
    .on('brush end', brushMove);
};

module.exports = {
  makeBrush,
  makeTagInput,
};
