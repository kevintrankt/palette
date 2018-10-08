import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { ColormindService } from '../colormind.service';

@Component({
  selector: 'app-palette-card',
  templateUrl: './palette-card.component.html',
  styleUrls: ['./palette-card.component.css']
})
export class PaletteCardComponent implements OnInit {
  constructor(private colormind: ColormindService) {}
  colorData;

  message;
  showMessage;
  runs = 0;

  colormindResponse;

  lockedAmt;

  ngOnInit() {
    this.colorData = {};
    this.colorData['a'] = { lock: false };
    this.colorData['b'] = { lock: false };
    this.colorData['c'] = { lock: false };
    this.colorData['d'] = { lock: false };

    this.generateColor();
    // this.generateColorRGB();

    this.displayMessage('press space to generate palettes');
  }

  displayMessage(str) {
    this.message = str;
    this.showMessage = true;
    setTimeout(
      function() {
        this.showMessage = false;
      }.bind(this),
      2000
    );
  }

  generateColor() {
    const locked = [];
    for (const field of Object.keys(this.colorData)) {
      const { rgb, lock } = this.colorData[field];
      if (lock) {
        locked.push(rgb);
      }
    }

    this.lockedAmt = locked.length;

    for (let i = 0; i < 5; i++) {
      if (!locked[i]) {
        locked[i] = 'N';
      }
    }

    console.log(locked);
    this.colormind.getColors(locked).subscribe(
      data => (this.colormindResponse = data),
      error => console.log(error),
      () => {
        console.log('news:', this.colormindResponse);
        this.loadColors();
      }
    );
  }

  loadColors() {
    const { result } = this.colormindResponse;
    const { a, b, c, d } = this.colorData;

    let i = 0 + this.lockedAmt;

    if (!a.lock) {
      a.rgb = result[i];
      i++;
    }

    if (!b.lock) {
      b.rgb = result[i];
      i++;
    }

    if (!c.lock) {
      c.rgb = result[i];
      i++;
    }

    if (!d.lock) {
      d.rgb = result[i];
      i++;
    }

    this.updateColorStyles();
  }

  generateColorRGB() {
    const { a, b, c, d } = this.colorData;
    const random = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    this.runs++;

    switch (this.runs) {
      case 2:
        this.displayMessage('lock a color to keep it from changing');
        break;
      case 3:
        this.displayMessage('paste your own hex values in');
        break;
      case 4:
        this.displayMessage('forks are welcome!');
        break;
      default:
        break;
    }

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

    const baseR = lockedR.reduce((sum, value) => sum + value) / lockedR.length;
    const baseG = lockedG.reduce((sum, value) => sum + value) / lockedR.length;
    const baseB = lockedB.reduce((sum, value) => sum + value) / lockedR.length;

    if (!a.lock) {
      let red = random(0, 255);
      let green = random(0, 255);
      let blue = random(0, 255);

      const rDiv = random(2, 3);
      const gDiv = random(2, 3);
      const bDiv = random(2, 3);

      red = Math.floor((red + baseR) / rDiv);
      green = Math.floor((green + baseG) / gDiv);
      blue = Math.floor((blue + baseB) / bDiv);

      a.rgb = [red, green, blue];
    }

    if (!b.lock) {
      let red = random(0, a.rgb[0]);
      let green = random(0, a.rgb[1]);
      let blue = random(0, a.rgb[2]);

      red = Math.floor((red + a.rgb[0]) / 2);
      green = Math.floor((green + a.rgb[1]) / 2);
      blue = Math.floor((blue + a.rgb[2]) / 2);

      let inits = 0;

      while (
        (Math.abs(a.rgb[0] - red) < 15 &&
          Math.abs(a.rgb[1] - green) < 15 &&
          Math.abs(a.rgb[2] - blue) < 15) ||
        a.rgb.reduce((sum, value) => sum + value) < red + green + blue
      ) {
        inits++;
        if (inits === 20) {
          break;
        }
        red = random(0, 255);
        green = random(0, 255);
        blue = random(0, 255);

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

      red = Math.floor((red + a.rgb[0]) / 2);
      green = Math.floor((green + a.rgb[1]) / 2);
      blue = Math.floor((blue + a.rgb[2]) / 2);

      let inits = 0;

      while (
        (Math.abs(b.rgb[0] - red) < 10 &&
          Math.abs(b.rgb[1] - green) < 10 &&
          Math.abs(b.rgb[2] - blue) < 10) ||
        b.rgb.reduce((sum, value) => sum + value) < red + green + blue
      ) {
        inits++;
        if (inits === 20) {
          break;
        }
        red = random(0, 255);
        green = random(0, 255);
        blue = random(0, 255);

        red = Math.floor((red + a.rgb[0]) / 2);
        green = Math.floor((green + a.rgb[1]) / 2);
        blue = Math.floor((blue + a.rgb[2]) / 2);
      }
      c.rgb = [red, green, blue];
    }

    if (!d.lock) {
      let red = random(0, 255);
      let green = random(0, 255);
      let blue = random(0, 255);

      red = Math.floor((red + a.rgb[0]) / 3);
      green = Math.floor((green + a.rgb[1]) / 3);
      blue = Math.floor((blue + a.rgb[2]) / 3);
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

  hexToRgb(hex) {
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return [r, g, b];
  }

  toggleLock(lock) {
    this.colorData[lock].lock = !this.colorData[lock].lock;
  }

  copyTextToClipboard(text) {
    const txtArea = document.createElement('textarea');
    txtArea.id = 'txt';
    txtArea.style.position = 'fixed';
    txtArea.style.top = '0';
    txtArea.style.left = '0';
    txtArea.style.opacity = '0';
    txtArea.value = text;
    document.body.appendChild(txtArea);
    txtArea.select();

    try {
      const successful = document.execCommand('copy');
      const msg = successful ? 'successful' : 'unsuccessful';
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

  editColor(color, event) {
    const len = event.target.innerText.trim().length;
    const selection = window.getSelection().type;

    if (event.keyCode === 13 || event.key === ' ') {
      event.preventDefault();

      const tmp = document.createElement('input');
      document.body.appendChild(tmp);
      tmp.focus();
      document.body.removeChild(tmp);

      const hex = event.target.innerHTML;
      if (hex.length === 6) {
        const rgb = this.hexToRgb(hex);

        this.colorData[color].rgb = rgb;
        this.colorData[color].lock = true;

        this.generateColor();
      } else {
        this.displayMessage('hex values need 6 digits');
        event.target.innerHTML = this.colorData[color].hex;
      }
    }

    const re = new RegExp('[a-fA-F0-9]');

    if ((len >= 6 && selection === 'Caret') || !re.test(event.key)) {
      event.preventDefault();
      return false;
    }
    console.log(len);
  }

  clickHex() {
    this.displayMessage('enter your own colors!');
  }

  hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
      r = g = b = l; // achromatic
    } else {
      var hue2rgb = function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === ' ') {
      this.generateColor();
    }
  }
}
