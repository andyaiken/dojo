const puppeteer = require('puppeteer');

var browser = null;
var page = null;

var timeout = 10000;

var getText = async selector => {
    var title = await page.waitForSelector(selector);
    return await page.evaluate(e => e.innerText, title);
}

beforeAll(async () => {
    //
});

beforeEach(async () => {
    browser = await puppeteer.launch({
        headless: true
    });
    page = await browser.newPage();

    await page.goto('http://localhost:3000/');
    await page.waitForSelector('.dojo');
});

afterEach(async () => {
    browser.close();
});

afterAll(async () => {
    //
});

describe('Parties', () => {
    test('Test 1', async () => {
      var button = await page.waitForSelector('.page-footer .navigator-item.pcs');
      await button.click();
      var text = await getText('.page-header .app-title');
      expect(text).toBe('DOJO: PCS');
    }, timeout);
});

describe('Monsters', () => {
    test('Test 1', async () => {
      var button = await page.waitForSelector('.page-footer .navigator-item.monsters');
      await button.click();
      expect(true).toBe(true);
    }, timeout);
});

describe('Encounters', () => {
    test('Test 1', async () => {
      var button = await page.waitForSelector('.page-footer .navigator-item.encounters');
      await button.click();
      expect(true).toBe(true);
    }, timeout);
});

describe('Maps', () => {
    test('Test 1', async () => {
      var button = await page.waitForSelector('.page-footer .navigator-item.maps');
      await button.click();
      expect(true).toBe(true);
    }, timeout);
});

describe('Combats', () => {
    test('Test 1', async () => {
      var button = await page.waitForSelector('.page-footer .navigator-item.combat');
      await button.click();
      expect(true).toBe(true);
    }, timeout);
});
