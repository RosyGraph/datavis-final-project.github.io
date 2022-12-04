function renderMultislider() {
  const data = mainData.map((d) => +d.Year);
  selectedYears = d3.extent(data);
  const div = d3.select("div#multi-slider");
  const button = div.select("button");
  const sliderRange = d3
    .sliderBottom()
    .min(d3.min(data))
    .max(d3.max(data))
    .width(200)
    .step(1)
    .ticks(3)
    .tickFormat(d3.format(".0f"))
    .default(d3.extent(data))
    .fill("#2196f3")
    .on("onchange", (d) => {
      button.attr("disabled", d[0] === d[1] || null);
      selectedYears = d;
      changeSort();
    });

  const gRange = div
    .append("svg")
    .attr("width", "100%")
    .attr("height", "60%")
    .append("g")
    .attr("transform", "translate(30,30)");

  gRange.call(sliderRange);
  button.on("click", () => {
    console.log(sliderRange.value().map((d) => +d));
  });
}
