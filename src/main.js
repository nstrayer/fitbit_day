const SingleDay = require('./SingleDay');
const {groupByDate} = require('./dataHelpers');
const {makeDivForDay, dateToId, makeScales} = require('./chartHelpers');

// Sets up all the individual day plots and
// stores them in an array.
const drawAndStoreDays = ({groupedData, scales, margins, sel, onTag}) =>
  Object.keys(groupedData).map((date) => new SingleDay({
      data: groupedData[date],
      date,
      scales,
      margins,
      onTag,
      sel: makeDivForDay({sel, date}),
    })
  );

// on reciept of a new tag adds it to global tags and sends new tag off to thier respective day's viz.
const newTag = ({
  tag,
  tags,
  dayPlots,
}) => {
  tags.push(tag);

  dayPlots.forEach((day) => day.updateTags(tags));
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
      onTag: (tag) => newTag({tag, tags: this.tags, dayPlots: this.dayPlots}),
    });
  };
}

module.exports = VisualizeDays;
