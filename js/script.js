let data;
let selectedYears;
let animationRunning = false;
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

  const onInputChange = () => {
    drawCharts(data);
    animationRunning = false;
    d3.select("div#multi-slider").select("button").text("Go!");
  };
  document
    .querySelector("#sort-by-selection")
    .addEventListener("change", onInputChange);

  const checkboxes = document.querySelectorAll(
    "input[type=checkbox][name=variable]"
  );

  checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", onInputChange);
  });

  // platform, genre, and publisher are default values selected
  drawCharts(data);
  return data;
}
