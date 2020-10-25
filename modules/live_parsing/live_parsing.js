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
        return olimpPage.evaluate(async () => {
            let kekw = []
            let keys = Object.keys(sessionStorage);
            for (let key of keys) {
                if (key !== '__gti__' && key !== '__vw_tab_guid'){// костыль изза того что почему то сесшен стораге иначально попадает с 2 говняными элементами
                    kekw.push(JSON.parse(sessionStorage.getItem(key)));
                }
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
                if (key !== '__gti__' && key !== '__vw_tab_guid') kekw.push(JSON.parse(sessionStorage.getItem(key)));
            }
            return kekw
        })
    }
}


module.exports = {live_parsing, getM}
