function renderMultislider(data) {
  const years = data.map((d) => +d.Year);
  selectedYears = d3.extent(years);
  const div = d3.select("div#multi-slider");
  const button = div.select("button");
  const sliderRange = d3
    .sliderBottom()
    .min(d3.min(years))
    .max(d3.max(years))
    .width(200)
    .marks(years.sort(d3.ascending))
    .ticks(3)
    .tickFormat(d3.format(".0f"))
    .default(d3.extent(years))
    .fill("#2196f3")
    .on("onchange", (d) => {
      button.attr("disabled", d[0] === d[1] || null);
      selectedYears = d;
      drawCharts(data);
    });

  const gRange = div
    .append("svg")
    .attr("width", "100%")
    .attr("height", "60%")
    .append("g")
    .attr("transform", "translate(30,30)");

  gRange.call(sliderRange);
  button.on("click", () => {
    animationRunning = !animationRunning;
    if (animationRunning) {
      animateBarchart(data);
      button.text("Stop");
    } else {
      button.text("Go!");
    }
  });
}
