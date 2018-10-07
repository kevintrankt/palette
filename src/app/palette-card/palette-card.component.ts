import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-palette-card',
  templateUrl: './palette-card.component.html',
  styleUrls: ['./palette-card.component.css']
})
export class PaletteCardComponent implements OnInit {
  constructor() {}
  colorData = {};

  color1; // rename to rgb String
  color2;
  color3;
  color4;

  color1Text; // text color
  color2Text;
  color3Text;
  color4Text;

  color1Value; // rename to hex
  color2Value;
  color3Value;
  color4Value;

  colors = []; // rename to rgb

  message;
  showMessage;

  color1lock = false; // rename to lock
  color2lock = false;
  color3lock = false;
  color4lock = false;

  ngOnInit() {
    this.colorData['a'] = {};
    this.colorData['b'] = {};
    this.colorData['c'] = {};
    this.colorData['d'] = {};

    this.generateColors();
    this.displayMessage('press space to generate palettes');
  }

  displayMessage(str) {
    this.message = str;
    this.showMessage = true;
    setTimeout(
      function() {
        this.showMessage = false;
      }.bind(this),
      1000
    );
  }

  generateColors() {
    const random = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // Color 1
    // White Base
    let r1 = random(0, 255);
    let g1 = random(0, 255);
    let b1 = random(0, 255);

    r1 = Math.floor((255 + r1) / 2);
    g1 = Math.floor((255 + g1) / 2);
    b1 = Math.floor((255 + b1) / 2);

    this.colors[0] = [r1, g1, b1];
    console.log(this.colorData);

    // Color 2
    let r2 = random(0, r1);
    let g2 = random(0, g1);
    let b2 = random(0, b1);

    r2 = Math.floor((r2 + r1) / 2);
    g2 = Math.floor((g2 + g1) / 2);
    b2 = Math.floor((b2 + b1) / 2);

    while (
      Math.abs(r1 - r2) < 10 &&
      Math.abs(b1 - b2) < 10 &&
      Math.abs(g1 - g2) < 10
    ) {
      r2 = random(0, 255);
      g2 = random(0, 255);
      b2 = random(0, 255);

      r2 = Math.floor((r2 + r1) / 2);
      g2 = Math.floor((g2 + g1) / 2);
      b2 = Math.floor((b2 + b1) / 2);
    }
    this.colors[1] = [r2, g2, b2];

    // Color 3
    let r3 = random(0, 255);
    let g3 = random(0, 255);
    let b3 = random(0, 255);

    r3 = Math.floor((r3 + r2) / 2) - 20;
    g3 = Math.floor((g3 + g2) / 2) - 20;
    b3 = Math.floor((b3 + b2) / 2) - 20;

    while (
      Math.abs(r2 - r3) < 10 &&
      Math.abs(b2 - b3) < 10 &&
      Math.abs(g2 - g3) < 10
    ) {
      r3 = random(0, 255);
      g3 = random(0, 255);
      b3 = random(0, 255);

      r3 = Math.floor((r2 + r1) / 2);
      g3 = Math.floor((g2 + g1) / 2);
      b3 = Math.floor((b2 + b1) / 2);
    }
    this.colors[2] = [r3, g3, b3];

    // Color 4
    let r4 = random(0, r1);
    let g4 = random(0, r2);
    let b4 = random(0, r3);

    r4 = Math.floor((r4 + r3 - 50) / 3);
    g4 = Math.floor((g4 + g3 - 50) / 3);
    b4 = Math.floor((b4 + b3 - 50) / 3);
    this.colors[3] = [r4, g4, b4];

    this.updateColorStyles();
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
      .map(x => {
        let value = x > 0 ? x.toString(16) : 0;
        if (value.length === 1) {
          value = '0' + value;
        }
        return value;
      })
      .join('')
      .toUpperCase();
    return `${hex}`;
  }

  toggleLock(lock) {
    switch (lock) {
      case 1:
        this.color1lock = !this.color1lock;
        break;
    }
  }

  copyTextToClipboard(text) {
    var txtArea = document.createElement('textarea');
    txtArea.id = 'txt';
    txtArea.style.position = 'fixed';
    txtArea.style.top = '0';
    txtArea.style.left = '0';
    txtArea.style.opacity = '0';
    txtArea.value = text;
    document.body.appendChild(txtArea);
    txtArea.select();

    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copying text command was ' + msg);
      if (successful) {
        this.displayMessage('hex value copied to clipboard!');
        return true;
      }
    } catch (err) {
      console.log('Oops, unable to copy');
    } finally {
      document.body.removeChild(txtArea);
    }
    return false;
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === ' ') {
      this.generateColors();
    }
  }
}
