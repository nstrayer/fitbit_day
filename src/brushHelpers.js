const d3 = require('d3');


const getTimeOfDay = (secs) => {
    const hour = Math.floor(secs / 3600);
    const amPm = hour < 12? 'AM': 'PM';
    const hour12 = hour <= 12 ? hour: hour - 12;
    const mins = Math.floor((secs - (hour*3600)) / 60);
    const minPad = ('0' + mins).substr(mins.toString().length - 1);
    return `${hour12}:${minPad}${amPm}`;
};


// makes an invisible div to be used as the text input for tagging activities. 
const makeTagInput = ({sel}) => {
    const tagBody = sel.append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('text-align', 'left')
      .style('padding', '8px')
      .style('font', '14px optima')
      .style('background', 'lightsteelblue')
      .style('border', 0)
      .style('border-radius', '8px')
      .style('top', '28px');

    const tagText = tagBody
      .append('span');

    // line break to give space
    tagBody.append('br');
    
    const tagInput = tagBody
        .append('input')
        .attr('type', 'text')
        .attr('name', 'activity_tag')
        .style('margin-top', '4px')
    
    // submit button
    tagBody
      .append('input')
      .attr('type', 'submit')
      .attr('value', 'tag')
      .style('margin-left', '3px')

    const changeTime = ([start, end]) => {
      tagText
        .text(
            `Between ${getTimeOfDay(start)} and ${getTimeOfDay(end)} I:`
          );
    };

    const hide = () => {
      tagBody
        .transition()
        .duration(200)
        .style('opacity', 0);
    };

    const move = (position, transition = true) => {
        console.log('im being moved now');
        tagBody.transition()
                .duration(transition? 200: 0)
                .style('opacity', .9)
                .style('left', `${position + 40}px`);
    }
    return {
        move,
        changeTime,
        hide,
        main: tagBody,
        message: tagText,
        input: tagInput,
    };
};

const makeBrush = ({
    width,
    height,
    padding = 15, // This is how much the chart div is padded from the left side of the page. 
    scales,
    tagInput,
    onBrush = (extents) => console.log(extents),
}) => {
    // converts pixel units to seconds into day and passes the extend of our brush to our callback. 
    function brushMove() {
        try {
            const s = d3.event.selection;
            console.log('selection', s);

            const timeRange = s.map((t) => scales.toSeconds(t));
            onBrush(timeRange);

            tagInput.changeTime(timeRange);
            tagInput.move(d3.event.selection[0], false);

        } catch (err) {
            console.log('oops, didn\'t select anything');
        }
    };

    return d3.brushX()
        .extent([[0, 0], [width, height]])
        .on('start', function() {
            console.log('started brushing');
            tagInput.move(d3.event.selection[0]);
        })
        .on('brush', brushMove)
        .on('end', function() {
            tagInput.move(d3.event.selection[0]);
        });
};

module.exports = {
    makeBrush,
    makeTagInput,
};
