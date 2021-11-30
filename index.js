// Code from https://blog.logrocket.com/using-d3-to-create-a-calendar-app/

import * as d3 from 'd3';
const calendarEvents = [
  {
    timeFrom: '2020-11-11T05:00:00.000Z',
    timeTo: '2020-11-11T12:00:00.000Z',
    title: 'Sleep',
    background: '#616161'
  },
  {
    timeFrom: '2020-11-11T16:00:00.000Z',
    timeTo: '2020-11-11T17:30:00.000Z',
    title: 'Business meeting',
    background: '#33B779'
  },
  {
    timeFrom: '2020-11-12T00:00:00.000Z',
    timeTo: '2020-11-12T05:00:00.000Z',
    title: 'Wind down time',
    background: '#616161'
  }
];
// Make an array of dates to use for our yScale later on
const dates = [
  ...calendarEvents.map(d => new Date(d.timeFrom)),
  ...calendarEvents.map(d => new Date(d.timeTo))
];


const margin = { top: 30, right: 30, bottom: 30, left: 50 }; // Gives space for axes and other margins
const height = 1500;
const width = 900;
const barWidth = 600;
const nowColor = '#EA4335';
const barStyle = {
  background: '#616161',
  textColor: 'white',
  width: barWidth,
  startPadding: 2,
  endPadding: 3,
  radius: 3
};

// Create the SVG element
const svg = d3
  .create('svg')
  .attr('width', width)
  .attr('height', height);
// All further code additions will go just below this line

// Actually add the element to the page
document.body.append(svg.node());
// This part ^ always goes at the end of our index.js


const yScale = d3
  .scaleTime()
  .domain([d3.min(dates), d3.max(dates)])
  .range([margin.top, height - margin.bottom]);

const yAxis = d3
  .axisLeft()
  .ticks(24)
  .scale(yScale);
// We'll be using this svg variable throughout to append other elements to it
svg
  .append('g')
  .attr('transform', `translate(${margin.left},0)`)
  .attr('opacity', 0.5)
  .call(yAxis);


svg
  .selectAll('g.tick')
  .filter((d, i, ticks) => i === 0 || i === ticks.length - 1)
  .select('text')
  .text('12 AM');


const gridLines = d3
  .axisRight()
  .ticks(24)
  .tickSize(barStyle.width) // even though they're "ticks" we've set them to be full-width
  .tickFormat('')
  .scale(yScale);

svg
  .append('g')
  .attr('transform', `translate(${margin.left},0)`)
  .attr('opacity', 0.3)
  .call(gridLines);

const barGroups = svg
  .selectAll('g.barGroup')
  .data(calendarEvents)
  .join('g')
    .attr('class', 'barGroup');

barGroups
  .append('rect')
  .attr('fill', d => d.background || barStyle.background)
  .attr('x', margin.left)
  .attr('y', d => yScale(new Date(d.timeFrom)) + barStyle.startPadding)
  .attr('height', d => {
    const startPoint = yScale(new Date(d.timeFrom));
    const endPoint = yScale(new Date(d.timeTo));
    return (
      endPoint - startPoint - barStyle.endPadding - barStyle.startPadding
    );
  })
  .attr('width', barStyle.width)
  .attr('rx', barStyle.radius);


// Since we've hardcoded all our events to be on November 11 of 2020, we'll do the same thing for the "now" date
const currentTimeDate = new Date(new Date(new Date().setDate(11)).setMonth(10)).setFullYear(2020);

barGroups
  .append('rect')
  .attr('fill', nowColor)
  .attr('x', margin.left)
  .attr('y', yScale(currentTimeDate) + barStyle.startPadding)
  .attr('height', 2)
  .attr('width', barStyle.width);

barGroups
  .append('text')
  .attr('font-family', 'Roboto')
  .attr('font-size', 12)
  .attr('font-weight', 500)
  .attr('text-anchor', 'start')
  .attr('fill', barStyle.textColor)
  .attr('x', margin.left + 10)
  .attr('y', d => yScale(new Date(d.timeFrom)) + 20)
  .text(d => d.title);