const d3 = require('d3');
const moment = require('moment');

const secondsToTime = (secs) => moment()
    .startOf('day')
    .seconds(secs);

const subset_data = ({data, type, x_val = "time", y_val = "value"}) => data
    .filter(d => d.type == type)
    .map(d => ({
        x: secondsToTime(+d[x_val]),
        y: +d[y_val]      
    }));

const appendSVG = ({sel, height, width, margin}) => sel
  .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


const makeScales = ({
    raw_data,
    data, 
    y_max, 
    height, 
    width
}) => {
  const x = d3.scaleTime()
    .domain([secondsToTime(0), secondsToTime(86400)])
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([0, y_max])
    .range([height, 0])

  //pixels back into seconds. 
  const toSeconds = d3.scaleLinear()
    .domain([0, width])
    .range(d3.extent(raw_data, d => +d.time))
    
  return {x,y,toSeconds}
}

const drawAxes = ({svg, scales, height, font}) => {
  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(
          d3.axisBottom(scales.x)
            .tickFormat(d3.timeFormat("%I %p"))
      );

  // Add the Y Axis
  svg.append("g")
      .call(
          d3.axisLeft(scales.y)
            .ticks(5)
      );

  //givem a better font
  svg.selectAll(".tick text")
    .attr("font-family", font)
}

const makeLine = ({scales}) => d3.area()
  .x(d => scales.x(d.x))
  .y(d => scales.y(d.y));

const makeArea = ({scales}) => d3.area()
    .curve(d3.curveStepAfter)
    .x(d => scales.x(d.x))
    .y(d => scales.y(0))
    .y1(d => scales.y(d.y));

const makeBrush = ({
    width, 
    height, 
    scales,
    onBrush = (extents) => console.log(extents)
}) => {

    //converts pixel units to seconds into day and passes the extend of our brush to our callback. 
    function brushMove() {
        try {
            const s = d3.event.selection;
            const time_range = s.map( t => scales.toSeconds(t) );
            onBrush(time_range)
        } catch (err) { 
            console.log("oops, didn't select anything")
        }
        
    }

    return d3.brushX()
    .extent([[0, 0], [width, height]])
    .on("start brush end", brushMove);
}

const writeDate = ({date, margin, width, height,svg, font}) => svg
    .append("g")
    .attr("class", "current_date")
    .attr("transform", `translate(${width + margin.right/3}, ${height/2} ) rotate(90)`)
    .append("text")
        .attr("text-anchor", "middle")
        .attr("font-family", font)
        .attr("font-size", 20)
        .text(moment(date).format("MMM  DD"));

module.exports = ({
    subset_data,
    appendSVG,
    makeScales,
    drawAxes,
    makeLine,
    makeArea,
    makeBrush,
    writeDate
});