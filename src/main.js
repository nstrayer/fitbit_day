const SingleDay = require('./SingleDay');
const {groupByDate} = require('./dataHelpers');
const {makeDiv, makeScales} = require('./chartHelpers');
const {Set1: colors} = require('colorbrewer');


// on reciept of a new tag adds it to global tags and sends new tag off to thier respective day's viz.
const newTag = ({tag, tags, tagColors, colorScale, dayPlots}) => {
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
    dayWidth = window.innerWidth,
    dayMargins = {left: 40, right: 80, top: 60, bottom: 30},
    yMax = 200,
  } = config;

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
    width: dayWidth,
    margins: dayMargins,
  });

  // behavior once a tag is made.
  const onTag = (tag) =>
    newTag({
      tag,
      tags,
      tagColors,
      colorScale,
      dayPlots,
    });

  // when user deletes a tag. 
  const onTagDelete = (tag) => {
    // remove the deleted tag from array of tags
    tags = tags.filter((t) => t !== tag);
    // redraw tags
    dayPlots.forEach((day) => day.updateTags({tags}));
  };

  // append the tag legend
  makeDiv({sel, id: 'tag_legend'});

  // scan over dates and initialize a new visualization for each day.
  dayPlots = Object.keys(groupedData).map(
    (date) =>
      new SingleDay({
        data: groupedData[date],
        date,
        scales,
        margins: dayMargins,
        height: dayHeight,
        width: dayWidth,
        sel: makeDiv({sel, id: date}),
        onTag,
        onTagDelete,
      })
  );

  const resize = ({width, height = dayHeight}) => {
    // send command to resize each day
    dayPlots.forEach((day) => day.resize({width, height}));
  };

  window.addEventListener('resize', () => resize({width: window.innerWidth}) );

  return {
    resize,
  };
};

module.exports = VisualizeDays;
