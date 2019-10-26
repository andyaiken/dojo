const puppeteer = require('puppeteer');

let browser = null;
let page = null;

let timeout = 10000;

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
    await page.waitForSelector('.dojo');
});

afterEach(async () => {
    browser.close();
});

describe('Parties', () => {
    test('Test 1', async () => {
      expect(true).toBe(true);
    }, timeout);
});

describe('Monsters', () => {
    test('Test 1', async () => {
      expect(true).toBe(true);
    }, timeout);
});

describe('Encounters', () => {
    test('Test 1', async () => {
      expect(true).toBe(true);
    }, timeout);
});

describe('Maps', () => {
    test('Test 1', async () => {
      expect(true).toBe(true);
    }, timeout);
});

describe('Combats', () => {
    test('Test 1', async () => {
      expect(true).toBe(true);
    }, timeout);
});
