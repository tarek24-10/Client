import { Component, inject } from '@angular/core';
import { ShopService } from '../../../core/services/shop.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectionList } from '@angular/material/list';
import { MatListOption } from '@angular/material/list';
import { MatAnchor } from "@angular/material/button";
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-dialog',
  imports: [MatDividerModule, MatSelectionList, MatListOption, MatAnchor, MatButton, FormsModule],
  templateUrl: './filter-dialog.html',
  styleUrl: './filter-dialog.css',
})
export class FilterDialog {

  shopService = inject(ShopService);

  private dialogRef = inject(MatDialogRef<FilterDialog>);
  data = inject(MAT_DIALOG_DATA);

  selectedBrands:string[] = [];
  selectedTypes:string[] = [];

  applyFilters(){
    this.dialogRef.close({
      selectedBrands:this.selectedBrands,
      selectedTypes:this.selectedTypes,
    })
  }
}
