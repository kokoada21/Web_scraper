import { load } from "cheerio";
import puppeteer from "puppeteer-core";
import { Pool } from "pg";
import axios from "axios";

interface Flat {
    title: string,
    imageUrl: string | undefined
}

const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'database',
    port: 5432,
    database: 'postgres',
  });

async function insertDataIntoDB(data: Flat[]) {
    const client = await pool.connect();
    try {
        const insertQuery = `
        INSERT INTO sreality (title, img_url)
        VALUES ($1, $2)
        `;
        for (const item of data){
            await client.query(insertQuery, [item.title, item.imageUrl]);
        }
    } finally {
        // Release the client back to the connection pool
        client.release();
    }
}


async function getData(): Promise<any> {
    const client = await pool.connect();
    try {
        // Perform an SQL INSERT query
    const selectQuery = `
        SELECT * FROM sreality
        `;
        
     return await client.query(selectQuery);
        
    } finally {
        // Release the client back to the connection pool
        client.release();
    }
}

async function deleteRecords() {
    const client = await pool.connect();
    try {
        // Perform an SQL INSERT query
    const selectQuery = `
        DELETE FROM sreality
        `;
        
     return await client.query(selectQuery);
        
    } finally {
        // Release the client back to the connection pool
        client.release();
    }
}
const flatsToScrape = 500;

async function scrapeData() {
    let parsedFlats: Flat[] = [];
    const browser = await puppeteer.launch({
        executablePath: "/usr/bin/chromium-browser",
        args: [
            '--no-sandbox',
            '--headless',
            '--disable-gpu',
            '--disable-dev-shm-usage'
          ]
    });
    const page = await browser.newPage();
    let count = 0;
    let pageCounter = 1
    console.log("Scraping started...");
    while (parsedFlats.length < flatsToScrape) {
        await page.goto(`https://www.sreality.cz/en/search/for-sale/apartments?page=${pageCounter}`, {timeout: 60000});
        await page.waitForSelector('.dir-property-list', {timeout: 60000});
        const htmlContent = await page.content();
        const $ = load(htmlContent);
        const currentFlats = $('.dir-property-list > .property');
        currentFlats.each((i, element) => {
            
            const name = $(element).find("h2").text().replace(/[\n\t]/g, '')
            const imgUrl = $(element).find("a > img").attr('src');

            const newFlat: Flat = {
                title: name,
                imageUrl: imgUrl
            }
            if(newFlat.imageUrl){
                parsedFlats.push(newFlat);
                count++
            }
            if(count >= flatsToScrape){
                return false;
            }
        })
        pageCounter++
    }
    await deleteRecords();
    await insertDataIntoDB(parsedFlats);
    console.log(parsedFlats.length);
    // console.log(parsedFlats);

}

scrapeData().then(()=>{
    console.log('Data scraped and saved');
})