HTMLWidgets.widget({

  name: 'fitbitViz',

  type: 'output',

  factory: function(el, width, height) {

    // TODO: define shared variables for this instance
    console.log(el, width, height);

    return {

      renderValue: function(x) {
        // convert data frame to d3 friendly format
        var data = HTMLWidgets.dataframeToD3(x.data);
        var domTarget = '#' + el.id;

        console.log('trying to center')
        d3.select(domTarget).style('margin', '0 auto');

        var fitbitPlot = fitbit_viz({
          data: data,
          domTarget: domTarget,
          width: width,
          tagMessage: function(tags, colors){ console.log('new tags', tags, colors) }
        });
      },
      resize: function(width, height) {
        // TODO: code to re-render the widget with a new size

      }

    };
  }
});
