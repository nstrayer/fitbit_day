const d3 = require('d3');
const moment = require('moment');

const secondsToTime = (secs) => moment()
    .startOf('day')
    .seconds(secs);

const subset_data = ({data, type, x_val = "time", y_val = "value"}) => data
    .filter(d => d.type == type)
    .map(d => ({
        x: secondsToTime(+d[x_val]),
        y: +d[y_val]      
    }));

const appendSVG = ({sel, height, width, margin}) => sel
  .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


const makeScales = ({data, y_max, height, width}) => {
  const x = d3.scaleTime()
    .domain(d3.extent(data, d => d.x))
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([0, y_max])
    .range([height, 0])

  return {x,y}
}

const drawAxes = ({svg, scales, height}) => {
  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(
          d3.axisBottom(scales.x)
            .tickFormat(d3.timeFormat("%I %p"))
      );

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(scales.y));
}

const makeLine = ({scales}) => d3.area()
  .x(d => scales.x(d.x))
  .y(d => scales.y(d.y));

const makeArea = ({scales}) => d3.area()
    .curve(d3.curveStepAfter)
    .x(d => scales.x(d.x))
    .y(d => scales.y(0))
    .y1(d => scales.y(d.y));

module.exports = ({
    subset_data,
    appendSVG,
    makeScales,
    drawAxes,
    makeLine,
    makeArea
});