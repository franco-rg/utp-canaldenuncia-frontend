import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormularioDenunciaService } from 'src/resources/services/modulos/poner-denuncia/formulario-denuncia.service';

declare const window: any;

@Component({
  selector: 'app-datos-denuncia',
  templateUrl: './datos-denuncia.component.html',
  styleUrls: ['./datos-denuncia.component.css']
})
export class DatosDenunciaComponent implements OnInit {
  formDatosDenuncia: FormGroup;
  maxDate: string;
  recognition: any;
  recording = false;
  finalTranscript = '';

  constructor(
    private formularioDenunciaService: FormularioDenunciaService,
    private route: ActivatedRoute
    ) {
    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];
    this.formDatosDenuncia = new FormGroup({
      FechaIncidencia: new FormControl('', [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]),
      DescripcionDenuncia: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    const currentPath = this.route.snapshot.routeConfig?.path;
    if (!currentPath) return;
    const savedData = this.formularioDenunciaService.getFormData(currentPath);
    if (savedData) {
      this.formDatosDenuncia.patchValue(savedData);
    }
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      this.recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'es-ES';

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            this.finalTranscript += event.results[i][0].transcript + '';
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        this.formDatosDenuncia.controls['DescripcionDenuncia'].setValue(this.finalTranscript + interimTranscript);
      };

      this.recognition.onerror = (event: any) => {
        this.stopRecording();
      };
    } else {
      console.warn('Reconocimiento de voz no soportado en este navegador');
    }
  }

  toggleRecording() {
    if (this.recording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  startRecording() {
    if (this.recognition) {
      this.finalTranscript = this.formDatosDenuncia.controls['DescripcionDenuncia'].value || '';
      this.recognition.start();
      this.recording = true;
    }
  }

  stopRecording() {
    if (this.recognition) {
      this.recognition.stop();
      this.recording = false;
    }
  }

  getFormData() {
    return this.formDatosDenuncia.value;
  }

  setFormData(data: any) {
    if (data) {
      this.formDatosDenuncia.patchValue(data);
    }
  }

  get isValid(): boolean {
    return this.formDatosDenuncia.valid;
  }
}
