const Initiator = require('./models/Initiator')
const {performance} = require('perf_hooks');
const Fork = require('./models/Fork');
const app = exports = module.exports = {};
const {live_parsing, getM} = require('./modules/live_parsing/live_parsing')

app.parse = async function parse() {
    await live_parsing();

}
app.compare = async function compare() {
    let savedOlimpMatches = [];
    let savedFonbetMatches = [];
    setInterval(async () => {

        let olimpMatches = await getM('olimp')
        let fonbetMatches = await getM('fonbet')
        console.log(`olimp: ${olimpMatches.length} fonbet: ${fonbetMatches.length}`);
        let changedKoefs = await findChangedKoefs(olimpMatches, fonbetMatches);
        await comparing(changedKoefs, olimpMatches, fonbetMatches);
        savedOlimpMatches = olimpMatches;
        savedFonbetMatches = fonbetMatches;
    }, 250)


    async function comparing(changedKoefs, ...arguments) {
        // console.log('checkpoint 1')
        let iteration1 = 0;
        let initiators = [];
        let forks = [];
        for (let arg of arguments) {
            let iteration2 = 0;
            for (let arg2 of arguments) {
                if (iteration2 <= iteration1) {
                    iteration2++;
                    continue
                } else {
                    // console.log('checkpoint 1/5')
                    for (let elem of arg) {
                        for (let elem2 of arg2) {
                            // console.log(`${elem2.id}${elem2.team_1}${elem2.team_2}`)
                            // console.log(elem.team_1 === elem2.team_1 && elem.team_2 === elem2.team_2 && elem.discipline === elem2.discipline && elem.platform !== elem2.platform)
                            // console.log(elem.team_1 ,' vs ',elem2.team_1)
                            // console.log(elem.team_2 ,' vs ',elem2.team_2)
                            // console.log(elem.discipline ,' vs ',elem2.discipline)
                            // console.log(elem.platform ,' vs ',elem2.platform)
                            if (elem.team_1 === elem2.team_1 && elem.team_2 === elem2.team_2 && elem.discipline === elem2.discipline && elem.platform !== elem2.platform) {
                                // console.log(elem, elem2);
                                // console.log('checkpoint 2')
                                if (elem.drawn_game !== undefined && elem2.drawn_game !== undefined) {
                                    await findForks(elem.koef_1, elem2.winner2_or_noWinners, undefined , undefined,'koef_1&winner2_or_noWinners')
                                    await findForks(elem.koef_2, elem2.winner1_or_noWinners, undefined, undefined, 'koef_2&winner1_or_noWinners')
                                    await findForks(elem.drawn_game, elem2.winner1_or_winner2, undefined, undefined, 'drawn&winner1_or_winner2')
                                    await ebkaSForami(elem, elem2);
                                    await ebkaSTotalami(elem, elem2);
                                } else {
                                    await findForks(elem.koef_1, elem2.koef_2, undefined, undefined, 'koef_1&koef_2');
                                    await findForks(elem.koef_2, elem2.koef_1, undefined, undefined, 'koef_2&koef_1')
                                    await ebkaSForami(elem, elem2);
                                    await ebkaSTotalami(elem, elem2);
                                }
                            }

                            async function ebkaSForami(elem, elem2) {
                                if (elem2.fora.fora_value !== ' ' && elem.fora.fora_value !== ' ') {
                                    let values1 = elem.fora.fora_value.split(' ');
                                    let values2 = elem2.fora.fora_value.split(' ')
                                    // TODO: сделать сортировку форы UPDATE 06/10/20 17:40 UPD 09/10/20 изменить таргеты у фор оно показывает не то
                                    if (elem2.fora.fora_value === elem.fora.fora_value) {
                                        await findForks(elem.fora.fora_koef1, elem2.fora.fora_koef2, values1[0], values2[1], 'fora_koef1&fora_koef2')
                                        await findForks(elem.fora.fora_koef2, elem2.fora.fora_koef1, values1[1], values2[0], 'fora_koef2&fora_koef1')
                                    } else {
                                        // console.log(+values1[0],+values1[1],+values2[0],+values2[1])
                                        if (+values1[0] > +values1[1]) {
                                            // console.log('yes')
                                            if (+values2[0] > +values2[1]) {
                                                // console.log('yes')
                                                if (+values1[0] > +values2[0]) {
                                                    // console.log('yes')
                                                    await findForks(elem.fora.fora_koef1, elem2.fora.fora_koef2, values1[0], values2[1], 'fora_koef2&fora_koef1')
                                                } else {
                                                    // console.log('no')
                                                    await findForks(elem.fora.fora_koef2, elem2.fora.fora_koef1, values1[1], values2[0], 'fora_koef1&fora_koef2')
                                                }
                                            } else {
                                                // console.log('no')
                                                if (+values1[0] > +values2[1]) {
                                                    // console.log('yes')
                                                    await findForks(elem.fora.fora_koef1, elem2.fora.fora_koef1, values1[0], values2[0], 'fora_koef1&fora_koef1')
                                                } else {
                                                    // console.log('no')
                                                    await findForks(elem.fora.fora_koef2, elem2.fora.fora_koef2, values1[1], values2[1], 'fora_koef2&fora_koef2')
                                                }
                                            }
                                        } else {
                                            // console.log('no')
                                            if (+values2[0] < +values2[1]) {
                                                // console.log('yes')
                                                if (+values1[1] > +values2[1]) {
                                                    // console.log('yes')
                                                    await findForks(elem.fora.fora_koef2, elem2.fora.fora_koef1, values1[1], values2[0], 'fora_koef2&fora_koef2')
                                                } else {
                                                    // console.log('no')
                                                    await findForks(elem.fora.fora_koef1, elem2.fora.fora_koef2, values1[0], values2[1], 'fora_koef1&fora_koef2')
                                                }
                                            } else {
                                                // console.log('no')
                                                if (+values1[1] > +values2[0]) {
                                                    // console.log('yes')
                                                    await findForks(elem.fora.fora_koef2, elem2.fora.fora_koef2, values1[1], values2[1], 'fora_koef2&fora_koef2')
                                                } else {
                                                    // console.log('no')
                                                    await findForks(elem.fora.fora_koef1, elem2.fora.fora_koef1, values1[0], values2[0], 'fora_koef1&fora_koef1')
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            async function ebkaSTotalami(elem, elem2) {
                                if (elem2.total.total_value !== '' && elem.total.total_value !== '') {
                                    if (elem.total.total_value === elem2.total.total_value) {
                                        await findForks(elem.total.total_tb, elem2.total.total_tm, elem.total.total_value, elem2.total.total_value, 'total_tb&total_tm')
                                        await findForks(elem.total.total_tm, elem2.total.total_tb, elem.total.total_value, elem2.total.total_value, 'total_tm&total_tb')
                                    } else if (+elem.total.total_value < +elem2.total.total_value) {
                                        await findForks(elem.total.total_tb, elem2.total.total_tm, elem.total.total_value, elem2.total.total_value, 'total_tb&total_tm')
                                    } else if (+elem.total.total_value > +elem2.total.total_value) {
                                        await findForks(elem.total.total_tm, elem2.total.total_tb, elem.total.total_value, elem2.total.total_value, 'total_tm&total_tb')
                                    }
                                }
                            }

                            async function findForks(value1, value2, target1 = 'none', target2 = 'none', event) {
                                // console.log('checkpoint 3')
                                 // console.log(`${value1} ${value2}`)
                                if (await valueCheck(value1) && await valueCheck(value2)) {

                                    let forkValue = (1 / +value1) + (1 / +value2);
                                    if (forkValue < 1) {
                                        // console.log(`${elem.team_1} ${elem.team_2} ${value1} ${value2} ${forkValue}`)
                                        //TODO: здесь создаем объект вилки, а далее проверяем кэфы на инициатора, если кэф есть в
                                        // измененных кэфах то добавляем его в инициатора
                                        // также нужно в Initiator.js добавить функцию которая бы удаляла старые инициаторы
                                        await checkAndAddInitiator({
                                            id: elem.id,
                                            team_1: elem.team_1,
                                            team_2: elem.team_2,
                                            platform: elem.platform,
                                            href: elem.href,
                                            target: target1,
                                            koef: event.split('&')[0],
                                            koef_value: value1,
                                        })
                                        await checkAndAddInitiator({
                                            id: elem2.id,
                                            team_1: elem2.team_1,
                                            team_2: elem2.team_2,
                                            platform: elem2.platform,
                                            href: elem2.href,
                                            target: target2,
                                            koef: event.split('&')[1],
                                            koef_value: value2,
                                        })
                                        // console.log('chechpoint 4')
                                        let fork = new Fork(await getInitiator(elem.id,event.split('&')[0]),await getInitiator(elem2.id,event.split('&')[1]),elem.discipline, await calcProfit(forkValue))
                                        await fork.addFork()
                                        forks.push(fork);
                                        // console.log(fork)
                                        // console.log('kekw',await getInitiator(elem.id,event.split('&')[0]))
                                    }
                                }

                                async function checkAndAddInitiator(possibleInitiator) {
                                    let filtredInitiators = initiators.filter((takedInitiator) => {
                                        if (takedInitiator.id === possibleInitiator.id &&
                                            takedInitiator.team_1 === possibleInitiator.team_1 &&
                                            takedInitiator.team_2 === possibleInitiator.team_2 &&
                                            takedInitiator.platform === possibleInitiator.platform &&
                                            takedInitiator.koef === possibleInitiator.koef) {
                                            return possibleInitiator
                                        }
                                    })
                                    if (filtredInitiators.length === 0) {
                                        possibleInitiator.triggered = 1;
                                        let itors = changedKoefs.filter((changedKoef) => {
                                            if (changedKoef.id === possibleInitiator.id &&
                                                changedKoef.team_1 === possibleInitiator.team_1 &&
                                                changedKoef.team_2 === possibleInitiator.team_2 &&
                                                changedKoef.platform === possibleInitiator.platform &&
                                                changedKoef.koef === possibleInitiator.koef) {
                                                return possibleInitiator;
                                            }
                                        })
                                        if (itors.length !== 0) {
                                            // console.log('add')
                                            possibleInitiator.initiator = true;
                                            initiators.push(possibleInitiator);
                                        } else {
                                            // console.log('else add')
                                            possibleInitiator.initiator = false;
                                            initiators.push(possibleInitiator);
                                        }
                                    } else {
                                        for (let intr of initiators) {
                                            if (intr.id === possibleInitiator.id &&
                                                intr.team_1 === possibleInitiator.team_1 &&
                                                intr.team_2 === possibleInitiator.team_2 &&
                                                intr.platform === possibleInitiator.platform &&
                                                intr.koef === possibleInitiator.koef) {
                                                    intr.triggered++;
                                            }
                                        }
                                    }
                                }

                                async function getInitiator(id, koef) {
                                    return Initiator.initiators.filter((intr) => {
                                        if (id === intr.id && koef === intr.koef) {
                                            return intr
                                        }
                                    })[0]       // <---- ставим [0] потому что мне нужен первый элемент массива а не весь массив
                                }

                                async function calcProfit(forkValue) {
                                    return (100 - (forkValue * 100)).toFixed(2)
                                }

                                async function valueCheck(value) {
                                    return value !== "";
                                }
                            }
                        }
                    }
                }
            }
            iteration1++;


        }
        await Initiator.updateInitiators(initiators);
        console.log('forks: ', forks.length)
        await Fork.updateForks(forks);
        // console.log('forks ',Fork.forks.length)
        // console.log('end')
    }
    // TODO: переделать нижнее говнище точнее придумать как его переделать
    async function findChangedKoefs(olimpMatches, fonbetMatches) {
        let changedKoefs = [];
        for (let savedMatch of savedOlimpMatches) {
            olimpMatches.filter(async (match) => {
                if (savedMatch.id === match.id) {
                    await checkMatch()

                    async function checkMatch() {
                        // console.log(savedMatch, match)
                        if (savedMatch.koef_1 !== '' && match.koef_1 !== '' && savedMatch.koef_1 !== match.koef_1) {
                            // console.log(`add koef1`)
                            // console.log(savedMatch, match)
                            changedKoefs.push({
                                matchId: match.id,
                                team_1: match.team_1,
                                team_2: match.team_2,
                                platform: match.platform,
                                koef: 'koef_1',
                                koef_value: match.koef_1,
                            });
                        }
                        if (savedMatch.koef_2 !== '' && match.koef_2 !== '' && savedMatch.koef_2 !== match.koef_2) {
                            // console.log('add koef2')
                            changedKoefs.push({
                                matchId: match.id,
                                team_1: match.team_1,
                                team_2: match.team_2,
                                platform: match.platform,
                                koef: 'koef_2',
                                koef_value: match.koef_2,
                            });
                        }
                        if (savedMatch.fora.fora_koef1 !== '' && match.fora.fora_koef1 !== '' && savedMatch.fora.fora_koef1 !== match.fora.fora_koef1) {
                            // console.log('add fora koef1')
                            changedKoefs.push({
                                matchId: match.id,
                                team_1: match.team_1,
                                team_2: match.team_2,
                                platform: match.platform,
                                koef: 'fora_koef1',
                                koef_value: match.fora.fora_koef1,
                            });
                        }
                        if (savedMatch.fora.fora_koef2 !== '' && match.fora.fora_koef2 !== '' && savedMatch.fora.fora_koef2 !== match.fora.fora_koef2) {
                            // console.log('add fora koef1')
                            changedKoefs.push({
                                matchId: match.id,
                                team_1: match.team_1,
                                team_2: match.team_2,
                                platform: match.platform,
                                koef: 'fora_koef2',
                                koef_value: match.fora.fora_koef2,
                            });
                        }
                        if (savedMatch.total.total_tb !== '' && match.total.total_tb !== '' && savedMatch.total.total_tb !== match.total.total_tb) {
                            // console.log('add total koef1')
                            changedKoefs.push({
                                matchId: match.id,
                                team_1: match.team_1,
                                team_2: match.team_2,
                                platform: match.platform,
                                koef: 'total_tb',
                                koef_value: match.total.total_tb,
                            });
                        }
                        if (savedMatch.total.total_tm !== '' && match.total.total_tm !== '' && savedMatch.total.total_tm !== match.total.total_tm) {
                            // console.log('add total koef1')
                            changedKoefs.push({
                                matchId: match.id,
                                team_1: match.team_1,
                                team_2: match.team_2,
                                platform: match.platform,
                                koef: 'total_tm',
                                koef_value: match.total.total_tm,
                            });
                        }
                        if (match.drawn_game !== undefined) {
                            if (savedMatch.winner2_or_noWinners !== '' && match.winner2_or_noWinners !== '' && savedMatch.winner2_or_noWinners !== match.winner2_or_noWinners) {
                                changedKoefs.push({
                                    matchId: match.id,
                                    team_1: match.team_1,
                                    team_2: match.team_2,
                                    platform: match.platform,
                                    koef: 'winner2_or_noWinners',
                                    koef_value: match.winner2_or_noWinners,
                                });
                            }
                            if (savedMatch.winner1_or_winner2 !== '' && match.winner1_or_winner2 !== '' && savedMatch.winner1_or_winner2 !== match.winner1_or_winner2) {
                                changedKoefs.push({
                                    matchId: match.id,
                                    team_1: match.team_1,
                                    team_2: match.team_2,
                                    platform: match.platform,
                                    koef: 'winner1_or_winner2',
                                    koef_value: match.winner1_or_winner2,
                                });
                            }
                            if (savedMatch.winner1_or_noWinners !== '' && match.winner1_or_noWinners !== '' && savedMatch.winner1_or_noWinners !== match.winner1_or_noWinners) {
                                changedKoefs.push({
                                    matchId: match.id,
                                    team_1: match.team_1,
                                    team_2: match.team_2,
                                    platform: match.platform,
                                    koef: 'winner1_or_noWinners',
                                    koef_value: match.winner1_or_noWinners,
                                });
                            }
                            if (savedMatch.drawn_game !== '' && match.drawn_game !== '' && savedMatch.drawn_game !== match.drawn_game) {
                                changedKoefs.push({
                                    matchId: match.id,
                                    team_1: match.team_1,
                                    team_2: match.team_2,
                                    platform: match.platform,
                                    koef: 'drawn_game',
                                    koef_value: match.drawn_game,
                                });
                            }
                        }
                    }
                }
            })
        }
        for (let savedMatch of savedFonbetMatches) {
            fonbetMatches.filter(async (match) => {
                if (savedMatch.id === match.id) {
                    await checkMatch()

                    async function checkMatch() {
                        if (savedMatch.koef_1 !== '' && match.koef_1 !== '' && savedMatch.koef_1 !== match.koef_1) {
                            changedKoefs.push({
                                matchId: match.id,
                                team_1: match.team_1,
                                team_2: match.team_2,
                                platform: match.platform,
                                koef: 'koef_1',
                                koef_value: match.koef_1,
                            });
                        }
                        if (savedMatch.koef_2 !== '' && match.koef_2 !== '' && savedMatch.koef_2 !== match.koef_2) {
                            changedKoefs.push({
                                matchId: match.id,
                                team_1: match.team_1,
                                team_2: match.team_2,
                                platform: match.platform,
                                koef: 'koef_2',
                                koef_value: match.koef_2,
                            });
                        }
                        if (savedMatch.fora.fora_koef1 !== '' && match.fora.fora_koef1 !== '' && savedMatch.fora.fora_koef1 !== match.fora.fora_koef1) {
                            changedKoefs.push({
                                matchId: match.id,
                                team_1: match.team_1,
                                team_2: match.team_2,
                                platform: match.platform,
                                koef: 'fora_koef1',
                                koef_value: match.fora.fora_koef1,
                            });
                        }
                        if (savedMatch.fora.fora_koef2 !== '' && match.fora.fora_koef2 !== '' && savedMatch.fora.fora_koef2 !== match.fora.fora_koef2) {
                            changedKoefs.push({
                                matchId: match.id,
                                team_1: match.team_1,
                                team_2: match.team_2,
                                platform: match.platform,
                                koef: 'fora_koef2',
                                koef_value: match.fora.fora_koef2,
                            });
                        }
                        if (savedMatch.total.total_tb !== '' && match.total.total_tb !== '' && savedMatch.total.total_tb !== match.total.total_tb) {
                            changedKoefs.push({
                                matchId: match.id,
                                team_1: match.team_1,
                                team_2: match.team_2,
                                platform: match.platform,
                                koef: 'total_tb',
                                koef_value: match.total.total_tb,
                            });
                        }
                        if (savedMatch.total.total_tm !== '' && match.total.total_tm !== '' && savedMatch.total.total_tm !== match.total.total_tm) {
                            changedKoefs.push({
                                matchId: match.id,
                                team_1: match.team_1,
                                team_2: match.team_2,
                                platform: match.platform,
                                koef: 'total_tm',
                                koef_value: match.total.total_tm,
                            });
                        }
                        if (match.drawn_game !== undefined) {
                            if (savedMatch.winner2_or_noWinners !== '' && match.winner2_or_noWinners !== '' && savedMatch.winner2_or_noWinners !== match.winner2_or_noWinners) {
                                changedKoefs.push({
                                    matchId: match.id,
                                    team_1: match.team_1,
                                    team_2: match.team_2,
                                    platform: match.platform,
                                    koef: 'winner2_or_noWinners',
                                    koef_value: match.winner2_or_noWinners,
                                });
                            }
                            if (savedMatch.winner1_or_winner2 !== '' && match.winner1_or_winner2 !== '' && savedMatch.winner1_or_winner2 !== match.winner1_or_winner2) {
                                changedKoefs.push({
                                    matchId: match.id,
                                    team_1: match.team_1,
                                    team_2: match.team_2,
                                    platform: match.platform,
                                    koef: 'winner1_or_winner2',
                                    koef_value: match.winner1_or_winner2,
                                });
                            }
                            if (savedMatch.winner1_or_noWinners !== '' && match.winner1_or_noWinners !== '' && savedMatch.winner1_or_noWinners !== match.winner1_or_noWinners) {
                                changedKoefs.push({
                                    matchId: match.id,
                                    team_1: match.team_1,
                                    team_2: match.team_2,
                                    platform: match.platform,
                                    koef: 'winner1_or_noWinners',
                                    koef_value: match.winner1_or_noWinners,
                                });
                            }
                            if (savedMatch.drawn_game !== '' && match.drawn_game !== '' && savedMatch.drawn_game !== match.drawn_game) {
                                changedKoefs.push({
                                    matchId: match.id,
                                    team_1: match.team_1,
                                    team_2: match.team_2,
                                    platform: match.platform,
                                    koef: 'drawn_game',
                                    koef_value: match.drawn_game,
                                });
                            }
                        }
                    }
                }
            })
        }
        return changedKoefs;
        // console.log(changedKoefs.length);
    }
}

