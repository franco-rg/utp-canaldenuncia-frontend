import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SectionScrollService {
  private sectionSubject = new BehaviorSubject<string | null>(null);
  section$ = this.sectionSubject.asObservable();

  private activeSectionSubject = new BehaviorSubject<string | null>(null);
  activeSection$ = this.activeSectionSubject.asObservable();

  scrollToSection(sectionId: string) {
    this.sectionSubject.next(sectionId);
  }

  setActiveSection(sectionId: string) {
    this.activeSectionSubject.next(sectionId);
  }
}