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

describe('PCs', () => {
    test('Open the PCs page', async () => {
      var button = await page.waitForSelector('.page-footer .navigator-item.pcs');
      await button.click();
      var text = await getText('.page-header .app-title');
      expect(text).toBe('DOJO: PCS');
    }, timeout);
});
