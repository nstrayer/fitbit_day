const d3 = require('d3');

const {
  secondsToTime,
  timeFormat,
  toMonthDay,
} = require('./timeHelpers');

const appendSVG = ({sel, height, width, margins}) =>
  sel
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('user-select', 'none')
    .style('cursor', 'default')
    .append('g')
    .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

const makeScales = ({yMax, height, width, margins}) => {
  const chartWidth = width - margins.left - margins.right;
  const chartHeight = height - margins.top - margins.bottom;
  
  const x = d3
    .scaleTime()
    .domain([secondsToTime(0), secondsToTime(86400)])
    .range([0, chartWidth]);

  const y = d3.scaleLinear()
    .domain([0, yMax])
    .range([chartHeight, 0]);

  // pixels back into seconds.
  const toSeconds = d3
    .scaleLinear()
    .domain([0, chartWidth])
    .range([0, 86400]);

  return {x, y, toSeconds};
};

const drawAxes = ({svg, scales, height, font}) => {
  // Add the X Axis
  svg
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(scales.x).tickFormat(timeFormat));

  // Add the Y Axis
  svg.append('g').call(d3.axisLeft(scales.y).ticks(5));

  // givem a better font
  svg.selectAll('.tick text').attr('font-family', font);
};

const makeLine = ({scales}) =>
  d3.area().x((d) => scales.x(d.x)).y((d) => scales.y(d.y));

const makeArea = ({scales}) =>
  d3
    .area()
    .curve(d3.curveStepAfter)
    .x((d) => scales.x(d.x))
    .y((d) => scales.y(0))
    .y1((d) => scales.y(d.y));

const writeDate = ({date, margins, width, height, svg, font}) =>
  svg
    .append('g')
    .attr('class', 'current_date')
    .attr(
      'transform',
      `translate(${width + margins.right / 3}, ${height / 2} ) rotate(90)`
    )
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('font-family', font)
    .attr('font-size', 20)
    .text(toMonthDay(date));

// The default -s in the dates cant be used as ids in html.
const dateToId = (date) => `date_${date.replace(/-/g, '_')}`;

const makeDivForDay = ({sel, date}) => {
  sel
    .append('div')
    .style('position', 'relative')
    .attr('id', dateToId(date))
    .html('');

  return d3.select('#' + dateToId(date));
};

module.exports = {
  appendSVG,
  makeScales,
  drawAxes,
  makeLine,
  makeArea,
  writeDate,
  dateToId,
  makeDivForDay,
};
