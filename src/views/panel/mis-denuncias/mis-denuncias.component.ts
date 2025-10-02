import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReceptorModel } from 'src/resources/models/Receptor.model';
import { CanalAdminService } from 'src/resources/services/canalAdmin/canalAdmin.service';
import { NotyfService } from 'src/resources/services/dependences/notyf.service';

@Component({
  selector: 'app-mis-denuncias',
  templateUrl: './mis-denuncias.component.html',
  styleUrls: ['./mis-denuncias.component.css']
})
export class MisDenunciasComponent {
  data: ReceptorModel[] = [];
  displayedColumns: any[] = [
    { title: "", style: "width: 20%", class: "text-center", html: false, keyof: "rn" },
    { title: "Persona", style: "width: 20%", class: "text-left", html: false, keyof: "persona" },
    { title: "Tipo denuncia", style: "width: 20%", class: "text-left", html: false, keyof: "didtpodenuncia" },
    { title: "Asignado como", style: "width: 20%", class: "text-left", html: false, keyof: "roles" },
    { title: "Estado", style: "width: 20%", class: "text-left", html: false, keyof: "dgddenuncia" },
    { title: "Fecha incidencia", style: "width: 20%", class: "text-left", html: false, keyof: "fechainc" },
    { title: "Fecha Registro", style: "width: 20%", class: "text-left", html: false, keyof: "fcrcn" },
    { title: "Acciones", style: "width: 20%", class: "text-left", html: true, keyof: "acciones" },
  ]
  filter: any = {
    search: '',
    estado: ''
  }

  constructor(
    private canalAdminService: CanalAdminService,
    private notyf: NotyfService,
    private router: Router
  ) { }

  totalItems: number = this.data.length;
  pageSize: number = 5;
  currentPage: number = 1;
  loading: boolean = false;

  onPageChange(page: number) {
    this.currentPage = page;
    this.loading = true;
    this.canalAdminService.getDenuncias(
      (this.currentPage - 1) * this.pageSize,
      this.pageSize
    ).subscribe(
      (response) => {
        console.log(response);
        this.data = response.map((item: any) => {
          return {
            ...item,
            roles: this.formatearPermisos(item.permisos),
            fechainc: item.fechainc.split('T')[0],
            fcrcn: this.getFormDate(item.fcrcn),
            persona: !item.nombres && !item.apellidos ? 'Denuncia anónima' : `${item.nombres} ${item.apellidos}`,
            acciones: {
              visualizar: {
                icon: 'fa-solid fa-eye',
                color: 'bg-blue-500',
                tooltip: 'Visualizar',
                action: () => {
                  this.router.navigate(['/panel/denuncia', item.id]);
                }
              }
            }
          };
        });
        this.totalItems = response.length;
        this.loading = false;
      },
      (error) => {
        this.notyf.error('Error al cargar los datos');
        this.loading = false;
      }
    );
  }


  formatearPermisos(permisos: any): string {
    let permisosArray = JSON.parse(permisos);
    let permisosString = permisosArray.map((permiso: any) => {
      return `${permiso.ASIGNADO}`
    });

    permisosString = [...new Set(permisosString)];

    return permisosString.join(', ') || 'Sin asignar';
  }

  getFormDate(fecha: any): string {
    const date = new Date(fecha);
  
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true 
    };
  
    const formatted = date.toLocaleString('es-ES', options);
  
    const replaced = formatted
      .replace(',', '')                 
      .replace(/\//g, '-')              
      .replace(/\s+p\. m\./i, ' PM')    
      .replace(/\s+a\. m\./i, ' AM');   
  
    return replaced;
  }
  

  getGrupoDato(gdfilter: string): any {
    return this.canalAdminService.getGrupoDatosByID(gdfilter);
  }
}
