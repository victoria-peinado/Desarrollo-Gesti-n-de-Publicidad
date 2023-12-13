import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MyDataService } from '../services/my-data.service';
import { take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ThemePalette } from '@angular/material/core/index.js';
import { Block } from '../models/block';
import { ApiResponse } from '../models/api_response.js';
import { blockPriceHistory } from '../models/block-price-history';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { parse } from 'date-fns';
@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
})
export class BlockComponent implements OnInit {
  @ViewChild('inputBlock') inputBlock: any;
  @ViewChild('inputPrice', { static: false }) priceInputRef!: ElementRef;
  blocks: Block[] = [];
  blocks$: Block[] = [];
  selectedValue: Block | null = null;
  last: blockPriceHistory | null = null;
  isInvalid: boolean = false;
  isBlocksEmpty: boolean = true;
  coloring: ThemePalette = 'primary';
  icon: string = 'display: none';

  form: FormGroup;
  constructor(private myDataService: MyDataService, private router: Router, private fb: FormBuilder) {
    this.form = this.fb.group({
      selectedBlock: ['', Validators.required],
      inputPrice: ['', [Validators.required, Validators.min(0), Validators.pattern("[0-9]*")]],
      inputPrice2: [''],
      inputPrice3: [''],

    })
  }

  toAdd = [
    {
      "startTime": "12:30:00",
      "number": 30
    }
  ];
// get the blocks blocks to the droppdown, it is excecuted when the component is loaded
  ngOnInit() {
    this.getBlocks();
  }
//gets the last hitory, set the selected block and focus on the next input
  selectedBlock(next: any) {
    this.selectedValue = this.form.get('selectedBlock')?.value
    this.getHistory();
    this.focusNext(next);

  }
//get the blocks of the database
  getBlocks() {
    this.myDataService.getBlocks().pipe(take(1)).subscribe({
      next: (data: ApiResponse<Block[]>) => {
        this.blocks = data.data;
        this.isBlocksEmpty = !this.blocks || this.blocks.length === 0;
      },
      error: (error: any) => {
        console.error('Error fetching blocks:', error);
      }
    } as any);
  }
//get the last history of the selected block
  getHistory() {
    this.myDataService.getHistory().pipe(take(1)).subscribe({
      next: (response: ApiResponse<blockPriceHistory>) => {
        if (Array.isArray(response.data)) {
          let lastHistory = null;
          const today = new Date();

          for (const history of response.data) {
            const historyDate = parse(history.startTime, "dd/MM/yyyy, HH:mm:ss", new Date());

            if (this.selectedValue && historyDate < today && history.idBlock === this.selectedValue.id) {
              if (!lastHistory || historyDate >  parse(lastHistory.startTime, "dd/MM/yyyy, HH:mm:ss", new Date())){
                lastHistory = history;
              }
            }
          }

          this.last = lastHistory;
        
        } else {
          console.error('The "data" property is not an array in the response.');
        }
      },
      error: (error: any) => {
        console.error('Error fetching history:', error);
      }
    } as any);
  }

  createBlocks() {
    this.toAdd.forEach((block) => {
      this.myDataService.createBlock(block).subscribe({
        next: response => {
          this.getBlocks();
        },
        error: error => {
          console.error('Error creating block:', error);
        }
      });
    });
  }
  //focus on the next input
  focusNext(next: any): void {
    setTimeout(() => {
      next.click();
    });
  }
  //call the createHistory function
  submit() {
    this.createHistory()
  }


  createHistory() {
    const today = new Date();
    const fechaCompleta = today.toLocaleString();// ver si guarda en la base un date o string .toLocaleDateString(); te da sin la hora
    const price = parseFloat(this.form.get('inputPrice')?.value || '0');
    const idBlock = this.selectedValue!.id;

    const newHistory = {
      startTime: fechaCompleta,
      precio: price, /// va a tener que cambiar a price
      idBlock: idBlock
    };
    this.myDataService.createHistory(newHistory).subscribe({
      next: response => {
        this.getHistory();
      },
      error: error => {
        console.error('Error creating history:', error);
      }
    });
  }
}
