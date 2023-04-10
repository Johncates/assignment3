const scatterplotWidth = 600;
const scatterplotHeight = 400;
const barchartWidth = 300;
const barchartHeight = 400;
const margin = { top: 20, right: 20, bottom: 40, left: 50 };

d3.csv("africa_country_profile_variables.csv", function (error, data) {
    if (error) throw error;

    const regionMap = d3.group(data, (d) => d.Region);
    const regionData = Array.from(regionMap, ([key, value]) => ({
        region: key,
        countries: value,
        count: value.length,
    }));
    class Barchart {
        constructor(data) {
            this.data = data;
            this.regionAttr = "Region";
            this.numCountriesAttr = "Num_Countries";
            this.colorScale = d3.scaleOrdinal(d3.schemeCategory10);
            this.regionScale = d3
                .scaleBand()
                .domain(this.data.map((d) => d[this.regionAttr]))
                .range([margin.left, barchartWidth - margin.right])
                .padding(0.1);
            this.numCountriesScale = d3
                .scaleLinear()
                .domain([0, d3.max(this.data, (d) => d[this.numCountriesAttr])])
                .range([barchartHeight - margin.bottom, margin.top]);
        }

        update(regionData) {
            this.data = regionData;

            this.numCountriesScale.domain([0, d3.max(this.data, (d) => d[this.numCountriesAttr])]);

            d3.select("#barchart")
                .select("svg")
                .select(".y-axis")
                .transition()
                .duration(1000)
                .call(d3.axisLeft(this.numCountriesScale));

            d3.select("#barchart")
                .select("svg")
                .selectAll(".bar")
                .data(this.data)
                .join(
                    (enter) =>
                        enter
                            .append("rect")
                            .attr("class", "bar")
                            .attr("x", (d) => this.regionScale(d[this.regionAttr]))
                            .attr("y", (d) => this.numCountriesScale(d[this.numCountriesAttr]))
                            .attr("width", this.regionScale.bandwidth())
                            .attr("height", (d) => barchartHeight - margin.bottom - this.numCountriesScale(d[this.numCountriesAttr]))
                            .attr("fill", (d) => this.colorScale(d[this.regionAttr])),
                    (update) =>
                        update
                            .transition()
                            .duration(1000)
                            .attr("x", (d) => this.regionScale(d[this.regionAttr]))
                            .attr("y", (d) => this.numCountriesScale(d[this.numCountriesAttr]))
                            .attr("width", this.regionScale.bandwidth())
                            .attr("height", (d) => barchartHeight - margin.bottom - this.numCountriesScale(d[this.numCountriesAttr]))
                            .attr("fill", (d) => this.colorScale(d[this.regionAttr])),
                    (exit) => exit.remove()
                );
        }
    }

    class Scatterplot {
        constructor(data) {
            this.data = data;
            this.xAttr = "GDP_Per_Capita";
            this.yAttr = "Life_Expectancy";
            this.radiusAttr = "Population";
            this.colorAttr = "Region";
            this.xScale = d3
                .scaleLinear()
                .domain(d3.extent(this.data, (d) => d[this.xAttr]))
                .range([margin.left, scatterplotWidth - margin.right]);
            this.yScale = d3
                .scaleLinear()
                .domain(d3.extent(this.data, (d) => d[this.yAttr]))
                .range([scatterplotHeight - margin.bottom, margin.top]);
            this.radiusScale = d3
                .scaleSqrt()
                .domain(d3.extent(this.data, (d) => d[this.radiusAttr]))
                .range([3, 20]);
            this.colorScale = d3.scaleOrdinal(d3.schemeCategory10);
        }

        render() {
            const svg = d3
                .select("#scatterplot")
                .append("svg")
                .attr("width", scatterplotWidth)
                .attr("height", scatterplotHeight);

            svg
                .append("g")
                .attr("transform", `translate(0,${scatterplotHeight - margin.bottom})`)
                .call(d3.axisBottom(this.xScale));

            svg
                .append("g")
                .attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(this.yScale));

            svg
                .selectAll("circle")
                .data(this.data)
                .join("circle")
                .attr("cx", (d) => this.xScale(d[this.xAttr]))
                .attr("cy", (d) => this.yScale(d[this.yAttr]))
                .attr("r", (d) => this.radiusScale(d[this.radiusAttr]))
                .attr("fill", (d) => this.colorScale(d[this.colorAttr]));
        }

        updateX(attr) {
            this.xAttr = attr;
            this.xScale = d3
                .scaleLinear()
                .domain(d3.extent(this.data, (d) => d[this.xAttr]))
                .range([margin.left, scatterplotWidth - margin.right]);

            d3.select("#scatterplot")
                .select("svg")
                .select(".x-axis")
                .transition()
                .duration(1000)
                .call(d3.axisBottom(this.xScale));
            d3.select("#scatterplot")
                .select("svg")
                .selectAll(".circle")
                .transition()
                .duration(1000)
                .attr("cx", (d) => this.xScale(d[this.xAttr]));
        }
    }
})
updateY(attr)
{
    this.yAttr = attr;
    this.yScale = d3
        .scaleLinear()
        .domain(d3.extent(this.data, (d) => d[this.yAttr]))
        .range([scatterplotHeight - margin.bottom, margin.top]);

    d3.select("#scatterplot")
        .select("svg")
        .select(".y-axis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(this.yScale));
    d3.select("#scatterplot")
        .select("svg")
        .selectAll("circle")
        .data(this.data)
        .transition()
        .duration(1000)
        .attr("cy", (d) => this.yScale(d[this.yAttr]));
}

updateRadius(attr)
{
    this.radiusAttr = attr;
    this.radiusScale = d3
        .scaleSqrt()
        .domain(d3.extent(this.data, (d) => d[this.radiusAttr]))
        .range([3, 20]);
    d3.select("#scatterplot")
        .select("svg")
        .selectAll("circle")
        .data(this.data)
        .transition()
        .duration(1000)
        .attr("r", (d) => this.radiusScale(d[this.radiusAttr]));
}

updateColor(attr)
{
    this.colorAttr = attr;
    this.colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    d3.select("#scatterplot")
        .select("svg")
        .selectAll("circle")
        .data(this.data)
        .transition()
        .duration(1000)
        .attr("fill", (d) => this.colorScale(d[this.colorAttr]));
}{
}

const barchart = new Barchart(regionData);
const scatterplot = new Scatterplot(data);
scatterplot.render();

d3.select("#x-attr").on("change", function () {
    scatterplot.updateX(this.value);
});

d3.select("#y-attr").on("change", function () {
    scatterplot.updateY(this.value);
});

d3.select("#radius-attr").on("change", function () {
    scatterplot.updateRadius(this.value);
});

d3.select("#color-attr").on("change", function () {
    scatterplot.updateColor(this.value);
});

d3.select("#region-select").on("change", function () {
    const selectedRegion = this.value;
    if (selectedRegion === "All") {
        barchart.update(regionData);
    } else {
        const filteredData = regionData.filter((d) => d.region === selectedRegion);
        barchart.update(filteredData[0].countries);
    }
});
