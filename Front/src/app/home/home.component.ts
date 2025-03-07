import { Component, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MyDataService } from '../services/my-data.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

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
 menuMapping: { [key: string]: { selectedMenuItem: string; lastOpenedSubMenu: string } } = {
  '/inicio': {
    selectedMenuItem: 'Inicio',
    lastOpenedSubMenu: '',
  },
  '/comercios/alta-comercio': {
    selectedMenuItem: 'Alta Comercio',
    lastOpenedSubMenu: 'Comercios',
  },
  '/comercios/listado-comercios': {
    selectedMenuItem: 'Listado Comercios',
    lastOpenedSubMenu: 'Comercios',
  },
  '/comercios/edicion-comercio': {
    selectedMenuItem: 'Edición Comercio',
    lastOpenedSubMenu: 'Comercios',
  },
  '/contrataciones/alta-contratacion': {
    selectedMenuItem: 'Alta Contratación',
    lastOpenedSubMenu: 'Contrataciones',
  },
  '/contrataciones/edicion-contratacion': {
    selectedMenuItem: 'Edición Contratación',
    lastOpenedSubMenu: 'Contrataciones',
  },
  '/pagos/registro-pago': {
    selectedMenuItem: 'Registro Pago',
    lastOpenedSubMenu: 'Pagos',
  },
  '/pagos/informe-falta-pago': {
    selectedMenuItem: 'Informe Falta Pago',
    lastOpenedSubMenu: 'Pagos',
  },
  '/publicidades/emision-ordenes': {
    selectedMenuItem: 'Emisión Órdenes',
    lastOpenedSubMenu: 'Publicidades',
  },
  '/publicidades/listado-publicitario': {
    selectedMenuItem: 'Listado Publicitario',
    lastOpenedSubMenu: 'Publicidades',
  },
  '/publicidades/edicion-spot': {
    selectedMenuItem: 'Edición Spot',
    lastOpenedSubMenu: 'Publicidades',
  },
  '/bloques/listado-bloques': {
    selectedMenuItem: 'Listado Bloques',
    lastOpenedSubMenu: 'Bloques',
  },
  '/bloques/edicion-bloque': {
    selectedMenuItem: 'Edición Bloque',
    lastOpenedSubMenu: 'Bloques',
  },
  '/titulares/alta-titular': {
    selectedMenuItem: 'Alta Titular',
    lastOpenedSubMenu: 'Titulares',
  },
  '/titulares/consulta-titular': {
    selectedMenuItem: 'Consulta Titular',
    lastOpenedSubMenu: 'Titulares',
  },
  '/titulares/edicion-titular': {
    selectedMenuItem: 'Edición Titular',
    lastOpenedSubMenu: 'Titulares',
  },
  '/titulares/baja-titular': {
    selectedMenuItem: 'Baja Titular',
    lastOpenedSubMenu: 'Titulares',
  },
  '/contactos/alta-contacto': {
    selectedMenuItem: 'Alta Contacto',
    lastOpenedSubMenu: 'Contactos',
  },
  '/contactos/consulta-contacto': {
    selectedMenuItem: 'Consulta Contacto',
    lastOpenedSubMenu: 'Contactos',
  },
  '/contactos/edicion-contacto': {
    selectedMenuItem: 'Edición Contacto',
    lastOpenedSubMenu: 'Contactos',
  },
  '/contactos/baja-contacto': {
    selectedMenuItem: 'Baja Contacto',
    lastOpenedSubMenu: 'Contactos',
  },
};
  constructor(private cdr: ChangeDetectorRef,private myDataService:MyDataService,private route: ActivatedRoute ,private router: Router) {}

ngOnInit() {
  this.router.events.subscribe(event => {
    if ((event as any).routerEvent && (event as any).routerEvent instanceof NavigationEnd) {
      const currentPath = (event as any).routerEvent.urlAfterRedirects;
      const menuConfig = this.menuMapping[currentPath];
      if (menuConfig) {
        this.selectedMenuItem = menuConfig.selectedMenuItem;
        this.lastOpenedSubMenu = menuConfig.lastOpenedSubMenu;

        this.setActive(this.selectedMenuItem);

        setTimeout(() => {
          const button = Array.from(document.querySelectorAll('.dropdown-btn')) as HTMLElement[];
          const targetButton = button.find(btn => {
            const span = btn.querySelector('span');
            return span && span.textContent?.trim() === this.lastOpenedSubMenu;
          });
          if (targetButton) {
            this.toggleSubMenuInternal(targetButton);
          }
        }, 100);
      }
    }
  });
}
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

  this.toggleSubMenuInternal(button);
}

toggleSubMenuInternal(button: HTMLElement) {
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
      
      this.saveMenuState();
    } else {
      this.saveMenuState();
    }
  }

  closeAllSubMenus() {
    // console.log('closeAllSubMenus');
    // if (this.sidebar) {
    //   Array.from(this.sidebar.nativeElement.getElementsByClassName('show') as HTMLCollectionOf<HTMLElement>).forEach((ul) => {
    //     ul.classList.remove('show');
    //     const previousSibling = ul.previousElementSibling as HTMLElement;
    //     if (previousSibling) {
    //       previousSibling.classList.remove('rotate');
    //     }
    //     this.cdr.detectChanges();
    //   });
    // }
  }

  saveMenuState() {
    localStorage.setItem('selectedMenuItem', this.selectedMenuItem);
    localStorage.setItem('lastOpenedSubMenu', this.lastOpenedSubMenu);
  }

  loadMenuState() {
    // const savedMenuItem = localStorage.getItem('selectedMenuItem');
    // const savedLastOpenedSubMenu = localStorage.getItem('lastOpenedSubMenu');

    // if (savedMenuItem) {
    //   this.selectedMenuItem = savedMenuItem;
    // }

    // // if (this.isItemWithoutSubMenu(this.selectedMenuItem)) {
    // //   this.closeAllSubMenus();
    // // }

    // if (savedLastOpenedSubMenu) {
    //   this.lastOpenedSubMenu = savedLastOpenedSubMenu;

    //   setTimeout(() => {
    //     const button = Array.from(document.querySelectorAll('.dropdown-btn')) as HTMLElement[];
    //     const targetButton = button.find(btn => btn.textContent?.trim() === this.lastOpenedSubMenu);

    //     if (targetButton && !this.isItemWithoutSubMenu(this.selectedMenuItem)) {
    //       const nextElement = targetButton.nextElementSibling as HTMLElement;
    //       if (nextElement) {
    //         nextElement.classList.add('show');
    //         targetButton.classList.add('rotate');
    //       }
    //     }
    //   }, 100);
    // }
    // this.cdr.detectChanges();
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
