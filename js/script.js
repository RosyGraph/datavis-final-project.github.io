let mainData;
let selectedYears;
loadData();

function loadData() {
  d3.csv("./data/video_games_dataset.csv").then(setup);
}

function setup(data) {
  renderMultislider(data);
  d3.select("#legend-div")
    .append("svg")
    .attr("id", "legend-svg")
    .classed("legend", true)
    .attr("height", 600)
    .attr("width", 200);

  // add event listeners to objects in the toolbox
  document
    .querySelector("#sort-by-selection")
    .addEventListener("change", drawCharts(data));

  // Select all checkboxes with the name 'variable' using querySelectorAll.
  const checkboxes = document.querySelectorAll(
    "input[type=checkbox][name=variable]"
  );

  checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
      drawCharts(data);
    });
  });

  // platform, genre, and publisher are defualt values selected
  drawCharts(data);
  return data;
}
