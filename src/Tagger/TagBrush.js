const d3 = require('d3');

const {getTimeOfDay} = require('../timeHelpers');


/** Attaches to a single day and initializes a 2d brush on it.
 * Containers helpers to allow for ease of enabling and disabling the brushes
 */
class TagBrush {
  /** constructor docs */
  constructor({
    svg,
    width,
    height,
    allowBrush = true,
    padding = 15, // This is how much the chart div is padded from the left side of the page.
    scales,
    onBrush,
    onClickOff,
  }) {
    // defaults to allowing brushing on every visualization. 
    this.allowBrush = allowBrush;

    // set up brushing function. 
    this.brush = d3
      .brushX()
      .extent([[0, 0], [width, height]])
      .on('brush end', function() {
        // if the brush selection is a region
        try {
          const s = d3.event.selection;
          const timeRange = s.map((t) => scales.toSeconds(t));
          // Behavior when brush extent is valid.
          onBrush(timeRange);
        } catch (err) {
          // When the user has just clicked elsewhere.
          onClickOff();
        }
      });

    svg.append('g').attr('class', 'brush').call(this.brush);
  };

  /** Switch on brush */
  turnOn() {
    this.allowBrush = true;
  };

  /** disable brush */
  turnOff() {
    this.allowBrush = false;
  }
};


module.exports = TagBrush;

