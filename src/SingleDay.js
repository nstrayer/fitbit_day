const d3 = require('d3');

const {
  subsetData,
} = require('./dataHelpers');

const {
  appendSVG,
  drawAxes,
  makeLine,
  makeArea,
  writeDate,
} = require('./chartHelpers');

const Tagger = require('./Tagger/Tagger');
const TagViz = require('./TagViz');

/** Takes time series data from a single day and plots a nice little day long series of heartrate and steps together */
class SingleDay {
  /** Takes a bunch of self explanatory variables, but mostly the data as a json file and the date 
   * @param {Array} data - This is an array of objects with keys "hr", "steps", and "time".
   * @param {String} date - String of the date in MM-DD-YYYY format. 
   * @param {Object} scales - Object housing three d3 scales: x, y, and toSeconds
   * @param {Object} margins - Follows the standard d3 margin conventions. Gives padding on each side of chart. 
   * @param {Number} [height = 200] - height in pixels of the days plot
   * @param {Number} [width = 1000] - Width in pixels of days plot
   * @param {Number} [lineThickness = 1] - Plot line thickness. 
   * @param {String} [hrColor = '#8da0cb'] - Hex code for heartrate line color
   * @param {String} [stepsColor = '#66c2a5'] - Hex code for steps bar color.
   * @param {String} [font = 'avenir'] - Valid css name for a font for axes. 
  */
  constructor({
    data,
    date,
    scales,
    margins,
    sel,
    onTag,
    height = 200,
    width = 1000,
    lineThickness = 1,
    hrColor = '#8da0cb',
    stepsColor = '#66c2a5',
    font = 'avenir',
  }) {
    this.date = date;
    const hrData = subsetData({data, type: 'heart rate'});
    const stepsData = subsetData({data, type: 'steps'});
    const vizWidth = width - margins.left - margins.right;
    const vizHeight = height - margins.top - margins.bottom;
    const svg = appendSVG({sel, height, width, margins});
    const line = makeLine({scales});
    const area = makeArea({scales});

    // set up a tagging system for this day
    this.tagger = Tagger({
      svg,
      sel,
      date,
      width: vizWidth,
      height: vizHeight,
      scales,
      onTag,
    });

    this.tagViz = TagViz({
      svg,
      scales,
      height: vizHeight,
    });

    // plot the axes
    drawAxes({svg, scales, height: vizHeight, font});
    writeDate({date, margins, width: vizWidth, height: vizHeight, svg, font});

    // heart rate line
    svg
      .append('g')
      .append('path')
      .attr('d', line(hrData))
      .style('stroke', hrColor)
      .style('stroke-width', lineThickness)
      .style('fill', 'none');

    // steps line
    svg
      .append('g')
      .append('path')
      .attr('d', area(stepsData))
      .style('fill', stepsColor)
      .style('fill-opacity', 0.5);
  }

  /** Gets new tags and visualizes them */
  updateTags({tags, lastTag}) {
    // filter tags to this day
    const todaysTags = tags.filter((tag) => tag.date === this.date);
    this.tagViz.draw(todaysTags);
    this.tagger.changePlaceHolder(lastTag);
  }
  // method for drawing/redrawing (e.g. on resize)
}

module.exports = SingleDay;
