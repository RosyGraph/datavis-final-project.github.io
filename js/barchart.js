const height = 400,
  width = 600;
const margin = { top: 20, bottom: 20, left: 30, right: 20 };
const innerHeight = height - margin.top - margin.bottom,
  innerWidth = width - margin.left - margin.right;

function displayYear(data) {
  let year = parseInt(d3.select("#year_selection").property("value"));

  function animateBarchart(data) {
    const yearRange = d3.extent(
      data.map((d) => {
        return +d.Year;
      })
    );
    displayYear(data, yearRange[0]);
    displayYear(data, yearRange[1]);
    return data;
  }

  const filtered = data.filter((d) => {
    return +d.Year === year;
  });
  const sort_by = d3.select("#sort_by_selection").property("value");

  const grouped = groupByVariable(filtered, sort_by);

  const x = d3
    .scaleBand()
    .domain(grouped.map((g) => g.key))
    .range([0, innerWidth])
    .padding(0.2);
  const y = d3
    .scaleLinear()
    .range([innerHeight, 0])
    .domain([0, Math.ceil(d3.max(grouped.map((g) => g.sales)))]);
  const color = d3
    .scaleOrdinal(d3.schemeCategory10)
    .domain(grouped.map((g) => g.key));
  const svg = d3.select("#barchart-svg");
  svg
    .select("#barchart-year")
    .selectAll("text")
    .data([year])
    .join("text")
    .attr("x", width - margin.left)
    .attr("y", margin.top)
    .text((d) => d);
  svg
    .selectAll("g.x-axis")
    .data([data])
    .join("g")
    .classed("x-axis", true)
    .attr("transform", `translate(${margin.left}, ${innerHeight + margin.top})`)
    .call(d3.axisBottom(x));
  svg
    .selectAll("g.y-axis")
    .data([data])
    .join("g")
    .classed("y-axis", true)
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .call(d3.axisLeft(y));
  svg
    .selectAll("g.rects")
    .data([data])
    .join("g")
    .classed("rects", true)
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .selectAll("rect")
    .data(grouped)
    .join("rect")
    .attr("x", (d) => x(d.key))
    .attr("width", x.bandwidth())
    .attr("fill", (d) => color(d.key))
    .transition()
    .duration(1000)
    .attr("y", (d) => y(d.sales))
    .attr("height", (d) => y(0) - y(d.sales));
  console.log(grouped);
}

function updateBarChart() {}

function groupByVariable(data, variable) {
  const attributes = Array.from(new Set(data.map((d) => d[variable])));
  return attributes.map((attribute) => {
    return {
      key: attribute,
      sales: data
        .filter((d) => d[variable] === attribute)
        .map((d) => {
          return !d.Global_Sales ? 0 : +d.Global_Sales;
        })
        .reduce((p, c) => p + c, 0),
    };
  });
}
