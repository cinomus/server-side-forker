const puppeteer = require(`puppeteer`);
const {performance} = require('perf_hooks');
const {olimpParsing, getPageOlimp} = require('./bookmakers/olimp')
const {fonbetParsing, getPageFonbet} = require('./bookmakers/fonbet')
const {maraphonParsing, getPageMaraphon} = require('./bookmakers/maraphon')


async function live_parsing() {

    await fonbetParsing();
    await olimpParsing();

    // await maraphonParsing();






}

async function getM(site) {
    if (site === 'olimp') {
        let olimpPage = await getPageOlimp()
        return olimpPage.evaluate(() => {
            let kekw = []
            let keys = Object.keys(sessionStorage);
            for (let key of keys) {
                kekw.push(JSON.parse(sessionStorage.getItem(key)));
            }
            return kekw
        })
    }
    if (site === 'fonbet') {
        let fonbetPage = await getPageFonbet();
        return fonbetPage.evaluate(() => {
            let kekw = []
            let keys = Object.keys(sessionStorage);
            for (let key of keys) {
                kekw.push(JSON.parse(sessionStorage.getItem(key)));
            }
            return kekw
        })
    }
}


module.exports = {live_parsing, getM}
