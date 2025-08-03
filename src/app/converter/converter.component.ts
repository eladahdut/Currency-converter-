import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.css'],
  imports: [ReactiveFormsModule],
  standalone: true,
})
export class ConverterComponent implements OnInit {
  originRateControl = new FormControl<string>('USD');
  targetRateControl = new FormControl<string>('EUR');
  amount = new FormControl<number>(1);
  summary = 0;

  ngOnInit(): void {
    // Dropdowns react immediately
    this.originRateControl.valueChanges.subscribe(() => this.convert());
    this.targetRateControl.valueChanges.subscribe(() => this.convert());

    // Debounce input by 800ms
    this.amount.valueChanges
      .pipe(debounceTime(800))
      .subscribe(() => this.convert());
  }

  convert() {
    const from = this.originRateControl.value;
    const to = this.targetRateControl.value;
    const amount = this.amount.value ?? 1;

    if (!from || !to || from === to) {
      this.summary = 0;
      return;
    }

    fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`
    )
      .then((resp) => resp.json())
      .then((data) => {
        console.log('data', data);
        const convertedAmount = data.rates[to];
        this.summary = convertedAmount;
      })
      .catch((err) => {
        console.error(err);
        this.summary = 0;
      });
  }
}
