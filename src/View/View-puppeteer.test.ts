import * as puppeteer from 'puppeteer';
import * as path from 'path';

describe('Horizontal slider', () => {
  describe('move left thumb', () => {
    it('when left thumb is being dragged, it`s position is being changed', async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`file:${path.resolve(__dirname, '../../dist/forPuppeteerHorizontal/index.html')}`);
      const leftThumb = await page.$('.range-slider__thumb_left');
      const boxBefore = await leftThumb?.boundingBox();
      const x = boxBefore ? boxBefore.x + boxBefore.width / 2 : undefined;
      const y = boxBefore ? boxBefore.y + boxBefore.height / 2 : undefined;
      if (x !== undefined && y !== undefined) {
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x + 100, y);
        await page.mouse.up();
      }
      const boxAfter = await leftThumb?.boundingBox();
      expect(boxBefore?.x).not.toBe(boxAfter?.x);
      await browser.close();
    }, 10000);

    it('when left thumb is being dragged, position of left value label is being changed', async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`file:${path.resolve(__dirname, '../../dist/forPuppeteerHorizontal/index.html')}`);
      const leftValueLabelPositionBefore = await page.evaluate('document.querySelector(".range-slider__value-label_left").getBoundingClientRect().x');
      const leftThumb = await page.$('.range-slider__thumb_left');
      const box = await leftThumb?.boundingBox();
      const x = box ? box.x + box.width / 2 : undefined;
      const y = box ? box.y + box.height / 2 : undefined;
      if (x !== undefined && y !== undefined) {
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x + 100, y);
        await page.mouse.up();
      }
      const leftValueLabelPositionAfter = await page.evaluate('document.querySelector(".range-slider__value-label_left").getBoundingClientRect().x');
      expect(leftValueLabelPositionBefore).not.toBe(leftValueLabelPositionAfter);
      await browser.close();
    }, 10000);

    it('when left thumb is being dragged, text in left value label is being changed', async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`file:${path.resolve(__dirname, '../../dist/forPuppeteerHorizontal/index.html')}`);
      const leftValueLabelTextBefore = await page.evaluate('document.querySelector(".range-slider__value-label_left").textContent');
      const leftThumb = await page.$('.range-slider__thumb_left');
      const box = await leftThumb?.boundingBox();
      const x = box ? box.x + box.width / 2 : undefined;
      const y = box ? box.y + box.height / 2 : undefined;
      if (x !== undefined && y !== undefined) {
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x + 100, y);
        await page.mouse.up();
      }
      const leftValueLabelTextAfter = await page.evaluate('document.querySelector(".range-slider__value-label_left").textContent');
      expect(leftValueLabelTextBefore).not.toBe(leftValueLabelTextAfter);
      await browser.close();
    }, 10000);

    it('when 2 value labels get too close, they merge', async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`file:${path.resolve(__dirname, '../../dist/forPuppeteerHorizontal/index.html')}`);
      const leftThumb = await page.$('.range-slider__thumb_left');
      const box = await leftThumb?.boundingBox();
      const x = box ? box.x + box.width / 2 : undefined;
      const y = box ? box.y + box.height / 2 : undefined;
      if (x !== undefined && y !== undefined) {
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x + 150, y);
        await page.mouse.up();
      }
      const leftValueLabelOpacity = await page.evaluate('document.querySelector(".range-slider__value-label_left").style.opacity');
      const commonValueLabelOpacity = await page.evaluate('document.querySelector(".range-slider__value-label_common").style.opacity');
      expect(leftValueLabelOpacity).toBe('0');
      expect(commonValueLabelOpacity).toBe('1');
      await browser.close();
    }, 10000);

    it('when 2 value labels get too close and then get too far, they split', async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`file:${path.resolve(__dirname, '../../dist/forPuppeteerHorizontal/index.html')}`);
      const leftThumb = await page.$('.range-slider__thumb_left');
      const box = await leftThumb?.boundingBox();
      const x = box ? box.x + box.width / 2 : undefined;
      const y = box ? box.y + box.height / 2 : undefined;
      if (x !== undefined && y !== undefined) {
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x + 150, y);
      }
      let leftValueLabelOpacity = await page.evaluate('document.querySelector(".range-slider__value-label_left").style.opacity');
      let commonValueLabelOpacity = await page.evaluate('document.querySelector(".range-slider__value-label_common").style.opacity');
      expect(leftValueLabelOpacity).toBe('0');
      expect(commonValueLabelOpacity).toBe('1');
      if (x !== undefined && y !== undefined) {
        await page.mouse.move(x, y);
        await page.mouse.up();
      }
      leftValueLabelOpacity = await page.evaluate('document.querySelector(".range-slider__value-label_left").style.opacity');
      commonValueLabelOpacity = await page.evaluate('document.querySelector(".range-slider__value-label_common").style.opacity');
      expect(leftValueLabelOpacity).toBe('1');
      expect(commonValueLabelOpacity).toBe('0');
      await browser.close();
    }, 10000);

    it('when left value label gets too close to min label, min label hides', async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`file:${path.resolve(__dirname, '../../dist/forPuppeteerHorizontal/index.html')}`);
      const leftThumb = await page.$('.range-slider__thumb_left');
      const box = await leftThumb?.boundingBox();
      const x = box ? box.x + box.width / 2 : undefined;
      const y = box ? box.y + box.height / 2 : undefined;
      if (x !== undefined && y !== undefined) {
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x - 50, y);
        await page.mouse.up();
      }
      const minLabelOpacity = await page.evaluate('document.querySelector(".range-slider__min-max-label_left").style.opacity');
      expect(minLabelOpacity).toBe('0');
      await browser.close();
    }, 10000);
  });

  describe('move right thumb', () => {
    it('when right thumb is being dragged, it`s position is being changed', async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`file:${path.resolve(__dirname, '../../dist/forPuppeteerHorizontal/index.html')}`);
      const rightThumb = await page.$('.range-slider__thumb_right');
      const boxBefore = await rightThumb?.boundingBox();
      const x = boxBefore ? boxBefore.x + boxBefore.width / 2 : undefined;
      const y = boxBefore ? boxBefore.y + boxBefore.height / 2 : undefined;
      if (x !== undefined && y !== undefined) {
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x - 100, y);
        await page.mouse.up();
      }
      const boxAfter = await rightThumb?.boundingBox();
      expect(boxBefore?.x).not.toBe(boxAfter?.x);
      await browser.close();
    });

    it('when right thumb is being dragged, position of right value label is being changed', async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`file:${path.resolve(__dirname, '../../dist/forPuppeteerHorizontal/index.html')}`);
      const rightValueLabelPositionBefore = await page.evaluate('document.querySelector(".range-slider__value-label_right").getBoundingClientRect().x');
      const rightThumb = await page.$('.range-slider__thumb_right');
      const box = await rightThumb?.boundingBox();
      const x = box ? box.x + box.width / 2 : undefined;
      const y = box ? box.y + box.height / 2 : undefined;
      if (x !== undefined && y !== undefined) {
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x - 100, y);
        await page.mouse.up();
      }
      const rightValueLabelPositionAfter = await page.evaluate('document.querySelector(".range-slider__value-label_right").getBoundingClientRect().x');
      expect(rightValueLabelPositionBefore).not.toBe(rightValueLabelPositionAfter);
      await browser.close();
    }, 10000);

    it('when right thumb is being dragged, text in right value label is being changed', async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`file:${path.resolve(__dirname, '../../dist/forPuppeteerHorizontal/index.html')}`);
      const rightValueLabelTextBefore = await page.evaluate('document.querySelector(".range-slider__value-label_right").textContent');
      const rightThumb = await page.$('.range-slider__thumb_right');
      const box = await rightThumb?.boundingBox();
      const x = box ? box.x + box.width / 2 : undefined;
      const y = box ? box.y + box.height / 2 : undefined;
      if (x !== undefined && y !== undefined) {
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x - 100, y);
        await page.mouse.up();
      }
      const rightValueLabelTextAfter = await page.evaluate('document.querySelector(".range-slider__value-label_right").textContent');
      expect(rightValueLabelTextBefore).not.toBe(rightValueLabelTextAfter);
      await browser.close();
    }, 10000);

    it('when 2 value labels get too close, they merge', async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`file:${path.resolve(__dirname, '../../dist/forPuppeteerHorizontal/index.html')}`);
      const rightThumb = await page.$('.range-slider__thumb_right');
      const box = await rightThumb?.boundingBox();
      const x = box ? box.x + box.width / 2 : undefined;
      const y = box ? box.y + box.height / 2 : undefined;
      if (x !== undefined && y !== undefined) {
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x - 150, y);
        await page.mouse.up();
      }
      const rightValueLabelOpacity = await page.evaluate('document.querySelector(".range-slider__value-label_right").style.opacity');
      const commonValueLabelOpacity = await page.evaluate('document.querySelector(".range-slider__value-label_common").style.opacity');
      expect(rightValueLabelOpacity).toBe('0');
      expect(commonValueLabelOpacity).toBe('1');
      await browser.close();
    }, 10000);

    it('when 2 value labels get too close and then get too far, they split', async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`file:${path.resolve(__dirname, '../../dist/forPuppeteerHorizontal/index.html')}`);
      const leftThumb = await page.$('.range-slider__thumb_right');
      const box = await leftThumb?.boundingBox();
      const x = box ? box.x + box.width / 2 : undefined;
      const y = box ? box.y + box.height / 2 : undefined;
      if (x !== undefined && y !== undefined) {
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x - 150, y);
      }
      let leftValueLabelOpacity = await page.evaluate('document.querySelector(".range-slider__value-label_left").style.opacity');
      let commonValueLabelOpacity = await page.evaluate('document.querySelector(".range-slider__value-label_common").style.opacity');
      expect(leftValueLabelOpacity).toBe('0');
      expect(commonValueLabelOpacity).toBe('1');
      if (x !== undefined && y !== undefined) {
        await page.mouse.move(x, y);
        await page.mouse.up();
      }
      leftValueLabelOpacity = await page.evaluate('document.querySelector(".range-slider__value-label_left").style.opacity');
      commonValueLabelOpacity = await page.evaluate('document.querySelector(".range-slider__value-label_common").style.opacity');
      expect(leftValueLabelOpacity).toBe('1');
      expect(commonValueLabelOpacity).toBe('0');
      await browser.close();
    }, 10000);

    it('when right value label gets too close to max label, max label hides', async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`file:${path.resolve(__dirname, '../../dist/forPuppeteerHorizontal/index.html')}`);
      const rightThumb = await page.$('.range-slider__thumb_right');
      const box = await rightThumb?.boundingBox();
      const x = box ? box.x + box.width / 2 : undefined;
      const y = box ? box.y + box.height / 2 : undefined;
      if (x !== undefined && y !== undefined) {
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x + 180, y);
        await page.mouse.up();
      }
      const maxLabelOpacity = await page.evaluate('document.querySelector(".range-slider__min-max-label_right").style.opacity');
      expect(maxLabelOpacity).toBe('0');
      await browser.close();
    }, 10000);
  });
});

