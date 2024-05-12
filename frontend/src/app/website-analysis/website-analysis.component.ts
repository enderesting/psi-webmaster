import { WebsiteService } from '../website.service';
import { Component, Input, ViewChild } from "@angular/core";
import { ErrorElement } from '../website';
import {
  ApexDataLabels,
  ApexLegend,
  ChartComponent,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexPlotOptions,
} from "ng-apexcharts";


@Component({
  selector: 'app-website-analysis',
  templateUrl: './website-analysis.component.html',
  styleUrls: ['./website-analysis.component.css']
})
export class WebsiteAnalysisComponent {
  @ViewChild("chart") chart: ChartComponent = {} as ChartComponent;
  @Input() stats: number[] = [];
  @Input() dataSource : ErrorElement[]= [];
  displayedColumns: string[] = ['rank','errorName'];

  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: this.stats,
      chart: {
        foreColor: "#fff",
        height: 500,
        type: "radialBar"
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: "30%",
            background: "transparent",
            image: undefined
          },
          dataLabels: {
            name: {
              show: true
            },
            value: {
              show: true
            }
          }
        }
      },
      colors: ["#1ab7ea", "#0084ff", "#39539E", "#0077B5"],
      labels: ["Total page with error","Pages with 1+ AAA error","Pages with 1+ AA error","Pages with 1+ A error"],
      legend: {
        show: true,
        floating: true,
        fontSize: "16px",
        position: "left",
        offsetX: -30,
        offsetY: 70,
        labels: {
          useSeriesColors: true
        },
        formatter: function(seriesName, opts) {
          return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
        },
        itemMargin: {
          horizontal: 1
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              show: false
            }
          }
        }
      ]
    };
  }
}


export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  dataLabels: ApexDataLabels;
  labels: any;
  // title: ApexTitleSubtitle;
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
  colors: string[];
};
