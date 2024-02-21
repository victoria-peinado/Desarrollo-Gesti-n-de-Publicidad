import { Component, OnInit } from '@angular/core';
import { MyDataService } from '../services/my-data.service';
import { take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Block } from '../models/block';
import { ApiResponse } from '../models/api_response.js';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { parse } from 'date-fns';
import { Price } from '../models/price';
@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
})
export class BlockComponent implements OnInit {
  blocks: Block[] = [];
  selectedValue: Block | null = null;
  last: Price | null = null;
  isBlocksEmpty: boolean = true;

  form: FormGroup;
  constructor(
    private myDataService: MyDataService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      selectedBlock: ['', Validators.required],
      inputPrice: [
        '',
        [Validators.required, Validators.min(0), Validators.pattern('[0-9]*')],
      ],
      inputPrice2: [''],
      inputPrice3: [''],
    });
  }
  //blocks to create if ther is no other block
  toAdd = [
    {
      regDate: '12:30:00',
      numBlock: 30,
    },
  ];
  // get the blocks , it is excecuted when the component is loaded
  ngOnInit() {
    this.getBlocks();
  }
  //gets the last hitory, set the selected block and focus on the next input
  selectedBlock(next: any) {
    this.selectedValue = this.form.get('selectedBlock')?.value;
    this.getHistory();
    this.focusNext(next);
  }
  //get the blocks of the database
  getBlocks() {
    this.myDataService
      .getBlocks()
      .pipe(take(1))
      .subscribe({
        next: (data: ApiResponse<Block[]>) => {
          console.log(data.data);
          this.blocks = data.data.sort((a, b) => {
            const numBlockA = parseInt(a.numBlock);
            const numBlockB = parseInt(b.numBlock);
            return numBlockA - numBlockB;
          });
          console.log(this.blocks);

          this.isBlocksEmpty = !this.blocks || this.blocks.length === 0;
        },
        error: (error: any) => {
          console.error('Error fetching blocks:', error);
        },
      } as any);
  }
  //get the last history of the selected block
  getHistory() {
    this.myDataService
      .getHistory()
      .pipe(take(1))
      .subscribe({
        next: (response: ApiResponse<Price>) => {
          if (Array.isArray(response.data)) {
            let lastHistory = null;
            const today = new Date();

            for (const history of response.data) {
              const historyDate = new Date(history.regDate);

              if (
                this.selectedValue &&
                historyDate < today &&
                history.block.id === this.selectedValue.id
              ) {
                if (
                  !lastHistory ||
                  historyDate > new Date(lastHistory.regDate)
                ) {
                  lastHistory = history;
                }
              }
            }

            this.last = lastHistory;
          } else {
            console.error(
              'The "data" property is not an array in the response.'
            );
          }
        },
        error: (error: any) => {
          console.error('Error fetching history:', error);
        },
      } as any);
  }

  createBlocks() {
    this.toAdd.forEach((block) => {
      this.myDataService.createBlock(block).subscribe({
        next: (response) => {
          this.getBlocks();
        },
        error: (error) => {
          console.error('Error creating block:', error);
        },
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
    this.createHistory();
  }

  createHistory() {
    const today = new Date();
    const fechaCompleta = today.toLocaleString(); // ver si guarda en la base un date o string .toLocaleDateString(); te da sin la hora
    const price = parseFloat(this.form.get('inputPrice')?.value || '0');
    const block = this.selectedValue!.id;

    const newHistory = {
      regDate: fechaCompleta,
      value: price, /// va a tener que cambiar a price
      block: block,
    };
    this.myDataService.createHistory(newHistory).subscribe({
      next: (response) => {
        this.getHistory();
      },
      error: (error) => {
        console.error('Error creating history:', error);
      },
    });
  }
}
