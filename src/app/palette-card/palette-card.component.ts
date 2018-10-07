import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-palette-card',
  templateUrl: './palette-card.component.html',
  styleUrls: ['./palette-card.component.css']
})
export class PaletteCardComponent implements OnInit {
  constructor() {}
  colorData;

  message;
  showMessage;

  ngOnInit() {
    this.colorData = {};
    this.colorData['a'] = { lock: false };
    this.colorData['b'] = { lock: false };
    this.colorData['c'] = { lock: false };
    this.colorData['d'] = { lock: false };

    // this.generateColors();
    this.generateColor();
    this.displayMessage('press space to generate palettes');
  }

  displayMessage(str) {
    this.message = str;
    this.showMessage = true;
    setTimeout(
      function() {
        this.showMessage = false;
      }.bind(this),
      1500
    );
  }

  generateColor() {
    const { a, b, c, d } = this.colorData;
    const random = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const locked = [];
    const lockedR = [255];
    const lockedG = [255];
    const lockedB = [255];

    for (const field of Object.keys(this.colorData)) {
      const { rgb, lock } = this.colorData[field];
      if (lock) {
        locked.push(field);
        lockedR.push(rgb[0]);
        lockedG.push(rgb[1]);
        lockedB.push(rgb[2]);
      }
    }

    if (locked.length === 4) {
      this.displayMessage('unlock a color to generate more');
    }

    let baseR = lockedR.reduce((sum, value) => sum + value) / lockedR.length;
    let baseG = lockedG.reduce((sum, value) => sum + value) / lockedR.length;
    let baseB = lockedB.reduce((sum, value) => sum + value) / lockedR.length;

    if (!a.lock) {
      let red = random(0, 255);
      let green = random(0, 255);
      let blue = random(0, 255);

      red = Math.floor((red + baseR) / 2);
      green = Math.floor((green + baseG) / 2);
      blue = Math.floor((blue + baseB) / 2);

      a.rgb = [red, green, blue];
    }

    if (!b.lock) {
      let red = random(0, a.rgb[0]);
      let green = random(0, a.rgb[1]);
      let blue = random(0, a.rgb[2]);

      red = Math.floor((red + a.rgb[0]) / 2);
      green = Math.floor((green + a.rgb[1]) / 2);
      blue = Math.floor((blue + a.rgb[2]) / 2);

      while (
        Math.abs(a.rgb[0] - red) < 10 &&
        Math.abs(a.rgb[1] - green) < 10 &&
        Math.abs(a.rgb[2] - blue) < 10
      ) {
        red = random(0, a.rgb[0]);
        green = random(0, a.rgb[1]);
        blue = random(0, a.rgb[2]);

        red = Math.floor((red + a.rgb[0]) / 2);
        green = Math.floor((green + a.rgb[1]) / 2);
        blue = Math.floor((blue + a.rgb[2]) / 2);
      }

      b.rgb = [red, green, blue];
    }

    if (!c.lock) {
      let red = random(0, 255);
      let green = random(0, 255);
      let blue = random(0, 255);

      red = Math.floor((red + b.rgb[0]) / 2);
      green = Math.floor((green + b.rgb[1]) / 2);
      blue = Math.floor((blue + b.rgb[2]) / 2);

      while (
        Math.abs(b.rgb[0] - red) < 10 &&
        Math.abs(b.rgb[1] - green) < 10 &&
        Math.abs(b.rgb[2] - blue) < 10
      ) {
        red = random(0, 255);
        green = random(0, 255);
        blue = random(0, 255);

        red = Math.floor((red + b.rgb[0]) / 2);
        green = Math.floor((green + b.rgb[1]) / 2);
        blue = Math.floor((blue + b.rgb[2]) / 2);
      }
      c.rgb = [red, green, blue];
    }

    if (!d.lock) {
      let red = random(0, 255);
      let green = random(0, 255);
      let blue = random(0, 255);

      red = Math.floor((red + c.rgb[0] - 50) / 3);
      green = Math.floor((green + c.rgb[1] - 50) / 3);
      blue = Math.floor((blue + c.rgb[2] - 50) / 3);
      d.rgb = [red, green, blue];
    }

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
    for (const field of Object.keys(this.colorData)) {
      const rgb = this.colorData[field].rgb;
      this.colorData[field].rgbString = this.getColorCode(rgb);

      this.colorData[field].textColor = this.getTextColor(rgb);

      this.colorData[field].hex = this.rgbToHex(rgb);
    }
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
    this.colorData[lock].lock = !this.colorData[lock].lock;
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
      this.generateColor();
    }
  }
}
