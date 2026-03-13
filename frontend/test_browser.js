import puppeteer from 'puppeteer-core';
import { install } from '@puppeteer/browsers';

(async () => {
    console.log("Downloading browser...");
    const browserInfo = await install({
        cacheDir: process.cwd() + '/.cache',
        browser: 'chrome',
        buildId: '121.0.6167.85'
    });
    
    console.log("Launching browser at " + browserInfo.executablePath);
    const browser = await puppeteer.launch({ 
        executablePath: browserInfo.executablePath,
        headless: "new"
    });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('BROWSER_CONSOLE:', msg.text()));
    page.on('pageerror', error => console.error('BROWSER_ERROR:', error.message));
    
    console.log("Navigating to http://localhost:4173...");
    await page.goto('http://localhost:4173', { waitUntil: 'networkidle0' });
    
    await browser.close();
    console.log("Done.");
})();
