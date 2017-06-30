const d3 = require('d3');
const {
  appendSVG,
  makeScales,
  drawAxes,
} = require('./helpers');

class fitbit_day {
  constructor(
    {
      height = 200,
      width = 500,
      y_max = 200,
      data,
      dom_target = "viz",
      margin = {left: 50, right: 50, top: 30, bottom: 30}
    }
  ){

    const sel        = d3.select("#" + dom_target).html(''),
          viz_width  = width  - margin.left - margin.right,
          viz_height = height - margin.top - margin.bottom,
          svg        = appendSVG({sel, height, width, margin}),
          scales     = makeScales({data, y_max, height:viz_height, width:viz_width});

    //plot the axes
    drawAxes({svg, scales, height: viz_height});

    console.log(viz_height)
  
  }

}

module.exports = fitbit_day;