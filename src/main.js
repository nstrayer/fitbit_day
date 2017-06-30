const d3 = require('d3');
const {
  subset_data,
  appendSVG,
  makeScales,
  drawAxes,
  makeLine,
  makeArea
} = require('./helpers');

class fitbit_day {
  constructor(
    {
      height = 200,
      width = 1000,
      y_max = 200,
      line_thickness = 1,
      hr_color = "#8da0cb",
      steps_color = "#66c2a5",
      data,
      dom_target = "viz",
      margin = {left: 50, right: 50, top: 30, bottom: 30}
    }
  ){

    const hr_data    = subset_data({data, type:"heart rate"}),
          steps_data = subset_data({data, type:"steps"}),
          sel        = d3.select("#" + dom_target).html(''),
          viz_width  = width  - margin.left - margin.right,
          viz_height = height - margin.top - margin.bottom,
          svg        = appendSVG({sel, height, width, margin}),
          scales     = makeScales({data:hr_data, y_max, height:viz_height, width:viz_width}),
          line       = makeLine({scales}),
          area       = makeArea({scales});

    //plot the axes
    drawAxes({svg, scales, height: viz_height});

    const heart_line = svg
      .append('g')
      .append('path')
      .attr("d", line(hr_data))
      .style("stroke", hr_color)
      .style("stroke-width", line_thickness)
      .style("fill", "none");

    const steps_line = svg
      .append('g')
      .append('path')
      .attr("d", area(steps_data))
      .style("fill", steps_color)
      .style("fill-opacity", 0.5)
  }


}

module.exports = fitbit_day;