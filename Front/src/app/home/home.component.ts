import { Component, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MyDataService } from '../services/my-data.service';
import { ShowForRolesDirective } from '../guards/show-for-roles.directive';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('togglebtn') toggleButton!: ElementRef;
  @ViewChild('sidebar') sidebar!: ElementRef;
  selectedMenuItem: string = 'Inicio';
  lastOpenedSubMenu: string = '';

  menuItems = {
    itemsWithoutSubMenu: ['Inicio', 'Perfil']
  };

  constructor(private cdr: ChangeDetectorRef,private myDataService:MyDataService ) {}

  ngAfterViewInit() {
    this.loadMenuState();
  }

  toggleSidebar() {
    this.sidebar.nativeElement.classList.toggle('close');
    this.toggleButton.nativeElement.classList.toggle('rotate');
    this.closeAllSubMenus();
    this.saveMenuState();
  }

  toggleSubMenu(event: Event) {
    const button = (event.target as HTMLElement).closest('button');
    if (!button) return;

    const nextElement = button.nextElementSibling as HTMLElement;
    if (!nextElement) return;

    const menuTitle = button.textContent?.trim();

    if (!nextElement.classList.contains('show')) {
      this.closeAllSubMenus();
    }

    nextElement.classList.toggle('show');
    button.classList.toggle('rotate');

    if (menuTitle) {
      this.lastOpenedSubMenu = menuTitle;
      this.saveMenuState();
    }

    this.cdr.detectChanges();
  }

  setActive(menuItem: string) {
    this.selectedMenuItem = menuItem;

    if (this.isItemWithoutSubMenu(menuItem)) {
      this.closeAllSubMenus();
      this.saveMenuState();
    } else {
      this.saveMenuState();
    }
  }

  closeAllSubMenus() {
    if (this.sidebar) {
      Array.from(this.sidebar.nativeElement.getElementsByClassName('show') as HTMLCollectionOf<HTMLElement>).forEach((ul) => {
        ul.classList.remove('show');
        const previousSibling = ul.previousElementSibling as HTMLElement;
        if (previousSibling) {
          previousSibling.classList.remove('rotate');
        }
      });
    }
  }

  saveMenuState() {
    localStorage.setItem('selectedMenuItem', this.selectedMenuItem);
    localStorage.setItem('lastOpenedSubMenu', this.lastOpenedSubMenu);
  }

  loadMenuState() {
    const savedMenuItem = localStorage.getItem('selectedMenuItem');
    const savedLastOpenedSubMenu = localStorage.getItem('lastOpenedSubMenu');

    if (savedMenuItem) {
      this.selectedMenuItem = savedMenuItem;
    }

    if (this.isItemWithoutSubMenu(this.selectedMenuItem)) {
      this.closeAllSubMenus();
    }

    if (savedLastOpenedSubMenu) {
      this.lastOpenedSubMenu = savedLastOpenedSubMenu;

      setTimeout(() => {
        const button = Array.from(document.querySelectorAll('.dropdown-btn')) as HTMLElement[];
        const targetButton = button.find(btn => btn.textContent?.trim() === this.lastOpenedSubMenu);

        if (targetButton && !this.isItemWithoutSubMenu(this.selectedMenuItem)) {
          const nextElement = targetButton.nextElementSibling as HTMLElement;
          if (nextElement) {
            nextElement.classList.add('show');
            targetButton.classList.add('rotate');
          }
        }
      }, 100);
    }
  }

  isItemWithoutSubMenu(menuItem: string): boolean {
    return this.menuItems.itemsWithoutSubMenu.includes(menuItem);
  }

 userRoleIn(roles: string[]): boolean {
    const userRole = this.myDataService.getUserRole();

    // Verifica si el rol es null o no
    if (userRole === null) {
      return false; 
    }

    return roles.includes(userRole);
  }
  logout() {
    this.myDataService.logout();
  }
}
