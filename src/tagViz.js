// const d3 = require('d3');
const {secondsToTime} = require('./helpers');
const {Paired} = require('colorbrewer');

/** Is supplied with a svg object and some config options and then exposes 
 *  a way of plotting tagged events when supplied with an array of tags. 
 */
class TagViz {
/** constructor docs */
  constructor({
    svg,
    scales,
    width,
    height,
  }) {
    this.tagG = svg
      .append('g')
      .attr('class', 'tags_container');

    this.colorScale = Paired[12];
    console.log(this.colorScale)
    this.scales = scales;
    this.width = width;
    this.height = height;
    this.trans = d3.transition()
      .duration(750);

    // this is an ugly concatnation of functions I use a bit.
    this.secToPlot = (secs) => scales.x(secondsToTime(secs));
  };

  /** Plots suppied tags on the visualization at the bottom of the chart as a bar.
   * @param {object} tags - an array of objects for tags with elements
   * [ {tag: <tagname>, start: <start in seconds>, end: <end in seconds>}...]
   */
  draw(tags) {
    // find unique tags and then give them colors. 
    const tagColors = [...new Set(tags.map((tag) => tag.tag))]
      .reduce(
        (colorObj, unique, i) => Object.assign(colorObj, {[unique]: this.colorScale[i]}),
        {}
      );

    // JOIN data to our tags holder
    const tagBars = this.tagG
      .selectAll('.tag_bar')
      .data(tags, (d) => d.start);

    // EXIT old tags not present in new data.
    tagBars.exit()
      .transition(this.trans)
      .style('fill-opacity', 1e-6)
      .remove();

    // UPDATE elements that were still there, not sure when this happens
    tagBars
      .transition(this.trans)
      .style('fill', (d) => tagColors[d.tag])
      .attr('x', (d) => this.secToPlot(d.start) );

    // ENTER new tags
    tagBars.enter()
      .append('rect')
      .attr('class', 'tag_bar')
      .style('fill-opacity', '0.5')
      .attr('y', 10)
      .attr('height', 10)
      .attr('width', 1e-6)
      .style('fill', (d) => tagColors[d.tag])
      .attr('x', (d) => this.secToPlot(d.start) )
      .transition(this.trans)
      .attr('width', (d) => this.secToPlot(d.end) - this.secToPlot(d.start) );
    }
};

module.exports = TagViz;
