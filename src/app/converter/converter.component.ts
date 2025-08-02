import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

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
    // Subscribe to changes
    this.originRateControl.valueChanges.subscribe(() => this.convert());
    this.targetRateControl.valueChanges.subscribe(() => this.convert());
    this.amount.valueChanges.subscribe(() => this.convert());
  }

  convert() {
    const from = this.originRateControl.value;
    const to = this.targetRateControl.value;
    const amount = this.amount.value ?? 1;

    if (!from || !to || from === to) {
      alert('Please select two different currencies.');
      return;
    }

    fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`
    )
      .then((resp) => resp.json())
      .then((data) => {
        const convertedAmount = data.rates[to];
        this.summary = convertedAmount;
      })
      .catch((err) => {
        console.error(err);
        this.summary = 0;
      });
  }
}
