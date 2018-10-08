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

  initialized;

  ngOnInit() {
    this.colorData = {};
    this.colorData['a'] = { lock: false };
    this.colorData['b'] = { lock: false };
    this.colorData['c'] = { lock: false };
    this.colorData['d'] = { lock: false };
    this.colorData['e'] = { lock: false };

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
    for (const field of Object.keys(this.colorData)) {
      const { rgb, lock } = this.colorData[field];
      if (lock) {
        locked.push(rgb);
      }
    }

    this.lockedAmt = locked.length;
    console.log(this.lockedAmt);
    if (this.lockedAmt === 4) {
      this.displayMessage('press r to unlock all colors');
    } else {
      for (let i = 0; i < 5; i++) {
        if (!locked[i]) {
          locked[i] = 'N';
        }
      }
      this.colormind.getColors(locked).subscribe(
        data => (this.colormindResponse = data),
        error => console.log(error),
        () => {
          this.loadColors();
          this.initialized = true;
        }
      );
    }
  }

  loadColors() {
    const { result } = this.colormindResponse;
    const { a, b, c, d, e } = this.colorData;

    result.sort(
      (y, z) => z.reduce((sum, x) => sum + x) - y.reduce((sum, x) => sum + x)
    );

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

    if (!e.lock) {
      e.rgb = result[i];
      i++;
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
  }

  clickHex() {
    this.displayMessage('enter your own colors!');
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === ' ') {
      this.generateColor();
    }

    if (event.key === 'r') {
      for (const field of Object.keys(this.colorData)) {
        this.colorData[field].lock = false;
        this.lockedAmt = 0;
      }
    }
  }
}
