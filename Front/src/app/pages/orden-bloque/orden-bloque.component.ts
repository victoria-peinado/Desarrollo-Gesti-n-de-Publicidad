import { Component } from '@angular/core';
import { take } from 'rxjs';
import { OnInit } from '@angular/core';
import { MyDataService } from 'src/app/services/my-data.service';

@Component({
  selector: 'app-orden-bloque',
  templateUrl: './orden-bloque.component.html',

})
export class OrdenBLoqueComponent implements OnInit{
  constructor(private myDataService: MyDataService) { }
  blocks: any
  selectedValue: any
  ngOnInit() {
    this.getBLoques();
  }
  getBLoques() {
    this.myDataService.getBlocks().pipe(take(1)).subscribe({
      next: data => {
      let blocks :any
      blocks = data;
      blocks = blocks.data;
      this.blocks= blocks;
    }});
  }
}
