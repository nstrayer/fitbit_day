// const d3 = require('d3');
const {secondsToTime} = require('./timeHelpers');

/** Is supplied with a svg object and some config options and then exposes 
 *  a way of plotting tagged events when supplied with an array of tags. 
 */
class TagViz {
  /** constructor docs */
  constructor({svg, scales, width, height, barThickness = 25}) {
    this.tagG = svg.append('g').attr('class', 'tags_container');

    this.scales = scales;
    this.width = width;
    this.height = height;
    this.barThickness = barThickness;
    this.trans = d3.transition().duration(750);

    // this is an ugly concatnation of functions I use a bit.
    this.secToPlot = (secs) => scales.x(secondsToTime(secs));
  }

  /** Plots suppied tags on the visualization at the bottom of the chart as a bar.
   * @param {object} tags - an array of objects for tags with elements
   * [ {tag: <tagname>, start: <start in seconds>, end: <end in seconds>}...]
   */
  draw(tags) {
    // JOIN data to our tags holder
    const tagBars = this.tagG.selectAll('.tag_bar').data(tags, (d) => d.start);

    // EXIT old tags not present in new data.
    tagBars.exit().transition(this.trans).style('fill-opacity', 1e-6).remove();

    // UPDATE elements that were still there, not sure when this happens
    tagBars
      .transition(this.trans)
      .style('fill', (d) => d.color)
      .attr('x', (d) => this.secToPlot(d.start));

    // ENTER new tags
    tagBars
      .enter()
      .append('rect')
      .attr('class', 'tag_bar')
      .style('fill-opacity', '0.5')
      .attr('y', this.height)
      .attr('rx', this.barThickness * 0.5)
      .attr('ry', this.barThickness * 0.5)
      .attr('height', this.barThickness)
      .attr('width', 1e-6)
      .style('fill', (d) => d.color)
      .attr('x', (d) => this.secToPlot(d.start))
      .on('mouseover', (d) => {
        console.log(d.tag);
      })
      .transition(this.trans)
      .attr('width', (d) => this.secToPlot(d.end) - this.secToPlot(d.start));
  }
}

module.exports = TagViz;
