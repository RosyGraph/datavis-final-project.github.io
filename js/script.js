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

  d3.select("#tooltip-div")
    .append("svg")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "lightblue")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .attr("height", 20)
    .attr("width", 450);

  const onInputChange = () => {
    drawCharts(data);
    animationRunning = false;
    d3.select("div#multi-slider").select("button").text("Go!");
  };
  document
    .querySelector("#sort-by-selection")
    .addEventListener("change", onInputChange);

  const checkboxes = d3.selectAll("input[type=checkbox][name=variable]");

  const limitCheckBoxes = (e) => {
    const limit = 4;
    const checkedcount = checkboxes.nodes().filter((e) => e.checked).length;
    if (e && checkedcount > limit) {
      e.target.checked = false;
    } else onInputChange();
  };

  checkboxes.on("change", limitCheckBoxes);
  limitCheckBoxes();
  drawCharts(data);
  return data;
}
