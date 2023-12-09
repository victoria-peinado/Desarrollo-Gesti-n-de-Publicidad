import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MyDataService } from '../services/my-data.service';
import { take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ThemePalette } from '@angular/material/core/index.js';
import{Block} from '../models/block';
import { ApiResponse } from '../models/api_response.js';
import {blockPriceHistory } from '../models/block-price-history';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
})
export class BlockComponent implements OnInit {
  @ViewChild('inputBlock') inputBlock: any;
  @ViewChild('inputPrice', { static: false }) priceInputRef!: ElementRef;
  blocks:Block[]=[];
  blocks$:Block[]=[];
  selectedValue: any;
  last: any;
  newPrice: number | null = null;
  isInvalid: boolean = false;
  isBlocksEmpty: boolean = true;
  coloring: ThemePalette = 'primary';
  icon: string = 'display: none';

  constructor(private myDataService: MyDataService, private router: Router) {}

  toAdd = [
    {
      "startTime": "12:30:00",
      "number": 30
    }
  ];

  redirectToHome() {
    console.log('Redirecting to home...');
    this.router.navigate(['/']);
  }

  ngOnInit() {
    this.getBlocks();
  }

getBlocks() {
  this.myDataService.getBlocks().pipe(take(1)).subscribe({
    next: (data: ApiResponse<Block[]>) => {
      console.log('Blocks:', data);
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

          if (historyDate < today && history.idBlock === this.selectedValue.id) {
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
  }as any);
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

  verify() {
    if (!this.isCreateHistoryDisabled()) {
      this.isInvalid = false;
      this.createHistory();
    } else {
      this.isInvalid = true;
      this.coloring = 'warn';
      this.icon = '';
      if (!this.selectedValue) {
        this.inputBlock.focus();
      } else {
        const priceInputElement = this.priceInputRef.nativeElement;
        priceInputElement.focus();
      }
    }
  }

  isCreateHistoryDisabled() {
    return !this.selectedValue || !this.newPrice || this.newPrice < 0 || isNaN(this.newPrice);
  }


  createHistory() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    const seconds = String(today.getSeconds()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    const price = this.newPrice; 
    const idBlock = this.selectedValue.id;

    const newHistory = {
      startTime: formattedDate,
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