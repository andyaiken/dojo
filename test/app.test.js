const puppeteer = require('puppeteer');

let browser;
let page;

beforeEach(async () => {
    browser = await puppeteer.launch({
        headless: false
    });
    page = await browser.newPage();

    page.emulate({
        viewport: {
          width: 800,
          height: 500
        },
        userAgent: ''
    });

    await page.goto('http://localhost:3000/');
});

afterEach(async () => {
    browser.close();
});

describe('Suite 1', () => {
    test('Test 1', async () => {
      expect(true).toBe(true);
    });
});
