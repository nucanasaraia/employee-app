import { Component, OnInit } from '@angular/core';
import { ConfirmService, ConfirmRequest } from 'src/app/services/confirm.service';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {
  visible = false;
  message = '';
  private pending: ConfirmRequest | null = null;

  constructor(private confirmService: ConfirmService) {}

  ngOnInit() {
    this.confirmService.request$.subscribe(req => {
      this.pending = req; //pending simply stores the request temporarily.
//       this.pending = {
//   message: "...",
//   resolve: some function
// }
      this.message = req.message;
      this.visible = true;
    });
  }

  respond(result: boolean) {
    this.visible = false;
    this.pending?.resolve(result); //so later,when the user clicks Yes/No, the dialog still has access to: resolve(true)
    this.pending = null;
  }
}