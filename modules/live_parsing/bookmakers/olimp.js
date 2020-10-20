const puppeteer = require(`puppeteer`);


let olimpPage;
async function olimpParsing() {
    const browser = await puppeteer.launch({headless: false, args: ['--no-sandbox']});
    olimpPage = await browser.newPage();
    await olimpPage.setViewport({width: 1920, height: 1080});
    await olimpPage.goto('https://www.olimp.bet/live');
    await olimpPage.waitForSelector('#root > div > div.routes__StyledApp-sc-1q7p8dg-0.oVDye > div > div.content > div')
    setInterval(async () => {
        let matches = await live()
    }, 500)

    async function live() {
        let result = await olimpPage.evaluate(() => {
            let data = [];
            let disciplines = document.querySelector('#root > div > div.routes__StyledApp-sc-1q7p8dg-0.oVDye > div > div.content > div').children;
            let discipline = '';
            let platform = '';
            let team_1 = '';
            let team_2 = '';
            let koef_1 = '';
            let koef_2 = '';
            let href = '';
            let id = '';
            let fora = {};
            let total = {};
            let tournament = '';
            let drawn_game = '';
            let winner1_or_noWinners = '';
            let winner1_or_winner2 = '';
            let winner2_or_noWinners = '';
            for (let element of disciplines) {
                if (element.classList[0] != 'matches__Handler-sc-1tpetmk-0' && element.classList[0] != 'styled__OuterWrap-sc-1m8ylsn-1') {
                    if (element.classList[0] === 'head__StyledWrap-h49frn-0') {
                        discipline = element.textContent.toLowerCase();
                        platform = 'olimp';
                    }
                    if (element.classList[0] === 'styled__Matches-sc-14faxw8-2') {
                        for (let elem of element.children[0].children) {
                            if (elem.classList[0] === 'styled__ShotItem-sc-14faxw8-3') {
                                tournament = elem.children[0].textContent.toLowerCase()
                            }
                            if (elem.classList[0] === 'common__Item-sc-1p0w8dw-0') {
                                team_1 = elem.children[0].children[0].children[0].textContent.split(' - ')[0].toLowerCase().replace(/\./g, '');
                                team_2 = elem.children[0].children[0].children[0].textContent.split(' - ')[1].toLowerCase().replace(/\./g, '');
                                href = elem.children[0].children[0].children[0].children[0].children[0].href;
                                id = elem.children[0].children[0].children[0].children[0].children[0].href.match(/\d+\/\d+\/\d+/g)[0].replace(/\//g, '');
                                if (elem.children[0].children.length > 2) { // ставки закрыты
                                    koef_1 = '';
                                    koef_2 = '';
                                    fora = {
                                        fora_value: ' ',
                                        fora_koef1: '',
                                        fora_koef2: '',
                                    }
                                    total = {
                                        total_value: '',
                                        total_tb: '',
                                        total_tm: '',
                                    }
                                    data.push(id)
                                    sessionStorage.setItem(id, JSON.stringify(removeMinus({
                                        id,
                                        team_1,
                                        koef_1,
                                        team_2,
                                        koef_2,
                                        fora,
                                        total,
                                        platform,
                                        tournament,
                                        discipline,
                                        href,
                                    })))
                                } else {
                                    if (elem.children[0].children[1].children[0].children.length > 10) {
                                        koef_1 = elem.children[0].children[1].children[0].children[0].innerText;
                                        koef_2 = elem.children[0].children[1].children[0].children[2].innerText;
                                        drawn_game = elem.children[0].children[1].children[0].children[1].innerText;
                                        winner1_or_noWinners = elem.children[0].children[1].children[0].children[3].innerText;
                                        winner1_or_winner2 = elem.children[0].children[1].children[0].children[4].innerText;
                                        winner2_or_noWinners = elem.children[0].children[1].children[0].children[5].innerText;
                                        fora = {
                                            fora_value: `${elem.children[0].children[1].children[0].children[6].innerText} ${elem.children[0].children[1].children[0].children[8].innerText}`,
                                            fora_koef1: elem.children[0].children[1].children[0].children[7].innerText,
                                            fora_koef2: elem.children[0].children[1].children[0].children[9].innerText,
                                        }
                                        total = {
                                            total_value: elem.children[0].children[1].children[0].children[10].innerText,
                                            total_tb: elem.children[0].children[1].children[0].children[11].innerText,
                                            total_tm: elem.children[0].children[1].children[0].children[12].innerText,
                                        }
                                        data.push(id)
                                        sessionStorage.setItem(id, JSON.stringify(removeMinus({
                                            id,
                                            team_1,
                                            koef_1,
                                            team_2,
                                            koef_2,
                                            drawn_game,
                                            winner1_or_noWinners,
                                            winner1_or_winner2,
                                            winner2_or_noWinners,
                                            fora,
                                            total,
                                            platform,
                                            tournament,
                                            discipline,
                                            href
                                        })))
                                    } else {
                                        koef_1 = elem.children[0].children[1].children[0].children[0].innerText;
                                        koef_2 = elem.children[0].children[1].children[0].children[1].innerText;
                                        fora = {
                                            fora_value: `${elem.children[0].children[1].children[0].children[2].innerText} ${elem.children[0].children[1].children[0].children[4].innerText}`,
                                            fora_koef1: elem.children[0].children[1].children[0].children[3].innerText,
                                            fora_koef2: elem.children[0].children[1].children[0].children[5].innerText,
                                        }
                                        total = {
                                            total_value: elem.children[0].children[1].children[0].children[6].innerText,
                                            total_tb: elem.children[0].children[1].children[0].children[7].innerText,
                                            total_tm: elem.children[0].children[1].children[0].children[8].innerText,
                                        }
                                        data.push(id)
                                        sessionStorage.setItem(id, JSON.stringify(removeMinus({
                                            id,
                                            team_1,
                                            koef_1,
                                            team_2,
                                            koef_2,
                                            fora,
                                            total,
                                            platform,
                                            tournament,
                                            discipline,
                                            href,
                                        })))
                                    }
                                }
                            }
                        }
                    }
                }
                //end
            }
            let keys = Object.keys(sessionStorage);
            deleteMathes(data, keys)

            function removeMinus(obj) {
                for (let key in obj) {
                    if (obj[key] == '—') {
                        obj[key] = '';
                    }
                    if (typeof obj[key] === 'object') {
                        if (key === 'fora') {
                            for (let key2 in obj[key]) {
                                if (key2 === 'fora_value') {
                                    if (obj[key][key2] == '— —') {
                                        obj[key][key2] = ' ';
                                    }
                                }
                                if (obj[key][key2] == '—') {
                                    obj[key][key2] = '';
                                }
                            }
                        }
                        if (key === 'total') {
                            for (let key2 in obj[key]) {
                                if (obj[key][key2] == '—') {
                                    obj[key][key2] = '';
                                }
                            }
                        }
                    }
                }
                return obj
            }

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
        })
        return result
    }
    console.log("Парсинг на олимпе запущен")
}
async function getPageOlimp(){
    return olimpPage;
}
module.exports = {olimpParsing, getPageOlimp};