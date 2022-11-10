function displayYear(data, year) {
  const height = 400,
    width = 600;
  const margin = { top: 20, bottom: 20, left: 20, right: 20 };
  const innerHeight = height - margin.top - margin.bottom,
    innerWidth = width - margin.left - margin.right;
  const filtered = data.filter((d) => {
    return +d.Year === year;
  });
  const grouped = groupByPlatform(filtered);
  console.log(grouped);
  const x = d3
    .scaleBand()
    .domain(grouped.map((g) => g.platform))
    .range([0, innerWidth]);
  const y = d3
    .scaleLinear()
    .range([0, innerHeight])
    .domain([d3.max(grouped.map((g) => g.sales)), 0]);
  const svg = d3.select("#barchart-svg");
  svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${innerHeight + margin.top})`)
    .call(d3.axisBottom(x));
  svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .call(d3.axisLeft(y));
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
