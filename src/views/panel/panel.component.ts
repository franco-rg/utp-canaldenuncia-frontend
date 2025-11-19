import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from 'src/resources/services/auth.service';
import { CanalAdminService } from 'src/resources/services/canalAdmin/canalAdmin.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
  isSidebarOpen = false;
  currentTitle = 'Dashboard';
  usuario: any;

  rountings: any[] = [
    // {
    //   routerLink: '/panel/dashboard', title: 'Dashboard', icon: 'fa-solid fa-house'
    // },
    // {
    //   routerLink: '/panel/mis-denuncias', title: 'Mis denuncias', icon: 'fa-solid fa-file-pen'
    // },
    // {
    //   routerLink: '/panel/Equipo', title: 'Equipo', icon: 'fa-solid fa-users'
    // },
    // {
    //   routerLink: '/panel/roles-gestor', title: 'Roles Gestor', icon: 'fa-solid fa-user-shield '
    // },
    // {
    //   routerLink: '/panel/tipo-denuncia', title: 'Tipo denuncia', icon: 'fa-solid fa-file-circle-exclamation'
    // },
    // {
    //   routerLink: '/panel/relacion-empresa', title: 'Relación con empresa', icon: 'fa-solid fa-building'
    // },
    // {
    //   routerLink: '/panel/medidas-cautelares', title: 'Medidas cautelares', icon: 'fa-solid fa-gavel'
    // },
    // {
    //   routerLink: '/panel/parametros', title: 'Parametros', icon: 'fa-solid fa-cog'
    // },
    // {
    //   routerLink: '/panel/perfil', title: 'Perfil', icon: 'fa-solid fa-user'
    // },
  ]

  private titles: { [key: string]: string } = {
    'dashboard': 'Dashboard',
    'mis-denuncias': 'Mis Denuncias',
    'todas-las-denuncias': 'Todas las denuncias',
    'Equipo': 'Equipo Gestor',
    'tipo-denuncia': 'Tipo de Denuncia',
    // 'relacion-empresa': 'Relación Empresa',
    'denuncia': 'Detalle Denuncia',
    // 'roles-gestor': 'Roles Gestor',
    // 'medidas-cautelares': 'Medidas Cautelares',
    // 'parametros': 'Parametros',
    'perfil': 'Perfil',
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private canalAdminService: CanalAdminService,
    private authService: AuthService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const activeRoute = this.route.firstChild?.snapshot.url[0]?.path;
      this.currentTitle = activeRoute ? this.titles[activeRoute] || 'Dashboard' : 'Dashboard';
      this.getGrupoDatos();
    });
  }

  ngOnInit() {
    this.usuario = this.canalAdminService.getUsuario();
    if (this.usuario) {
      this.canalAdminService.getUsuario().subscribe((res: any) => {
        if (res.length > 0) {
          this.usuario = res[0];

          if (this.usuario.rol == 'MARKETING') {
            this.rountings = [
              { routerLink: '/panel/perfil', title: 'Perfil', icon: 'fa-solid fa-user' }
            ];
          }

          if (this.usuario.rol == 'ADMINISTRADOR') {
            this.rountings = [
              { routerLink: '/panel/dashboard', title: 'Dashboard', icon: 'fa-solid fa-house' },
              { routerLink: '/panel/perfil', title: 'Perfil', icon: 'fa-solid fa-user' },
              { routerLink: '/panel/Equipo', title: 'Equipo Gestor', icon: 'fa-solid fa-users' },
              { routerLink: '/panel/roles-gestor', title: 'Roles Gestor', icon: 'fa-solid fa-user-shield ' },
              { routerLink: '/panel/tipo-denuncia', title: 'Tipo denuncia', icon: 'fa-solid fa-file-circle-exclamation' },
              // { routerLink: '/panel/relacion-empresa', title: 'Relación con empresa', icon: 'fa-solid fa-building' },
              // { routerLink: '/panel/medidas-cautelares', title: 'Medidas cautelares', icon: 'fa-solid fa-gavel' },
              // { routerLink: '/panel/parametros', title: 'Parametros', icon: 'fa-solid fa-cog' }
            ];
          }

          if (this.usuario.rol == 'ABOGADO') {
            this.rountings = [
              { routerLink: '/panel/dashboard', title: 'Dashboard', icon: 'fa-solid fa-house' },
              { routerLink: '/panel/mis-denuncias', title: 'Mis denuncias', icon: 'fa-solid fa-file-pen' },
              // { routerLink: '/panel/medidas-cautelares', title: 'Medidas cautelares', icon: 'fa-solid fa-gavel' },
              { routerLink: '/panel/perfil', title: 'Perfil', icon: 'fa-solid fa-user' }
            ];
          }

        }
      });
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/iniciar-sesion']);
  }

  getGrupoDatos() {
    let GDTOS: string = 'GDDENUNCIA';
    this.canalAdminService.getGrupoDatos(GDTOS).subscribe((response: any) => { });
  }
}
