import { Component } from '@angular/core';
import { MyDataService } from '../services/my-data.service';
import { OnInit } from '@angular/core';
import { take ,tap} from 'rxjs/operators';
@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit{
  blocks: any
  blocks$: any
  selectedValue: any
  constructor(private myDataService: MyDataService) { }

  ngOnInit() {
    this.getBlocks();

  }
  getBlocks() {
    this.myDataService.getBlocks().pipe(take(1)).subscribe(data => {
      this.blocks = data;
      this.blocks = this.blocks.data;
      console.log(this.blocks);
    } );
  }

}
