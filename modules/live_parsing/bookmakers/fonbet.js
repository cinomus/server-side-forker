const puppeteer = require(`puppeteer`);



let fonbetPage;

async function fonbetParsing() {
    const browser = await puppeteer.launch({headless: false, timeout:0,args: ['--no-sandbox']});
    fonbetPage = await browser.newPage();
    // await fonbetPage.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
    await fonbetPage.setViewport({width: 1920, height: 1080});
    await fonbetPage.goto('https://www.fonbet.ru/live/');
    await fonbetPage.waitForSelector('#page__wrap > div.page__container.js-scroll-container.js-page-container._device_desktop._theme_red > div.page-layout--qkduQ > div > div.coupon-layout__content--gGzha > div > div.line-filter-layout__content--q-JdM > section > div.table__flex-container > table')
    setInterval(async () => {
        let fonbetMatches = await live()
    }, 500)
    async function live() {
        let result = await fonbetPage.evaluate((discip) => {
            try {
                let data = [];
                let matches = document.querySelector('#page__wrap > div.page__container.js-scroll-container.js-page-container._device_desktop._theme_red > div.page-layout--qkduQ > div > div.coupon-layout__content--gGzha > div > div.line-filter-layout__content--q-JdM > section > div.table__flex-container > table').children;
                for (let match of matches) {
                    for (let str = 0; str < match.children.length; str++) {
                        let mch = {};
                        mch.discipline = '';
                        mch.country = '';
                        mch.tournament = '';
                        mch.platform = 'fonbet';
                        if (match.children[str].children[0].classList[2] === '_indent_1') {
                            if (match.children[0].children[0].innerText.split('. ').length < 3) {
                                mch.discipline = match.children[0].children[0].innerText.split('. ')[0].toLowerCase();
                                mch.tournament = match.children[0].children[0].innerText.split('. ')[1].toLowerCase();
                            } else {
                                mch.discipline = match.children[0].children[0].innerText.toLowerCase().split('. ')[0];
                                mch.country = match.children[0].children[0].innerText.toLowerCase().split('. ')[1];
                                mch.tournament = match.children[0].children[0].innerText.toLowerCase().split('. ')[2];
                            }
                            if (mch.discipline !== 'лошадиные скачки' &&
                                mch.discipline !== 'лотереи' &&
                                mch.discipline !== 'собачьи бега'
                            ) {
                                mch.href = match.children[str].children[1].children[0].children[1].href;
                                mch.id = mch.href.match(/\d+\/\d+/)[0].replace(/\//, '');
                                mch.team_1 = match.children[str].children[1].children[0].innerText.toLowerCase().split(' — ')[0];
                                mch.team_2 = match.children[str].children[1].children[0].innerText.toLowerCase().split(' — ')[1];
                                mch.koef_1 = match.children[str].children[2].innerText;
                                mch.koef_2 = match.children[str].children[3].innerText;
                                mch.fora = {
                                    fora_value: `${match.children[str].children[4].innerText} ${match.children[str].children[6].innerText}`,
                                    fora_koef1: match.children[str].children[5].innerText,
                                    fora_koef2: match.children[str].children[7].innerText,
                                }
                                mch.total = {
                                    total_value: match.children[str].children[8].innerText,
                                    total_tb: match.children[str].children[9].innerText,
                                    total_tm: match.children[str].children[10].innerText,
                                }
                                if (match.children[0].children.length > 13) {
                                    mch.koef_2 = match.children[str].children[4].innerText;
                                    mch.drawn_game = match.children[str].children[3].innerText;
                                    mch.winner1_or_noWinners = match.children[str].children[5].innerText;
                                    mch.winner1_or_winner2 = match.children[str].children[6].innerText;
                                    mch.winner2_or_noWinners = match.children[str].children[7].innerText;
                                    mch.fora = {
                                        fora_value: `${match.children[str].children[8].innerText} ${match.children[str].children[10].innerText}`,
                                        fora_koef1: match.children[str].children[9].innerText,
                                        fora_koef2: match.children[str].children[11].innerText,
                                    }
                                    mch.total = {
                                        total_value: match.children[str].children[12].innerText,
                                        total_tb: match.children[str].children[13].innerText,
                                        total_tm: match.children[str].children[14].innerText,
                                    }
                                }
                                data.push(mch.id)
                                sessionStorage.setItem(mch.id, JSON.stringify(mch))
                            }
                        }
                    }
                }
                let keys = Object.keys(sessionStorage);
                console.log(sessionStorage)
                deleteMathes(data, keys)

                async function deleteMathes(received_matches, saved_matches) {
                    console.log('g ', received_matches.length);
                    console.log('s ', saved_matches.length);
                    let uselessMatches = [];
                    for (let saved_match of saved_matches) {
                        let result = await received_matches.filter((received_match) => {
                            if (saved_match === received_match) {
                                return saved_match;
                            }
                        })
                        if (result.length === 0) {
                            uselessMatches.push(saved_match);
                        }
                    }
                    for (let uselessMatch of uselessMatches) { // не работает цикл запускается и пробегает раньше чем выполняется предыдущий
                        sessionStorage.removeItem(uselessMatch)
                    }

                }
            } catch (e) {
                console.log(e)
            }
        });

    }

    console.log("Парсинг на фонбете запущен")
}
async function getPageFonbet(){
    return fonbetPage;
}
module.exports = {fonbetParsing, getPageFonbet};