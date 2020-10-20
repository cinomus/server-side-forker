const puppeteer = require(`puppeteer`);


let maraphonPage;

async function maraphonParsing() {
    const browser = await puppeteer.launch({headless: false, args: ['--no-sandbox']});
    maraphonPage = await browser.newPage();
    await maraphonPage.setViewport({width: 1920, height: 1080});
    await maraphonPage.goto('https://www.marathonbet.ru/su/live?esids=all&ecids=all&epcids=all');
    // setInterval(async () => {
    // let matches = await live()
    // }, 500)
    async function live() {
        await maraphonPage.evaluate(() => {
            let match = {};
            let disciplines = document.querySelector('#liveEventsContent > div.selected-events-container').children;
            console.log(disciplines)
            for (let discipline of disciplines) {
                match.discipline = discipline.children[0].innerText.toLowerCase();
                for (let tournament of discipline.children[1].children){
                    tournament.children[0].innerText.toLowerCase();
                    if (tournament.children.length > 2){

                    }
                    else {

                    }

                }
            }


        })
    }
}

async function getPage() {
    return maraphonPage;
}

module.exports = {maraphonParsing, getPage};