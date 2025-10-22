import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, ChildrenOutletContexts, Router } from '@angular/router';
import { FormularioDenunciaService } from 'src/resources/services/modulos/poner-denuncia/formulario-denuncia.service';
import config from 'src/resources/endpoints';
import { NotyfService } from 'src/resources/services/dependences/notyf.service';

@Component({
  selector: 'app-poner-denuncia',
  templateUrl: './poner-denuncia.component.html',
  styleUrls: ['./poner-denuncia.component.css'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class PonerDenunciaComponent implements OnInit {

  steps = [
    { label: 'Hechos', path: 'datos-hecho' },
    { label: 'Denunciante', path: 'datos-denunciante' },
    { label: 'Denuncia', path: 'datos-denuncia' },
    // { label: 'Testigo', path: 'datos-testigo' },
    // { label: 'Archivos', path: 'datos-archivos' },
    // { label: 'Finalizar', path: 'finalizar-denuncia' },
    // { label: 'Asignar Contraseña', path: 'asignar-contrasena' }
  ];

  breadcrumb = [
    { label: 'Módulos', url: '/modulos' },
    { label: 'Poner denuncia', url: '/detalles' }
  ];

  currentStepIndex = 0;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contexts: ChildrenOutletContexts,
    private formularioDenunciaService: FormularioDenunciaService,
    private cdr: ChangeDetectorRef,
    private notyf: NotyfService
  ) { }

  ngOnInit() {
    // this.route.url.subscribe(() => {
    //   const currentPath = this.route.snapshot.firstChild?.routeConfig?.path;
    //   this.currentStepIndex = this.steps.findIndex(step => step.path === currentPath);
    // });

    // window.addEventListener('beforeunload', this.preventExit);
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    window.removeEventListener('beforeunload', this.preventExit);
  }

  preventExit = (event: BeforeUnloadEvent) => {
    const formData = this.formularioDenunciaService.getFormDataAll();
    if (Object.keys(formData).length > 0) {
      event.preventDefault();
      event.returnValue = 'Los datos ingresados se perderán. ¿Estás seguro de salir?';
    }
  };

  confirmExit(event: Event, url: string) {
    event.preventDefault();

    const formData = this.formularioDenunciaService.getFormDataAll();
    if (Object.keys(formData).length > 0) {
      const confirmExit = confirm('Los datos ingresados se perderán. ¿Estás seguro de salir?');
      if (!confirmExit) return;
    }

    this.router.navigateByUrl(url);
    this.formularioDenunciaService.clearFormData();
  }

  goToPrevious() {
    if (this.currentStepIndex > 0) {
      this.router.navigate(['/modulos/poner-denuncia', this.steps[this.currentStepIndex - 1].path]);
    } else if (this.currentStepIndex === 0) {
    }
  }

  goToNext() {
    const currentComponent: any = this.getCurrentComponent();

    if (currentComponent && typeof currentComponent.getFormData === 'function') {
      const data = currentComponent.getFormData();
      this.formularioDenunciaService.setFormData(this.steps[this.currentStepIndex].path, data);
    }

    this.router.navigate(['/modulos/poner-denuncia', this.steps[this.currentStepIndex + 1].path]);
    if (this.currentStepIndex < this.steps.length - 1) {
    } else {

      const formData = this.formularioDenunciaService.getFormDataAll();
      
      let fData: FormData = new FormData();
      fData.append('IDEMPRESA', config.IDEMPRESA.toString());
      fData.append('IDTPODENUNCIA', formData["datos-hecho"].TipoDenunciaId);
      fData.append('IDRECEPTOR', formData["datos-hecho"].ReceptorId);
      fData.append('IDREMPRESA', formData["datos-denunciante"].RelacionEmpresaId);
      fData.append('NOMBRES', formData["datos-denunciante"].NombresDenunciante);
      fData.append('APELLIDOS', formData["datos-denunciante"].ApellidosDenunciante);
      fData.append('CORREO', formData["datos-denunciante"].CorreoDenunciante);
      fData.append('TELEFONO', formData["datos-denunciante"].TelefonoDenunciante.toString());
      fData.append('FECHAINC', formData["datos-denuncia"].FechaIncidencia);
      fData.append('DETALLE', formData["datos-denuncia"].DescripcionDenuncia);
      fData.append('COMENTARIOADI', formData["finalizar-denuncia"].ComentariosAdicionales);
      fData.append('CONTRASENA', formData["asignar-contrasena"].Contrasena);
      fData.append('CORREOREC', formData["asignar-contrasena"].Correo);
      fData.append('GDDENUNCIA', '1');
      fData.append('JSON_TESTIGOS', JSON.stringify(
        formData["datos-testigo"].map((testigo: any) => ({
          NOMBRE: testigo.nombre,
          APELLIDO: testigo.apellidos,
          CORREO: testigo.correo,
          TELEFONO: testigo.telefono,
          COMENTARIOS: testigo.comentarios
        }))
      ));
      fData.append('JSON_DOCUMENTOS', JSON.stringify(
        formData["datos-archivos"].map((archivo: any) => ({
          IDENTITY: '99999',
          NARCHIVO: archivo.nombreArchivo,
          SIZE: archivo.size,
          RUTA: null,
          COMENTARIOS: archivo.comentarios,
        }))
      ));
      formData["datos-archivos"].forEach((archivo: any) => {
        fData.append('FILES', archivo.file);
      });

      this.loading = true;
      this.formularioDenunciaService.sendData(fData).subscribe({
        next: (response: any) => {
          this.loading = false;
          if (response?.success) {
            this.formularioDenunciaService.clearFormData();
            this.notyf.swalSuccess('Denuncia registrada correctamente', response?.codigo, () => {
              this.router.navigate(['/modulos']);
            });

            return
          }

          this.notyf.error('Error al registrar la denuncia.');
        }
      });

    }
  }

  getCurrentComponent(): any {
    const context = this.contexts.getContext('primary');
    return context?.outlet?.isActivated ? context.outlet.component : null;
  }

  isNextDisabled(): boolean {
    const currentComponent: any = this.getCurrentComponent();
    return !currentComponent || !currentComponent.isValid;
  }
}