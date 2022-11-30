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
  // year slider
  let rangeslider = document.getElementById("sliderRange");
  let output = document.getElementById("yearValue");
  let bubble = document.getElementById("bubble");
  output.innerHTML = rangeslider.value;
  bubble.innerHTML = rangeslider.value;
  rangeslider.oninput = function () {
    bubble.innerHTML = this.value;
  };
  rangeslider.onchange = function () {
    output.innerHTML = this.value;
    changeSort();
  };

  // add legend svg
  d3.select("#legend-div")
    .append("svg")
    .attr("id", "legend-svg")
    .classed("legend", true)
    .attr("height", 200)
    .attr("width", 600);

  // add event listeners to objects in the toolbox
  document
    .querySelector("#sort-by-selection")
    .addEventListener("change", changeSort);

  // Select all checkboxes with the name 'variable' using querySelectorAll.
  let checkboxes = document.querySelectorAll(
    "input[type=checkbox][name=variable]"
  );

  // Use Array.forEach to add an event listener to each checkbox.
  checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
      changeSort();
    });
  });

  // platform, genre, and publisher are defualt values selected
  changeSort();
}

// Called when sort by, year, or variables change
function changeSort() {
  // Select all checkboxes with the name 'variable' using querySelectorAll.
  let checkboxes = document.querySelectorAll(
    "input[type=checkbox][name=variable]"
  );
  let enabledVariables = [];
  enabledVariables = Array.from(checkboxes) // Convert checkboxes to an array to use filter and map.
    .filter((i) => i.checked) // Use Array.filter to remove unchecked checkboxes.
    .map((i) => i.id); // Use Array.map to extract only the checkbox values from the array of objects.

  drawCharts(mainData, enabledVariables);
}
