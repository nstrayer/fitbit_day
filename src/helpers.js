const d3 = require('d3');

const appendSVG = ({sel, height, width, margin}) => sel
  .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



const makeScales = ({data, y_max, height, width}) => {
  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.x))
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([d3.min(data, d => d.y), y_max])
    .range([height, 0])

  return {x,y}
}

const drawAxes = ({svg, scales, height}) => {
  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(scales.x));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(scales.y));
}

module.exports = ({
    appendSVG,
    makeScales,
    drawAxes
});