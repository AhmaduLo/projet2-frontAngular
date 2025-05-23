import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { BaseChartDirective } from 'ng2-charts';

import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-line-graph',
  imports: [CommonModule, BaseChartDirective],
  template: `
   <div class="chart-container" *ngIf="lineChartData?.datasets?.length">
  <canvas baseChart
    [data]="lineChartData"
    [options]="lineChartOptions"
    [type]="lineChartType">
  </canvas>
</div>
  `,
  styleUrl: './line-graph.component.scss'
})
export class LineGraphComponent implements OnChanges {
  @Input() countryData?: OlympicCountry;

  // Configuration initiale des données du graphique
  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [],
  };

  // Options d’affichage du graphique
  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      }
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxRotation: 45,
          minRotation: 0,
        }
      },
      y: {
        beginAtZero: true,
      }
    }
  };

  lineChartType: 'line' = 'line';



  ngOnChanges(changes: SimpleChanges): void {
    if (this.countryData) {
      const labels = this.countryData.participations.map(p => p.year.toString());

      // Extrait le nombre de médailles pour chaque année
      const medals = this.countryData.participations.map(p => p.medalsCount);

      // Extrait le nombre d’athlètes pour chaque année
      const athletes = this.countryData.participations.map(p => p.athleteCount);

      // Calcule le ratio médailles / athlètes (arrondi à 2 décimales)
      const ratio = this.countryData.participations.map(p =>
        p.athleteCount ? +(p.medalsCount / p.athleteCount).toFixed(2) : 0
      );

      // Met à jour les données du graphique
      this.lineChartData = {
        labels,
        datasets: [
          {
            label: 'Médailles',
            data: medals,
            borderColor: '#742774',
            fill: false
          },
          {
            label: 'Athlètes',
            data: athletes,
            borderColor: '#1f77b4',
            fill: false
          },
          {
            label: 'Ratio Médailles / Athlètes',
            data: ratio,
            borderColor: '#2ca02c',
            fill: false
          }
        ]
      };
    }
  }
}