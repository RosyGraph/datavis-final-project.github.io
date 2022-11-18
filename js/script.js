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
  // add event listeners to objects in the toolbox
  document
    .querySelector("#sort_by_selection")
    .addEventListener("change", changeSort);
  document
    .querySelector("#year_selection")
    .addEventListener("change", changeSort);

  // Select all checkboxes with the name 'variable' using querySelectorAll.
  let checkboxes = document.querySelectorAll(
    "input[type=checkbox][name=variable]"
  );
  let enabledSettings = [];
  // Use Array.forEach to add an event listener to each checkbox.
  checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
      enabledSettings = Array.from(checkboxes) // Convert checkboxes to an array to use filter and map.
        .filter((i) => i.checked) // Use Array.filter to remove unchecked checkboxes.
        .map((i) => i.id); // Use Array.map to extract only the checkbox values from the array of objects.
      console.log(enabledSettings);
    });
  });

  d3.select("#legend-div")
    .append("svg")
    .attr("id", "legend-svg")
    .classed("legend", true)
    .attr("height", 200)
    .attr("width", 600);

  d3.select("#barchart-div")
    .append("svg")
    .attr("id", "barchart-svg")
    .classed("barchart", true)
    .attr("height", 400)
    .attr("width", 600);

  d3.select("#barchart-svg").append("g").attr("id", "barchart-title");
  d3.select("#barchart-svg").append("g").attr("id", "barchart-year");
  d3.select("#barchart-svg").append("g").attr("id", "barchart-x-axis");
  d3.select("#barchart-svg").append("g").attr("id", "barchart-y-axis");
  d3.select("#barchart-svg").append("g").attr("id", "barchart-content");

  displayYear(mainData);
}

function addChart() {}

function changeSort() {
  displayYear(mainData);
}
