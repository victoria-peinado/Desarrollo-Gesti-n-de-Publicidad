import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MyDataService } from '../services/my-data.service';
import { take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ThemePalette } from '@angular/material/core/index.js';
import { Block } from '../models/block';
import { ApiResponse } from '../models/api_response.js';
import { blockPriceHistory } from '../models/block-price-history';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

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

  redirectToHome() {
    this.router.navigate(['/']);
  }

  ngOnInit() {
    this.getBlocks();
  }
  selectedBlock(next: any) {
    this.selectedValue = this.form.get('selectedBlock')?.value
    this.getHistory();
    this.focusNext(next);

  }

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
  getHistory() {
    this.myDataService.getHistory().pipe(take(1)).subscribe({
      next: (response: ApiResponse<blockPriceHistory>) => {
        if (Array.isArray(response.data)) {
          let lastHistory = null;
          const today = new Date();

          for (const history of response.data) {
            const historyDate = new Date(history.startTime);

            if (this.selectedValue && historyDate < today && history.idBlock === this.selectedValue.id) {
              if (!lastHistory || historyDate > new Date(lastHistory.startTime)) {
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
      this.myDataService.createBlock(block).subscribe(
        (response) => {
          this.getBlocks();
        },
        (error) => {
          console.error('Error creating block:', error);
        }
      );
    });
  }



  createHistory() {
    const today = new Date();
    const fechaCompleta = today.toLocaleString();// ver si guarda en la base un date o string .toLocaleDateString(); te da sin la hora
    const price = this.form.get('inputPrice')?.value;
    const idBlock = this.selectedValue!.id;

    const newHistory = {
      startTime: fechaCompleta,
      precio: price, /// va a tener que cambiar a price
      idBlock: idBlock
    };

    this.myDataService.createHistory(newHistory).subscribe(
      (response) => {
        this.getHistory();
      },
      (error) => {
        console.error('Error creating history:', error);
      }
    );

  }
  focusNext(next: any): void {
    setTimeout(() => {
      next.click();
    });

  }
  submit() {
    this.createHistory()
  }
}
