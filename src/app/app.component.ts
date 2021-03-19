import {Component, OnInit} from '@angular/core';
import * as d3 from 'd3';
import * as _ from 'lodash';
import * as d3fc from 'd3fc';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    // this.bindChart();
    this.bindChart2();
  }

  bindChart(): void {
    const data = [
      {
        question: 'Activity One',
        answer: 'Some answer',
        value: 5,
        consequence: 1
      },
      {
        question: 'Activity Two',
        answer: 'Some answer',
        value: 4,
        consequence: 1
      },
      {
        question: 'Activity Three',
        answer: 'Another answer',
        value: 4,
        consequence: 2
      },
      {
        question: 'Activity Four',
        answer: 'Another answer',
        value: 5,
        consequence: 4
      },
      {
        question: 'Activity Five',
        answer: 'Another answer',
        value: 4,
        consequence: 5
      },
      {
        question: 'Activity Six',
        answer: 'Another answer',
        value: 1,
        consequence: 1
      },
      {
        question: 'Activity Seven',
        answer: 'Another answer',
        value: 1,
        consequence: 5
      }
    ];

    const svg = d3.select('#chart');
    const margin = {top: 20, right: 20, bottom: 30, left: 50};
    const width = +svg.attr('width');
    const height = +svg.attr('height');
    const domainwidth = width - margin.left - margin.right;
    const domainheight = height - margin.top - margin.bottom;

    const x = d3.scaleLinear()
      .domain(this.padExtent([1, 5]))
      .range(this.padExtent([0, domainwidth]));
    const y = d3.scaleLinear()
      .domain(this.padExtent([1, 5]))
      .range(this.padExtent([domainheight, 0]));

    const g = svg.append('g')
      .attr('transform', 'translate(' + margin.top + ',' + margin.top + ')');

    g.append('rect')
      .attr('width', width - margin.left - margin.right)
      .attr('height', height - margin.top - margin.bottom)
      .attr('fill', '#F6F6F6');


    data.forEach((d) => {
        d.consequence = +d.consequence;
        d.value = +d.value;
      });

    g.selectAll('circle')
        .data(data)
        .enter().append('circle')
        .attr('class', 'dot')
        .attr('r', 7)
        .attr('cx', (d) => x(d.consequence))
        .attr('cy', (d) => y(d.value))
        .style('fill', (d) => {
          if (d.value >= 3 && d.consequence <= 3) {
            return '#60B19C';
          } else if (d.value >= 3 && d.consequence >= 3) {
            return '#8EC9DC';
          } else if (d.value <= 3 && d.consequence >= 3) {
            return '#D06B47';
          } else {
            return '#A72D73';
          } // Bottom Right
        });

    g.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + y.range()[0] / 2 + ')')
        .call(d3.axisBottom(x).ticks(5));

    g.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + x.range()[1] / 2 + ', 0)')
        .call(d3.axisLeft(y).ticks(5));

  }

  padExtent(e, p?): any {
    if (p === undefined) {
      p = 1;
    }
    return ([e[0] - p, e[1] + p]);
  }

  bindChart2(): void {
    const data = this.generateData();
    const extent = d3fc.extentLinear()
      .accessors([d => d.s])
      .padUnit('domain');

    const size = d3.scaleLinear().range([40, 2000]).domain(extent(data));

    const xDomain = d3fc.extentLinear().accessors([d => d.x]).pad([0, 0.4]);
    const yDomain = d3fc.extentLinear().accessors([d => d.y]).pad([0, 0.4]);

    const chart = d3fc.chartCartesian(d3.scaleLinear(), d3.scaleLinear())
      .xDomain(xDomain(data)).xLabel('x Label')
      .yDomain(yDomain(data)).yOrient('left').yTicks(7).yLabel('y Label');
      // .margin({ bottom: 20, right: 15, left: 25 });

    const point = d3fc.seriesSvgPoint().size((d) => {
      return size(d.s);
    }).xScale(d => d.x).yScale(d => d.y).decorate(s => {
      s.attr('d', function(d) {
        if (d.x >= 0 && d.y >= 0) {
          d3.select(this).style('');
        } else if (d.x <= 0 && d.y >= 0) {
          d3.select(this).style('');
        } else if (d.x < 0 && d.y < 0) {
          d3.select(this).style('');
        } else if (d.x > 0 && d.y < 0) {
          d3.select(this).style('');
        }
      });
    });

    const gridlines = d3fc.annotationSvgGridline();

    // add it to the chart
    const multi = d3fc.seriesSvgMulti().series([gridlines, point]);

    chart.svgPlotArea(multi);

    d3.select('#chart2').datum(data).call(chart);

  }

  generateData() {
    const data = [];

    // generate data
    _.times(_.random(30, 50), (n) => {
      data.push({
        s: _.random(44, 2000), // size/area of bubble
        x: _.random(-100, 100),
        y: _.random(-100, 100)
      });
    });

    return data;
  }
}