describe('Vertical slider', () => {
  describe('move left thumb', () => {
    it('when left thumb is being dragged, it`s position is being changed', async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`file:${path.resolve(__dirname, '../../dist/forPuppeteerVertical/index.html')}`);
      const leftThumb = await page.$('.range-slider__thumb_left');
      const boxBefore = await leftThumb?.boundingBox();
      const x = boxBefore ? boxBefore.x + boxBefore.width / 2 : undefined;
      const y = boxBefore ? boxBefore.y + boxBefore.height / 2 : undefined;
      if (x !== undefined && y !== undefined) {
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x, y - 100);
        await page.mouse.up();
      }
      const boxAfter = await leftThumb?.boundingBox();
      expect(boxBefore?.y).not.toBe(boxAfter?.y);
      await browser.close();
    }, 10000);

    it('when left thumb is being dragged, position of left value label is being changed', async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`file:${path.resolve(__dirname, '../../dist/forPuppeteerVertical/index.html')}`);
      const leftValueLabelPositionBefore = await page.evaluate('document.querySelector(".range-slider__value-label_left").getBoundingClientRect().y');
      const leftThumb = await page.$('.range-slider__thumb_left');
      const box = await leftThumb?.boundingBox();
      const x = box ? box.x + box.width / 2 : undefined;
      const y = box ? box.y + box.height / 2 : undefined;
      if (x !== undefined && y !== undefined) {
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x, y - 100);
        await page.mouse.up();
      }
      const leftValueLabelPositionAfter = await page.evaluate('document.querySelector(".range-slider__value-label_left").getBoundingClientRect().y');
      expect(leftValueLabelPositionBefore).not.toBe(leftValueLabelPositionAfter);
      await browser.close();
    }, 10000);

    it('when left thumb is being dragged, text in left value label is being changed', async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`file:${path.resolve(__dirname, '../../dist/forPuppeteerVertical/index.html')}`);
      const leftValueLabelTextBefore = await page.evaluate('document.querySelector(".range-slider__value-label_left").textContent');
      const leftThumb = await page.$('.range-slider__thumb_left');
      const box = await leftThumb?.boundingBox();
      const x = box ? box.x + box.width / 2 : undefined;
      const y = box ? box.y + box.height / 2 : undefined;
      if (x !== undefined && y !== undefined) {
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x, y - 100);
        await page.mouse.up();
      }
      const leftValueLabelTextAfter = await page.evaluate('document.querySelector(".range-slider__value-label_left").textContent');
      expect(leftValueLabelTextBefore).not.toBe(leftValueLabelTextAfter);
      await browser.close();
    }, 10000);

    it('when 2 value labels get too close, they merge', async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`file:${path.resolve(__dirname, '../../dist/forPuppeteerVertical/index.html')}`);
      const leftThumb = await page.$('.range-slider__thumb_left');
      const box = await leftThumb?.boundingBox();
      const x = box ? box.x + box.width / 2 : undefined;
      const y = box ? box.y + box.height / 2 : undefined;
      if (x !== undefined && y !== undefined) {
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x, y - 150);
        await page.mouse.up();
      }
      const leftValueLabelOpacity = await page.evaluate('document.querySelector(".range-slider__value-label_left").style.opacity');
      const commonValueLabelOpacity = await page.evaluate('document.querySelector(".range-slider__value-label_common").style.opacity');
      expect(leftValueLabelOpacity).toBe('0');
      expect(commonValueLabelOpacity).toBe('1');
      await browser.close();
    }, 10000);

    it('when 2 value labels get too close and then get too far, they split', async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`file:${path.resolve(__dirname, '../../dist/forPuppeteerVertical/index.html')}`);
      const leftThumb = await page.$('.range-slider__thumb_left');
      const box = await leftThumb?.boundingBox();
      const x = box ? box.x + box.width / 2 : undefined;
      const y = box ? box.y + box.height / 2 : undefined;
      if (x !== undefined && y !== undefined) {
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x, y - 150);
      }
      let leftValueLabelOpacity = await page.evaluate('document.querySelector(".range-slider__value-label_left").style.opacity');
      let commonValueLabelOpacity = await page.evaluate('document.querySelector(".range-slider__value-label_common").style.opacity');
      expect(leftValueLabelOpacity).toBe('0');
      expect(commonValueLabelOpacity).toBe('1');
      if (x !== undefined && y !== undefined) {
        await page.mouse.move(x, y);
        await page.mouse.up();
      }
      leftValueLabelOpacity = await page.evaluate('document.querySelector(".range-slider__value-label_left").style.opacity');
      commonValueLabelOpacity = await page.evaluate('document.querySelector(".range-slider__value-label_common").style.opacity');
      expect(leftValueLabelOpacity).toBe('1');
      expect(commonValueLabelOpacity).toBe('0');
      await browser.close();
    }, 10000);

    it('when left value label gets too close to min label, min label hides', async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`file:${path.resolve(__dirname, '../../dist/forPuppeteerVertical/index.html')}`);
      const leftThumb = await page.$('.range-slider__thumb_left');
      const box = await leftThumb?.boundingBox();
      const x = box ? box.x + box.width / 2 : undefined;
      const y = box ? box.y + box.height / 2 : undefined;
      if (x !== undefined && y !== undefined) {
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x, y + 60);
        await page.mouse.up();
      }
      const minLabelOpacity = await page.evaluate('document.querySelector(".range-slider__min-max-label_left").style.opacity');
      expect(minLabelOpacity).toBe('0');
      await browser.close();
    }, 10000);
  });

  describe('move right thumb', () => {
    it('when right thumb is being dragged, it`s position is being changed', async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`file:${path.resolve(__dirname, '../../dist/forPuppeteerVertical/index.html')}`);
      const rightThumb = await page.$('.range-slider__thumb_right');
      const boxBefore = await rightThumb?.boundingBox();
      const x = boxBefore ? boxBefore.x + boxBefore.width / 2 : undefined;
      const y = boxBefore ? boxBefore.y + boxBefore.height / 2 : undefined;
      if (x !== undefined && y !== undefined) {
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x, y + 100);
        await page.mouse.up();
      }
      const boxAfter = await rightThumb?.boundingBox();
      expect(boxBefore?.y).not.toBe(boxAfter?.y);
      await browser.close();
    });

    it('when right thumb is being dragged, position of right value label is being changed', async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`file:${path.resolve(__dirname, '../../dist/forPuppeteerVertical/index.html')}`);
      const rightValueLabelPositionBefore = await page.evaluate('document.querySelector(".range-slider__value-label_right").getBoundingClientRect().y');
      const rightThumb = await page.$('.range-slider__thumb_right');
      const box = await rightThumb?.boundingBox();
      const x = box ? box.x + box.width / 2 : undefined;
      const y = box ? box.y + box.height / 2 : undefined;
      if (x !== undefined && y !== undefined) {
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x, y + 100);
        await page.mouse.up();
      }
      const rightValueLabelPositionAfter = await page.evaluate('document.querySelector(".range-slider__value-label_right").getBoundingClientRect().y');
      expect(rightValueLabelPositionBefore).not.toBe(rightValueLabelPositionAfter);
      await browser.close();
    }, 10000);

    it('when right thumb is being dragged, text in right value label is being changed', async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`file:${path.resolve(__dirname, '../../dist/forPuppeteerVertical/index.html')}`);
      const rightValueLabelTextBefore = await page.evaluate('document.querySelector(".range-slider__value-label_right").textContent');
      const rightThumb = await page.$('.range-slider__thumb_right');
      const box = await rightThumb?.boundingBox();
      const x = box ? box.x + box.width / 2 : undefined;
      const y = box ? box.y + box.height / 2 : undefined;
      if (x !== undefined && y !== undefined) {
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x, y + 100);
        await page.mouse.up();
      }
      const rightValueLabelTextAfter = await page.evaluate('document.querySelector(".range-slider__value-label_right").textContent');
      expect(rightValueLabelTextBefore).not.toBe(rightValueLabelTextAfter);
      await browser.close();
    }, 10000);

    it('when 2 value labels get too close, they merge', async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`file:${path.resolve(__dirname, '../../dist/forPuppeteerVertical/index.html')}`);
      const rightThumb = await page.$('.range-slider__thumb_right');
      const box = await rightThumb?.boundingBox();
      const x = box ? box.x + box.width / 2 : undefined;
      const y = box ? box.y + box.height / 2 : undefined;
      if (x !== undefined && y !== undefined) {
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x, y + 150);
        await page.mouse.up();
      }
      const rightValueLabelOpacity = await page.evaluate('document.querySelector(".range-slider__value-label_right").style.opacity');
      const commonValueLabelOpacity = await page.evaluate('document.querySelector(".range-slider__value-label_common").style.opacity');
      expect(rightValueLabelOpacity).toBe('0');
      expect(commonValueLabelOpacity).toBe('1');
      await browser.close();
    }, 10000);

    it('when 2 value labels get too close and then get too far, they split', async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`file:${path.resolve(__dirname, '../../dist/forPuppeteerVertical/index.html')}`);
      const leftThumb = await page.$('.range-slider__thumb_right');
      const box = await leftThumb?.boundingBox();
      const x = box ? box.x + box.width / 2 : undefined;
      const y = box ? box.y + box.height / 2 : undefined;
      if (x !== undefined && y !== undefined) {
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x, y + 150);
      }
      let leftValueLabelOpacity = await page.evaluate('document.querySelector(".range-slider__value-label_left").style.opacity');
      let commonValueLabelOpacity = await page.evaluate('document.querySelector(".range-slider__value-label_common").style.opacity');
      expect(leftValueLabelOpacity).toBe('0');
      expect(commonValueLabelOpacity).toBe('1');
      if (x !== undefined && y !== undefined) {
        await page.mouse.move(x, y);
        await page.mouse.up();
      }
      leftValueLabelOpacity = await page.evaluate('document.querySelector(".range-slider__value-label_left").style.opacity');
      commonValueLabelOpacity = await page.evaluate('document.querySelector(".range-slider__value-label_common").style.opacity');
      expect(leftValueLabelOpacity).toBe('1');
      expect(commonValueLabelOpacity).toBe('0');
      await browser.close();
    }, 10000);

    it('when right value label gets too close to max label, max label hides', async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`file:${path.resolve(__dirname, '../../dist/forPuppeteerVertical/index.html')}`);
      const rightThumb = await page.$('.range-slider__thumb_right');
      const box = await rightThumb?.boundingBox();
      const x = box ? box.x + box.width / 2 : undefined;
      const y = box ? box.y + box.height / 2 : undefined;
      if (x !== undefined && y !== undefined) {
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x, y - 220);
        await page.mouse.up();
      }
      const maxLabelOpacity = await page.evaluate('document.querySelector(".range-slider__min-max-label_right").style.opacity');
      expect(maxLabelOpacity).toBe('0');
      await browser.close();
    }, 10000);
  });
});
