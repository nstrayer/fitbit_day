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

/** Main Class docs */
class VisualizeDays {
  /** constructor docs */
  constructor({
    data,
    domTarget,
    height = 200,
    width = 1000,
    dayHight = 200,
    dayWidth = 1000,
    dayMargins = {left: 40, right: 80, top: 60, bottom: 30},
    yMax = 200,
  }) {
    const groupedData = groupByDate(data);
    this.sel = d3.select(domTarget);
    this.dayPlots;

    // stores all the users tags [{tag, date, start, end}, ...]
    this.tags = [];
    this.colorScale = colors[9];
    this.tagColors = {};

    // generate a common set of scales for all the days.
    const scales = makeScales({
      yMax,
      height: dayHight,
      width: dayWidth,
      margins: dayMargins,
    });

    // generate plots.
    this.dayPlots = drawAndStoreDays({
      groupedData,
      scales,
      margins: dayMargins,
      sel: this.sel,
      onTag: (tag) =>
        newTag({
          tag,
          tags: this.tags,
          tagColors: this.tagColors,
          colorScale: this.colorScale,
          dayPlots: this.dayPlots,
        }),
    });
  }
}

module.exports = VisualizeDays;
