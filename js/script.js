let mainData;
loadData();

function loadData() {
  d3.csv("./data/video_games_dataset.csv").then((data) => {
    mainData = data;
    console.log(mainData);
    setup();
  });
}

function setup() {
  document.querySelector('#sort_by_selection').addEventListener('change', changeSort);
  document.querySelector('#year_selection').addEventListener('change', changeSort);

  d3.select("#barchart-div")
    .append("svg")
    .attr("id", "barchart-svg")
    .classed("barchart", true)
    .attr("height", 400)
    .attr("width", 600);

  d3.select("#barchart-svg")
  .append("g")
  .attr("id", "barchart-year");

  d3.select("#barchart-svg")
  .append("g")
  .attr("id", "barchart-x-axis");

  d3.select("#barchart-svg")
  .append("g")
  .attr("id", "barchart-y-axis");

  d3.select("#barchart-svg")
  .append("g")
  .attr("id", "barchart-content");

  displayYear(mainData);
}

function changeSort() {
  console.log("something has been changed");
  displayYear(mainData);
}