// const d3 = require('d3');
const {secondsToTime} = require('./timeHelpers');

/* Is supplied with a svg object and some config options and then exposes 
 *  a way of plotting tagged events when supplied with an array of tags. 
 */

const TagViz = (config) => {
  const {svg, scales, height, barThickness = 25} = config;

  const tagG = svg.append('g').attr('class', 'tags_container');

  const trans = d3.transition().duration(750);

  // this is an ugly concatnation of functions I use a bit.
  const secToPlot = (secs) => scales.x(secondsToTime(secs));

  const draw = (tags) => {
    // JOIN data to our tags holder
    const tagBars = tagG.selectAll('.tag_bar').data(tags, (d) => d.start);

    // EXIT old tags not present in new data.
    tagBars.exit().transition(trans).style('fill-opacity', 1e-6).remove();

    // UPDATE elements that were still there, not sure when this happens
    tagBars
      .style('fill', (d) => d.color)
      .attr('x', (d) => secToPlot(d.start))
      .attr('width', (d) => secToPlot(d.end) - secToPlot(d.start));

    // ENTER new tags
    tagBars
      .enter()
      .append('rect')
      .attr('class', 'tag_bar')
      .style('fill-opacity', '0.5')
      .attr('y', height)
      .attr('rx', barThickness * 0.5)
      .attr('ry', barThickness * 0.5)
      .attr('height', barThickness)
      .attr('width', 1e-6)
      .style('fill', (d) => d.color)
      .attr('x', (d) => secToPlot(d.start))
      .on('mouseover', (d) => {
        console.log(d.tag);
      })
      .transition(trans)
      .attr('width', (d) => secToPlot(d.end) - secToPlot(d.start));
  };

  return {draw};
};

module.exports = TagViz;
