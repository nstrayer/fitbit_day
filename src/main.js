const SingleDay = require('./SingleDay');
const {groupByDate} = require('./dataHelpers');
const {makeDivForDay, makeScales} = require('./chartHelpers');
const {Set1: colors} = require('colorbrewer');

// Sets up all the individual day plots and
// stores them in an array.
const drawAndStoreDays = ({groupedData, scales, margins, sel, onTag}) =>
  Object.keys(groupedData).map(
    (date) =>
      new SingleDay({
        data: groupedData[date],
        date,
        scales,
        margins,
        onTag,
        sel: makeDivForDay({sel, date}),
      })
  );

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

/** Main Func */
const VisualizeDays = (config) => {
  const {
    data,
    domTarget,
    dayHight = 200,
    dayWidth = 1000,
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
    height: dayHight,
    width: dayWidth,
    margins: dayMargins,
  });

  // generate plots.
  dayPlots = drawAndStoreDays({
    groupedData,
    scales,
    margins: dayMargins,
    sel,
    onTag: (tag) =>
      newTag({
        tag,
        tags,
        tagColors,
        colorScale,
        dayPlots,
      }),
  });
};

module.exports = VisualizeDays;
