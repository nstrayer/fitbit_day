const SingleDay = require('./SingleDay');
const TagLegend = require('./TagLegend');
const {groupByDate} = require('./dataHelpers');
const {makeDiv, makeScales} = require('./chartHelpers');
const {Set1: colors} = require('colorbrewer');

// on reciept of a new tag adds it to global tags and sends new tag off to thier respective day's viz.
const newTag = ({tag, tags, tagColors, tagLegend, colorScale, dayPlots}) => {
  const tagName = tag.tag;

  // have we seen this tag before?
  const tagSeen = tagColors.hasOwnProperty(tagName);

  // if the tag is new lets assign it a color!
  if (!tagSeen) {
    tagColors[tagName] = colorScale.shift();
  }

  // assign a color to the tag
  tag.color = tagColors[tagName];

  // push it to the big tags list.
  tags.push(tag);

  // update the tag legend
  tagLegend.update(tagColors, tags);

  // send all tags to each day's visualization
  dayPlots.forEach((day) => day.updateTags({tags, lastTag: tagName}));
};

/* Takes multiple day's worth of data and spins out a day viz for each along with
*  some tagging logic to go with it.
*/
const VisualizeDays = (config) => {
  const {
    data,
    domTarget,
    dayHeight = 200,
    dayMargins = {left: 40, right: 80, top: 60, bottom: 30},
    yMax = 200,
    fontFamily = 'optima',
  } = config;
  const getContainerWidth = () => sel._groups[0][0].offsetWidth;
  const groupedData = groupByDate(data);
  const sel = d3.select(domTarget);
  const colorScale = colors[9];

  let dayPlots;
  // stores all the users tags [{tag, date, start, end}, ...]
  let tags = [];
  // Object to relate a tag to a color for plotting.
  let tagColors = {};

  // generate a common set of scales for all the days.
  const scales = makeScales({
    yMax,
    height: dayHeight,
    width: getContainerWidth(),
    margins: dayMargins,
  });

  // append the tag legend
  const tagLegend = TagLegend({
    el: makeDiv({sel, id: 'tag_legend'}),
    tagColors,
    tags,
    fontFamily,
  });

  // behavior once a tag is made.
  const onTag = (tag) =>
    newTag({
      tag,
      tags,
      tagLegend,
      tagColors,
      colorScale,
      dayPlots,
    });

  // when user deletes a tag.
  const onTagDelete = (tag) => {
    // remove the deleted tag from array of tags
    tags = tags.filter((t) => t !== tag);

    // If there is no longer any of a given tag, take it out of the tag colors list.

    // Update tag legend
    tagLegend.update(tagColors, tags);

    // redraw tags
    dayPlots.forEach((day) => day.updateTags({tags}));
  };

  // scan over dates and initialize a new visualization for each day.
  dayPlots = Object.keys(groupedData).map(
    (date) =>
      new SingleDay({
        data: groupedData[date],
        date,
        scales,
        margins: dayMargins,
        height: dayHeight,
        width: getContainerWidth(),
        sel: makeDiv({sel, id: date}),
        onTag,
        onTagDelete,
        fontFamily,
      })
  );

  const resize = () =>
    dayPlots.forEach((day) =>
      day.resize({width: getContainerWidth(), height: dayHeight})
    );

  window.addEventListener('resize', () => {
    resize();
  });

  return {
    resize,
  };
};

module.exports = VisualizeDays;
