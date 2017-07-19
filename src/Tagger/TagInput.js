const d3 = require('d3');
const {getTimeOfDay} = require('../timeHelpers');
const TagBrush = require('./TagBrush');

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
    this.scales = scales;


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
  move([start, end], transition = false) {
    const xPos = this.scales.toSeconds.invert(start);
    this.tagBody
      .transition()
      .duration(transition ? 200 : 0)
      .style('opacity', 0.9)
      .style('display', 'inline')
      .style('left', `${xPos + 40}px`);

    // update text of the time. 
    this.tagText.text(
      `Between ${getTimeOfDay(start)} and ${getTimeOfDay(end)}:`
    );
  }
}

module.exports = TagInput;
