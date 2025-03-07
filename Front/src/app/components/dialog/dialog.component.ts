import { Component, ElementRef, Inject, Input } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { text: string, changes: any[] },
    private el: ElementRef
  ) {
    this.data.changes = this.data.changes || [];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngAfterViewInit() {
    document.addEventListener("mousemove", this.trackMouse);
  }

  ngOnDestroy() {
    document.removeEventListener("mousemove", this.trackMouse);
  }

  trackMouse = (event: MouseEvent) => {
    const dialogElement = this.el.nativeElement.closest('mat-dialog-container');
    const cursor = document.getElementById("custom-cursor");

    if (!dialogElement || !cursor) return;

    const rect = dialogElement.getBoundingClientRect();
    const insideDialog =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (insideDialog) {
      cursor.style.display = "none"; // Oculta el cursor cuando está dentro del diálogo
    } else {
      cursor.style.display = "flex";
      cursor.style.left = `${event.clientX + 10}px`;
      cursor.style.top = `${event.clientY + 10}px`;
    }
  };
}
