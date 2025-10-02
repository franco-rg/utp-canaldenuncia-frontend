import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReceptorModel } from 'src/resources/models/Receptor.model';
import { CanalAdminService } from 'src/resources/services/canalAdmin/canalAdmin.service';
import { NotyfService } from 'src/resources/services/dependences/notyf.service';

@Component({
  selector: 'app-tipo-denuncia',
  templateUrl: './tipo-denuncia.component.html',
  styleUrls: ['./tipo-denuncia.component.css'],
})
export class TipoDenunciaComponent {
  data: ReceptorModel[] = [];
  displayedColumns: any[] = [
    { title: "", style: "width: 20%", class: "text-center", html: false, keyof: "rn" },
    { title: "Descripción", style: "width: 20%", class: "text-left", html: false, keyof: "descp" },
    { title: "Detalle", style: "width: 20%", class: "text-left", html: false, keyof: "detalle" },
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
  ) { }

  totalItems: number = this.data.length;
  pageSize: number = 5;
  currentPage: number = 1;
  loading: boolean = false;

  onPageChange(page: number | null = null) {
    this.currentPage = page || this.currentPage;
    this.loading = true;
    this.canalAdminService.getDenuncia(
      (this.currentPage - 1) * this.pageSize,
      this.pageSize,
      this.filter
    ).subscribe(
      (response) => {
        this.data = response.map((item: any) => {
          return {
            ...item,
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
              eliminar: {
                icon: 'trash',
                color: 'bg-red-500',
                tooltip: 'Eliminar',
                action: () => this.eliminar(item.id),
              }
            }
          }
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

  toggleModalAgregar() {
    this.showModalAgregar = !this.showModalAgregar;
  }

  toggleModalEditar() {
    this.showModalEditar = !this.showModalEditar;
  }

  eliminar(id: number) {
    if (!id) return this.notyf.error('No se encontró el identificador');

    this.notyf.swalDeleteConfirm(() => {
      this.loading = true;
      this.canalAdminService.postDeleteConfiguracionDenuncia(id).subscribe({
        next: (res) => {
          if (res.codEstado > 0 && res.esSatisfactoria) {
            this.notyf.success('Tipo de denuncia cambiado de estado correctamente');
            this.onPageChange();
          } else {
            this.notyf.error('Error al cambiar el estado del Tipo de denuncia');
          }
        },
        error: () => {
          this.notyf.error('Error al cambiar el estado del Tipo de denuncia');
        },
        complete: () => {
          this.loading = false;
        },
      });
    });

  }
}
