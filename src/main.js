const SingleDay = require('./SingleDay');
const {groupByDate} = require('./dataHelpers');
const {makeDivForDay, dateToId, makeScales} = require('./chartHelpers');
const TagInput = require('./TagInput');

// Sets up all the individual day plots and
// stores them in an object keyed by date.
const drawAndStoreDays = ({groupedData, scales, margins, sel}) =>
  Object.keys(groupedData).reduce((datePlots, date) => {
    // set up a div to place this date in
    const dayDiv = makeDivForDay({sel, date});

    // Assign a plot to the objects slot for the given date.
    datePlots[date] = new SingleDay({
      data: groupedData[date],
      date,
      scales,
      margins,
      sel: dayDiv,
    });
    return datePlots;
  }, {});

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

    // generate a common set of scales for all the days.
    const scales = makeScales({
      yMax,
      height: dayHight,
      width: dayWidth,
      margins: dayMargins,
    });

    // generate plots.
    const dayPlots = drawAndStoreDays({
      groupedData,
      scales,
      margins: dayMargins,
      sel: this.sel,
    });
  };
}

module.exports = VisualizeDays;
