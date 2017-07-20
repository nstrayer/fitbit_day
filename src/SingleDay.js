const {subsetData} = require('./dataHelpers');

const {
  setUpSVG,
  drawAxes,
  makeLine,
  makeArea,
  writeDate,
} = require('./chartHelpers');

const Tagger = require('./Tagger/Tagger');
const TagViz = require('./TagViz');

/* Takes a bunch of self explanatory variables, but mostly the data as a json file and the date 
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
const SingleDay = (config) => {
  const {
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
  } = config;

  const hrData = subsetData({data, type: 'heart rate'});
  const stepsData = subsetData({data, type: 'steps'});
  const vizWidth = width - margins.left - margins.right;
  const vizHeight = height - margins.top - margins.bottom;
  const {svg, resizeSvg} = setUpSVG({sel, height, width, margins});
  const line = makeLine({scales});
  const area = makeArea({scales});
  const hrG = svg.append('g').attr('class', 'hr_plot');
  const stepsG = svg.append('g').attr('class', 'steps_plot');
  const axes = drawAxes({svg, scales, height: vizHeight, font});
  const dateLabel = writeDate({date, margins, width: vizWidth, height: vizHeight, svg, font});
  
  const drawHeartRate = () => {
    // grab the correct g element
    const hrLine = hrG.selectAll('path').data([hrData]);

    // Update existing line
    hrLine.attr('d', line);

    // ENTER new line
    hrLine
      .enter()
      .append('path')
      .attr('d', line)
      .style('stroke', hrColor)
      .style('stroke-width', lineThickness)
      .style('fill', 'none');
  };

  const drawSteps = () => {
    const stepLine = stepsG.selectAll('path').data([stepsData]);

    // Update existing line
    stepLine.attr('d', area);

    // ENTER new line
    stepLine
      .enter()
      .append('path')
      .attr('d', area)
      .style('fill', stepsColor)
      .style('fill-opacity', 0.5);
  };

  /* Draw it all */
  const drawViz = () => {
    drawHeartRate();
    drawSteps();
  };

  // set up a tagging system for this day
  const tagger = Tagger({
    svg,
    sel,
    date,
    width: vizWidth,
    height: vizHeight,
    scales,
    onTag,
  });

  // Now the tag visualization
  const tagViz = TagViz({
    svg,
    scales,
    height: vizHeight,
  });

  

  drawViz();

  /** Gets new tags and visualizes them */
  const updateTags = ({tags, lastTag}) => {
    // filter tags to this day
    const todaysTags = tags.filter((tag) => tag.date === date);
    tagViz.draw(todaysTags);
    tagger.changePlaceHolder(lastTag);
  };

  return {updateTags};
};

module.exports = SingleDay;
