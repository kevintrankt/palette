import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-palette-card',
  templateUrl: './palette-card.component.html',
  styleUrls: ['./palette-card.component.css']
})
export class PaletteCardComponent implements OnInit {
  constructor() {}
  color1;
  color2;
  color3;
  color4;

  color1Text;
  color2Text;
  color3Text;
  color4Text;

  color1Value;
  color2Value;
  color3Value;
  color4Value;

  colors = [];

  ngOnInit() {
    this.colors.push([245, 239, 227]);
    this.colors.push([230, 231, 229]);
    this.colors.push([247, 211, 186]);
    this.colors.push([166, 170, 156]);

    this.updateColorStyles();
  }
  onRefreshClick() {
    alert();
  }

  getTextColor(rgb) {
    const avg = rgb.reduce((sum, value) => sum + value) / 3;
    if (avg < 127) {
      return this.getColorCode(rgb.map(x => x + 100));
    } else {
      return this.getColorCode(rgb.map(x => x - 100));
    }
  }

  getColorCode(rgb) {
    return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
  }

  updateColorStyles() {
    this.color1 = this.getColorCode(this.colors[0]);
    this.color1Text = this.getTextColor(this.colors[0]);
    this.color1Value = this.rgbToHex(this.colors[0]);

    this.color2 = this.getColorCode(this.colors[1]);
    this.color2Text = this.getTextColor(this.colors[1]);
    this.color2Value = this.rgbToHex(this.colors[1]);

    this.color3 = this.getColorCode(this.colors[2]);
    this.color3Text = this.getTextColor(this.colors[2]);
    this.color3Value = this.rgbToHex(this.colors[2]);

    this.color4 = this.getColorCode(this.colors[3]);
    this.color4Text = this.getTextColor(this.colors[3]);
    this.color4Value = this.rgbToHex(this.colors[3]);
  }

  rgbToHex(rgb) {
    const hex = rgb
      .map(x => x.toString(16))
      .join('')
      .toUpperCase();
    return `#${hex}`;
  }
}
