import { Component, DOCUMENT, inject } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
})
export class NavbarComponent {
  private readonly document = inject(DOCUMENT);

  protected sidebarVisible = false;

  protected sidebarToggle(): void {
    const body = this.document.getElementsByTagName('body')[0];

    if (!this.sidebarVisible) {
      body.classList.add('nav-open');
      this.sidebarVisible = true;
    } else {
      body.classList.remove('nav-open');
      this.sidebarVisible = false;
    }
  }
}
