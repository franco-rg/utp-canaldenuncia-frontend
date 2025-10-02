import { Component, OnInit } from '@angular/core';
import { SectionScrollService } from 'src/resources/services/inicio/section-scroll.service';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.css']
})
export class MainHeaderComponent implements OnInit {
  activeSection: string | null = null;
  menuOpen = false;

  constructor(private sectionScrollService: SectionScrollService) {}

  ngOnInit() {
    this.sectionScrollService.activeSection$.subscribe(sectionId => {
      this.activeSection = sectionId;
    });
  }

  navigateTo(sectionId: string) {
    this.sectionScrollService.scrollToSection(sectionId);
    this.menuOpen = false;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}