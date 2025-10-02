import { Component, OnInit } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';  // Importa el tipo Color
import { CanalAdminService } from 'src/resources/services/canalAdmin/canalAdmin.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loading = true;
  view: [number, number] = [window.innerWidth / 1.5, window.innerHeight / 1.5];
  chartData: any = [];
  pastelData: any = [];
  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']
  };
  showLabels = true;
  explodeSlices = false;

  showXAxis = true;
  isDoughnut = false;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = 'Meses';
  yAxisLabel = 'Ventas';

  constructor(
    private canalAdminService: CanalAdminService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.canalAdminService.getDashboard().subscribe((response: any) => {
      if (response) {
        let denunciaS_TIPO = JSON.parse(response["denunciaS_TIPO"]);
        let denunciaS_FASE = JSON.parse(response["denunciaS_FASE"]);

        this.chartData = denunciaS_FASE.map((item: any) => {
          return {
            name: item.LABEL,
            value: item.VALUE
          };
        })

        this.pastelData = denunciaS_TIPO.map((item: any) => {
          return {
            name: item.LABEL,
            value: item.VALUE
          };
        });

        this.loading = false;

      } else {
        this.loading = false;
        console.error('Error al obtener los datos del dashboard:', response.message);
      }
    });
  }
}
