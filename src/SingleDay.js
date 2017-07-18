const d3 = require('d3');

const {
  subsetData,
  appendSVG,
  makeScales,
  drawAxes,
  makeLine,
  makeArea,
  writeDate,
} = require('./helpers');

const {makeBrush, TagInput} = require('./brushHelpers');

/** Takes time series data from a single day and plots a nice little day long series of heartrate and steps together */
class SingleDay {
  /** Takes a bunch of self explanatory variables, but mostly the data as a json file and the date */
  constructor({
    data,
    date,
    domTarget = 'viz',
    height = 200,
    width = 1000,
    yMax = 200,
    lineThickness = 1,
    hrColor = '#8da0cb',
    stepsColor = '#66c2a5',
    font = 'avenir',
    margin = {left: 40, right: 80, top: 60, bottom: 30},
  }) {
    const hrData = subsetData({data, type: 'heart rate'});
    const stepsData = subsetData({data, type: 'steps'});
    const sel = d3.select('#' + domTarget).html('');
    const vizWidth = width - margin.left - margin.right;
    const vizHeight = height - margin.top - margin.bottom;
    const svg = appendSVG({sel, height, width, margin});
    const scales = makeScales({
      raw_data: data,
      data: hrData,
      yMax,
      height: vizHeight,
      width: vizWidth,
    });
    const line = makeLine({scales});
    const area = makeArea({scales});

    const tagInput = new TagInput({
      svg,
      sel,
      height: vizHeight,
      width: vizWidth,
      scales,
    });


    // plot the axes
    drawAxes({svg, scales, height: vizHeight, font});
    writeDate({date, margin, width: vizWidth, height: vizHeight, svg, font});

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

  // method for drawing/redrawing (e.g. on resize)
}

module.exports = SingleDay;
