// const d3 = require('d3');
const {secondsToTime} = require('./timeHelpers');

/* Is supplied with a svg object and some config options and then exposes 
 *  a way of plotting tagged events when supplied with an array of tags. 
 */

const TagViz = (config) => {
  const {svg, scales, height, barThickness = 25} = config;

  const tagG = svg.append('g').attr('class', 'tags_container');

  // giving the transition a name avoids conflicts
  const trans = (name = 'sliding') => d3.transition(name)
    .duration(750);

  // this is an ugly concatnation of functions I use a bit.
  const secToPlot = (secs) => scales.x(secondsToTime(secs));

  const expandBar = (tagbar) => tagbar
      .transition(trans('expanding'))
      .style('fill-opacity', 0.85)
      .attr('height', 3*barThickness)
      .attr('y', height - 2*barThickness);

  const shrinkBar = (tagbar) => tagbar
      .transition(trans('shrinking'))
      .style('fill-opacity', 0.5)
      .attr('height', barThickness)
      .attr('y', height);
      
  /** Behavior when individual tag is moused over */
  function onMouseover(selectedTag) {
    console.log(this);
    const tagBar = d3.select(this);
    // const bar

    // slide bar up to show info. 
    expandBar(tagBar);

    console.log(selectedTag);
  }
  /** Behavior when individual tag is moused off */
  function onMouseout(selectedTag) {
    const tagBar = d3.select(this);
    // slide bar up back to normal size
    shrinkBar(tagBar);
  }

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
      .on('mouseover', onMouseover)
      .on('mouseout', onMouseout)
      .transition(trans)
      .attr('width', (d) => secToPlot(d.end) - secToPlot(d.start));
  };

  return {draw};
};

module.exports = TagViz;
