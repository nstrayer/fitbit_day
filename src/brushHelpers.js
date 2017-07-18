const d3 = require('d3');

const getTimeOfDay = (secs) => {
  const hour = Math.floor(secs / 3600);
  const amPm = hour < 12 ? 'AM' : 'PM';
  const hour12 = hour <= 12 ? hour : hour - 12;
  const mins = Math.floor((secs - hour * 3600) / 60);
  const minPad = ('0' + mins).substr(mins.toString().length - 1);
  return `${hour12}:${minPad}${amPm}`;
};

/** Makes an invisible div to be used as the text input for tagging activities.
 * Also handles a good amount of the logic behind using this tagging interface. 
 */
class TagInput {
  /** Only requires the d3 selection of the div the visualization is in.*/
  constructor({
    svg,
    sel,
    height,
    width,
    scales,
    onTag = (e) => console.log(e),
  }) {
    // Variable to store the time ranges for selections. In seconds into day.
    this.sel = sel;
    this.timeRange = [];
    this.onTag = onTag;

    // Initialize the brush for actual highlighting
    makeBrush({
      svg,
      width,
      height,
      tagInput: this,
      onTag,
      scales,
    });

    // Main container div for all selection.
    this.tagBody = sel
      .append('div')
      .style('position', 'absolute')
      .style('text-align', 'left')
      .style('padding', '8px')
      .style('font', '14px optima')
      .style('background', 'lightsteelblue')
      .style('border', 0)
      .style('display', 'none')
      .style('border-radius', '8px')
      .style('top', '28px');

    this.tagText = this.tagBody.append('span');

    // line break to give space
    this.tagBody.append('br');

    this.tagForm = this.tagBody.append('form');

    // Wrap tagging in a form element to allow for enter to be used to submit a tag.
    this.tagInput = this.tagForm
      .append('input')
      .attr('type', 'text')
      .attr('name', 'activity_tag')
      .style('margin-top', '4px');

    // submit button
    this.tagForm
      .append('input')
      .attr('type', 'submit')
      .attr('value', 'tag')
      .style('margin-left', '3px');

    // deal with form submit behavior
    this.tagForm.on('submit', () => {
      d3.event.preventDefault();
      const tag = this.tagInput._groups[0][0].value;

      // check to make sure the user put in some form of a tag.
      const tagEmpty = tag === '';
      if (tagEmpty) {
        alert('Please enter a tag label.');
        return;
      }

      // pass info to whatever tagging callback we have.
      this.onTag({
        tag,
        start: this.timeRange[0],
        end: this.timeRange[1],
      });
      this.hide();
    });
  } // end constructor

  /** change the time of our tag window*/
  changeTime([start, end]) {
    // update the time range values
    this.timeRange = [start, end];
    this.tagText.text(
      `Between ${getTimeOfDay(start)} and ${getTimeOfDay(end)}:`
    );
  }

  /** fade tagger to invisible*/
  hide() {
    // hide the tagging container
    this.tagBody
      .transition()
      .duration(200)
      .style('opacity', 0)
      .on('end', function() {
        d3.select(this).style('display', 'none');
      });

    // also hide the brush rectangle d3 auto appends.
    this.sel
      .select('.selection')
      .transition()
      .duration(200)
      .style('fill-opacity', 0)
      .on('end', function() {
        d3.select(this).style('display', 'none').style('fill-opacity', 0.3);
      });
  }

  /** move tagger around. Transition property allows it to be animated or not.*/
  move(position, transition = true) {
    this.tagBody
      .transition()
      .duration(transition ? 200 : 0)
      .style('opacity', 0.9)
      .style('display', 'inline')
      .style('left', `${position + 40}px`);
  }
}

const makeBrush = ({
  svg,
  width,
  height,
  padding = 15, // This is how much the chart div is padded from the left side of the page.
  scales,
  tagInput,
}) => {
  /** converts pixel units to seconds into day and passes the extend of our brush to our callback. */
  function brushMove() {
    try {
      const s = d3.event.selection;
      const timeRange = s.map((t) => scales.toSeconds(t));

      // update our tagging tooltip
      tagInput.changeTime(timeRange);
      tagInput.move(s[0], false);
    } catch (err) {
      console.log('oops, didn\'t select anything');
      tagInput.hide();
    }
  }

  const brush = d3
    .brushX()
    .extent([[0, 0], [width, height]])
    .on('brush end', brushMove);

  svg.append('g').attr('class', 'brush').call(brush);
};

module.exports = {
  makeBrush,
  TagInput,
};
