import { Component, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {


  constructor(private eref: ElementRef, private renderer: Renderer2) {}

  collapse(event: MouseEvent) {

    const selectedElement = event.target as Element;
    const id = selectedElement.id;
    const child = selectedElement.classList.contains('nav-child');
    const childElements = this.eref.nativeElement.querySelectorAll('.nav-child');
  
    if (childElements.length > 0) {
      childElements.forEach((e: HTMLElement) => {
        
        if (id === 'toggler') {
          this.renderer.removeClass(e, 'hidden');
        } else if (!child) {
          this.renderer.addClass(e, 'hidden');
        }
      });
    }
  }



}
