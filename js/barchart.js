function displayYear(data, year) {
  const height = 400,
    width = 600;
  const margin = { top: 20, bottom: 20, left: 30, right: 20 };
  const innerHeight = height - margin.top - margin.bottom,
    innerWidth = width - margin.left - margin.right;
  const filtered = data.filter((d) => {
    return +d.Year === year;
  });
  const grouped = groupByPlatform(filtered);
  const x = d3
    .scaleBand()
    .domain(grouped.map((g) => g.platform))
    .range([0, innerWidth])
    .padding(0.2);
  const y = d3
    .scaleLinear()
    .range([innerHeight, 0])
    .domain([0, Math.ceil(d3.max(grouped.map((g) => g.sales)))]);
  const color = d3
    .scaleOrdinal(d3.schemeCategory10)
    .domain(grouped.map((g) => g.platform));
  const svg = d3.select("#barchart-svg");
  svg
    .append('g')
    .selectAll("text")
    .data([year])
    .join("text")
    .attr("x", width - margin.left)
    .attr("y", margin.top)
    .text((d) => d)
    .classed("label", true);
  svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${innerHeight + margin.top})`)
    .call(d3.axisBottom(x));
  svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .call(d3.axisLeft(y));
  svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .selectAll("rect")
    .data(grouped)
    .join("rect")
    .attr("x", (d) => x(d.platform))
    .attr("y", (d) => y(d.sales))
    .attr("width", x.bandwidth())
    .attr("height", (d) => y(0) - y(d.sales))
    .attr("fill", (d) => color(d.platform));
  console.log(grouped);
}

function groupByPlatform(data) {
  const platforms = Array.from(new Set(data.map((d) => d.Platform)));
  return platforms.map((platform) => {
    return {
      platform: platform,
      sales: data
        .filter((d) => d.Platform === platform)
        .map((d) => {
          return !d.Global_Sales ? 0 : +d.Global_Sales;
        })
        .reduce((p, c) => p + c, 0),
    };
  });
}
