import { Component, Input } from '@angular/core';
import {formatDate} from '@angular/common';
import { trigger, state, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-weekly-forecast',
  templateUrl: './weekly-forecast.component.html',
  styleUrls: ['./weekly-forecast.component.css'],
  animations: [
    trigger('onOff', [
      transition(':enter', [style({
        opacity: 0,
        transform: 'translateY(-100%)'
      }),
      animate(40)
    ])
    ])
 ]
})

export class WeeklyForecastComponent {
    @Input() weatherDataForecast: any;
    @Input() range: any
    @Input() days: any;

    protected start: number = 0;
    protected currentDate: any = new Date();
    protected newDate: any;
    protected tempMin: number;
    protected tempMax: number;
    protected tempAvg: number;
    protected maxPressure: number;
    protected icon: number;
    protected description: string;
    protected moreDetails: boolean = false;

    ngOnInit(): void {
      this.start = this.range[0]
      this.setDate(this.days);
      this.loopThroughData();
    }

    setDate(days: number) {
      this.newDate = formatDate(this.currentDate.setDate(this.currentDate.getDate() + days), 'dd/MM', 'en')
      return this.newDate;
    }
    
    getIcon(icon: any) {
      var iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
      return iconurl;
    }
  
    counter(i: number) {
      return Array.from(Array(i).keys());
    }

    loopThroughData() {
      var data: any[] = [];
      var pressure: any[] = [];
      var icons: any[] = [];
      var descriptions: any[] = [];
      for (let i = 0; i < 40; i++) {
        var timestamp = this.weatherDataForecast?.list[i]?.dt;
        var date: Date = new Date(timestamp * 1000);
        var format = formatDate(this.currentDate.setDate(date.getDate()), 'dd/MM', 'en')
        if (format === this.newDate) {
          data.push(this.weatherDataForecast.list[i]?.main?.temp)
          pressure.push(this.weatherDataForecast.list[i]?.main?.pressure)
          var time = new Date(this.weatherDataForecast?.list[i]?.dt * 1000)
          if (format === this.newDate && formatDate(time.setDate(date.getDate()), 'HH:mm', 'en') === '14:00') {
            icons.push(this.weatherDataForecast.list[i]?.weather[0]?.icon)
            descriptions.push(this.weatherDataForecast.list[i]?.weather[0]?.description)
          }
        }
      }
      this.minTemp(data);
      this.maxTemp(data);
      this.averageTemp(data);
      this.maxPress(pressure)
      this.chooseIcon(icons)
      this.chooseDescription(descriptions);
    }

    minTemp(data: any) {
      var smallestNumber = data[0];
      for (let i = 0; i < data.length; i++) {
        if (data[i] < smallestNumber) {
          smallestNumber = data[i]
        }
      }
      this.tempMin = smallestNumber;
      return this.tempMin;
    }

    maxTemp(data: any) {
      var largestNumber = data[0];
      for (let i = 0; i < data.length; i++) {
        if (data[i] > largestNumber) {
          largestNumber = data[i]
        }
      }
      this.tempMax = largestNumber;
      return this.tempMax;
    }

    averageTemp(data: any) {
      var sum = 0
      for (let i = 0; i < data.length; i++) {
        sum += data[i];
      }
      var avg = sum/data.length;
      this.tempAvg = avg;
      return this.tempAvg;
    }

    maxPress(data: any) {
      var largestNumber = data[0];
      for (let i = 0; i < data.length; i++) {
        if (data[i] > largestNumber) {
          largestNumber = data[i]
        }
      }
      this.maxPressure = largestNumber;
      return this.maxPressure;
    }

    chooseIcon(icons: any) {
      this.icon = icons[0];
    }

    chooseDescription(descriptions: any) {
      this.description = descriptions[0];
    }

    toggleDetails() {
      this.moreDetails = !this.moreDetails;
    }
}
