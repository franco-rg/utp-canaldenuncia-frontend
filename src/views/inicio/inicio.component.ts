import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CanalAdminService } from 'src/resources/services/canalAdmin/canalAdmin.service';
import { NotyfService } from 'src/resources/services/dependences/notyf.service';
import { SectionScrollService } from 'src/resources/services/inicio/section-scroll.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscription!: Subscription;
  private observer!: IntersectionObserver;
  selection = 'manual';
  faqs = [
    {
      question: '¿Qué es el canal de denuncias?',
      answer: `
      <p>
      Es un medio de comunicación confidencial y seguro, disponible para empleados, colaboradores, clientes, proveedores y cualquier persona relacionada con Caro & Asociados, que permite reportar incidencias, conductas irregulares o dudas relacionadas con normas internas.'
      </p>
      `,
      open: false
    },
    {
      question: '¿Qué tipo de situaciones puedo reportar?',
      answer: `
        <div>
          <p>Puedes reportar hechos vinculados a:</p>
          <ul class="list-disc list-inside">
            <li>Malas prácticas financieras, contables o comerciales</li>
            <li>Incumplimiento de normas internas o regulatorias</li>
            <li>Conductas poco éticas o faltas a nuestros valores</li>
            <li>Casos de acoso, discriminación o conflictos de interés</li>
          </ul>
        </div>
      `,
      open: false
    },
    {
      question: '¿Puedo usar el canal si solo tengo una duda?',
      answer: `
      <p>
      Sí. Este canal también está habilitado para consultas sobre la aplicación de normas y procedimientos internos, incluso si no hay una denuncia específica.
      </p>
      `,
      open: false
    },
    {
      question: '¿Mi comunicación es confidencial?',
      answer: `
      <p>
      Sí. Garantizamos absoluta confidencialidad. Toda denuncia o consulta es tratada con reserva, y solo será compartida con quienes deban intervenir para su análisis y resolución.
      </p>
      `,
      open: false
    },
    {
      question: '¿Qué garantías tengo frente a posibles represalias?',
      answer: `
      <p>
      En Caro & Asociados no toleramos represalias. Toda persona que haga un reporte de buena fe estará protegida. Se aplicarán medidas para asegurar que no exista ningún tipo de sanción o perjuicio por denunciar.
      </p>
      `,
      open: false
    },
    {
      question: '¿Cómo realizo una denuncia o consulta?',
      answer: `
      <p>
      Solo debes completar el formulario habilitado, asegurándote de incluir la mayor cantidad de detalles posible. Puedes hacerlo con tu nombre o de forma anónima.
      </p>
      `,
      open: false
    },
  ];

  @ViewChild('inicio') inicioSection!: ElementRef;
  @ViewChild('queEs') queEsSection!: ElementRef;
  @ViewChild('comoEnviar') comoEnviarSection!: ElementRef;
  @ViewChild('soporte') soporteSection!: ElementRef;
  form!: FormGroup;
  loading = false;

  constructor(
    private sectionScrollService: SectionScrollService,
    private fb: FormBuilder,
    private canalAdminService: CanalAdminService,
    private notyf: NotyfService
  ) { }

  ngOnInit() {
    this.subscription = this.sectionScrollService.section$.subscribe(sectionId => {
      if (sectionId) {
        this.scrollToSection(sectionId);
      }
    });

    this.form = this.fb.group({
      NOMBRE: ['', Validators.required],
      APELLIDO: ['', Validators.required],
      CORREO: ['', [Validators.required, Validators.email]],
      ASUNTO: ['', Validators.required],
      MENSAJE: ['', Validators.required],
      ACCEPTED: [false, Validators.requiredTrue]
    });
  }

  ngAfterViewInit() {
    const sections = [
      { id: 'inicio', el: this.inicioSection },
      { id: 'queEs', el: this.queEsSection },
      { id: 'comoEnviar', el: this.comoEnviarSection },
      { id: 'soporte', el: this.soporteSection }
    ];

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const activeSection = sections.find(sec => sec.el?.nativeElement === entry.target);
          if (activeSection) {
            this.sectionScrollService.setActiveSection(activeSection.id);
          }
        }
      });
    }, { threshold: 0.6 });

    sections.forEach(section => {
      if (section.el?.nativeElement) {
        this.observer.observe(section.el.nativeElement);
      }
    });
  }

  scrollToSection(sectionId: string) {
    const sections: { [key: string]: ElementRef } = {
      inicio: this.inicioSection,
      queEs: this.queEsSection,
      comoEnviar: this.comoEnviarSection,
      soporte: this.soporteSection
    };

    const section = sections[sectionId];
    if (section) {
      section.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.observer.disconnect();
  }

  enviar() {
    if (!this.form.valid) return this.form.markAllAsTouched();

    let formData = new FormData();
    formData.append('NOMBRE', this.form.get('NOMBRE')?.value);
    formData.append('APELLIDO', this.form.get('APELLIDO')?.value);
    formData.append('CORREO', this.form.get('CORREO')?.value);
    formData.append('ASUNTO', this.form.get('ASUNTO')?.value);
    formData.append('MENSAJE', this.form.get('MENSAJE')?.value);
    formData.append('CESTDO', 'P');
    this.loading = true;
    this.canalAdminService.postAddSolicitud(formData).subscribe({
      next: (res) => {
        if (res.codEstado > 0 && res.esSatisfactoria) {
          this.notyf.success('Solicitud enviada correctamente');
          this.reset()
        } else {
          this.notyf.error(res?.mensaje || 'Error al enviar la solicitud');
        }
      },
      error: () => {
        this.loading = false;
        this.notyf.error('Error al enviar la solicitud');
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  reset() {
    this.form.reset();
  }

  openWindow() {
    const url = 'https://ccfirma.com/wp-content/uploads/2024/04/CC-Codigo-de-Conducta-v.5-22.07.22-1.pdf';
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  toggleFaq(index: number) {
    this.faqs.forEach((faq, i) => {
      if (i !== index) {
        faq.open = false;
      }
    });
    this.faqs[index].open = !this.faqs[index].open;
  }
}