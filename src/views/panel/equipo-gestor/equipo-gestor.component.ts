import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReceptorModel } from 'src/resources/models/Receptor.model';
import { CanalAdminService } from 'src/resources/services/canalAdmin/canalAdmin.service';
import { NotyfService } from 'src/resources/services/dependences/notyf.service';

@Component({
  selector: 'app-equipo-gestor',
  templateUrl: './equipo-gestor.component.html',
  styleUrls: ['./equipo-gestor.component.css'],
})
export class EquipoGestorComponent {
  data: ReceptorModel[] = [];
  roles: any[] = [];
  usuarios: any[] = [];
  displayedColumns: any[] = [
    { title: "", style: "width: 20%", class: "text-left", html: false, keyof: "rn" },
    { title: "Persona", style: "width: 20%", class: "text-left", html: true, keyof: "persona" },
    { title: "Cargo", style: "width: 20%", class: "text-left", html: false, keyof: "didrol" },
    { title: "Estado", style: "width: 20%", class: "text-left", html: true, keyof: "cestdo" },
    { title: "Acciones", style: "width: 20%", class: "text-left", html: true, keyof: "acciones" },

  ]
  showModalAgregar: boolean = false;
  showModalEditar: boolean = false;
  selectedRow: any = null;
  filter: any = {
    search: '',
    estado: ''
  }

  constructor(
    private canalAdminService: CanalAdminService,
    private notyf: NotyfService,
    private router: Router
  ) { 
    this.getData();
  }

  totalItems: number = this.data.length;
  pageSize: number = 5;
  currentPage: number = 1;
  loading: boolean = false;

  onPageChange(page: number | null = null) {
    this.currentPage = page || this.currentPage;
    this.loading = true;
    this.canalAdminService.getReceptores(
      (this.currentPage - 1) * this.pageSize,
      this.pageSize,
      this.filter
    ).subscribe(
      (response) => {
        this.data = response.map((item: any) => {
          return {
            ...item,
            persona: `
              <div class="flex flex-row items-center gap-x-2">
                <div class="flex flex-col items-center gap-2 justify-center">
                  <img src="${item.rtafto}" 
                    onerror="this.onerror=null; this.src='assets/images/placeholder.png'" 
                    alt="Foto" 
                    class="w-8 h-8 rounded-full border-2 border-gray-300 " />
                </div>
                <div class="flex flex-col">
                  <p class="font-semibold text-gray-800">${item.ncmpto}</p>
                  <p class="text-gray-600">${item.dcumnto}</p>
                </div>
              </div>
            `,
            cestdo: `
            <span class="px-2 py-1 text-xs rounded-full font-semibold
              ${item.cestdo === 'A'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'}">
              ${item.cestdo === 'A' ? 'Activo' : 'Inactivo'}
            </span>`,
            acciones: {
              editar: {
                icon: 'edit',
                tooltip: 'Editar',
                color: 'bg-blue-500',
                action: () => {
                  this.selectedRow = item;
                  this.toggleModalEditar();
                }
              },
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


  getData() {
    this.canalAdminService.getRoles(
      0, 1000, { search: "", estado: "" }
    ).subscribe(
      (response) => {
        this.roles = response.map((item: any) => {
          return {
            id: item.id,
            label: item.descp,
          };
        });
      },
      (error) => {
        this.roles = [];
        this.notyf.error('Error al cargar los datos');
      }
    );

    this.canalAdminService.getUsuarios(
      0, 1000, { search: "", estado: "" }
    ).subscribe(
      (response) => {
        this.usuarios = response.map((item: any) => {
          return {
            id: item.id,
            label: item.ncmpto,
          };
        });
      },
      (error) => {
        this.usuarios = [];
        this.notyf.error('Error al cargar los datos');
      }
    );
  }

  toggleModalAgregar() {
    this.showModalAgregar = !this.showModalAgregar;
  }

  toggleModalEditar() {
    this.showModalEditar = !this.showModalEditar;
  }
}
