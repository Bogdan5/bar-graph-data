let req = new XMLHttpRequest();
let jsonData = [];
req.open('GET',
'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
req.send();
req.onload = function () {
  jsonData = JSON.parse(req.responseText);
  graphDraw(jsonData.data);
};

const graphDraw = (data) => {
  let w = 1140;
  let h = 540;
  const padding = 100;
  let parser = d3.timeParse('%Y-%m-%d');
  let yearData = data.reduce((acc, item) => acc.concat([[parser(item[0]), item[1]]]), []);

  //scales for the x and y axes
  const xScale = d3.scaleTime();
  const yScale = d3.scaleLinear();
  xScale
    .domain([yearData[0][0], yearData[data.length - 1][0]])
    .range([0, w - padding]);
  yScale
    .domain([0, d3.max(data, (d) => d[1])])
    .range([h - padding, 0]);

  //x and y axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  yAxis.tickSizeOuter(0);

  let ticks = d3.selectAll('.tick');

  //svg container for the chart
  const svg = d3.select('body')
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h)
                    .attr('class', 'containerSVG');

  //tooltip shwing information pertaining for each bar in the chart
  let tooltip = d3.select('body')
    .append('div')
    .attr('id', 'tooltip')
    .style('position', 'absolute')
    .style('z-index', '10')
    .style('visibility', 'hidden')
    .attr('class', 'toolTip')
    .text('');

  //for each data item, it adds a rect element
  svg.selectAll('rect')
         .data(yearData)
         .enter()
         .append('rect')
         .attr('x', (d) => xScale(d[0]) + padding / 2)
         .attr('y', (d, i) => yScale(d[1]) + padding / 2)
         .attr('width', 3)
         .attr('height', (d, i) => h - yScale(d[1]) - padding)
         .attr('fill', 'navy')
         .attr('class', 'bar')
         .attr('data-date', (d) => d[0])
         .attr('data-gdp', (d) => d[1])
         .on('mouseover', (d, i) => {
          let left = Math.round(padding / 2 + (w - padding) * i / yearData.length);
          let getQuarter = (month) => { //function that determines the quarter from the month
            switch (month) {
              case 0:
                return 'Q1';
              case 3:
                return 'Q2';
              case 6:
                return 'Q3';
              case 9:
                return 'Q4';
              default:
                return '';
            }
          };

          tooltip.style('visibility', 'visible');
          tooltip.style('top', h - padding + 'px');
          tooltip.style('left', left + 'px'); //moves the tooltip next to the bar hovered

          //it was necessary to clear the tooltip container after each mouse move
          let el = document.getElementById('tooltip');
          while (el.firstChild) {
            el.removeChild(el.firstChild);
          }

          //adds two paragraphs to make sure that year and quarter are on top, the rest at bottom
          tooltip.append('p').text(`${d[0].getFullYear()} ${getQuarter(d[0].getMonth())}`);
          tooltip.append('p').text(`$ ${d[1]} Billions`);
        })
         .on('mouseleave', () => tooltip.style('visibility', 'hidden'));

  //group for the x axis
  svg.append('g')
    .attr('transform', `translate( ${padding / 2}, ${h - padding / 2})`)
    .attr('id', 'x-axis')
    .call(xAxis);

  //group for the y axis
  svg.append('g')
    .attr('transform', 'translate(' + padding / 2 + ', ' + padding / 2 + ')')
    .attr('id', 'y-axis')
    .call(yAxis);

  //rotate label on the y axis
  svg.append('text')
   .attr('transform', `translate(${padding * 0.75}, ${3 * padding}) rotate(-90)`)
   .text('Gross Domestic Product');

  //bottom label
  svg.append('text')
   .attr('transform', `translate(${w - 350}, ${h - 10})`)
   .style('font-size', '12px')
   .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf');
};
