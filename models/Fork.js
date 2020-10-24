const fs = require('fs');
const path = require('path');
const { resolve } = require('path');


class Fork {
    constructor(initiator1, initiator2,discipline, profit) {
        this.initiator1 = initiator1,
            this.initiator2 = initiator2,
            this.discipline = discipline,
            this.profit = profit,
            this.date = new Date().getTime()
    }

    static forks = [];
    static forks2 = [];

    toObj() {
        return {
            initiator1: this.initiator1,
            initiator2: this.initiator2,
            discipline: this.discipline,
            profit: this.profit,
            date: this.date
        }
    }
    static async getForks(){
        return Fork.forks2;
    }
    async addFork() {
        await this._autoDeleteFork();
        if (this.initiator1 === undefined) {
            return
        }
        else{
            let iteration = 0;

            let savedForks = Fork.forks.filter((savedFork) => {
                if (savedFork.initiator1.id === undefined||savedFork.initiator2.id === undefined||savedFork.initiator2.koef === undefined){
                    console.log(savedFork)
                }
                if (this.initiator1.id === undefined|| !this.initiator2.id === undefined||!this.initiator2.koef === undefined){
                    console.log('pizda v vilke')
                }
                if (savedFork.initiator1.id === this.initiator1.id &&
                    savedFork.initiator2.id === this.initiator2.id &&
                    savedFork.initiator2.koef === this.initiator2.koef) {
                        return savedFork
                }
                iteration++;
            })
            if (savedForks.length === 0) {
                Fork.forks.push(this.toObj());
            } else {
                if (savedForks[0].initiator2.koef === this.initiator2.koef &&
                    savedForks[0].initiator2.koef_value === this.initiator2.koef_value) {
                    // не делаем ничего т.к. это старая вилка которая уже была найдена
                } else {
                    Fork.forks.splice(iteration, 1);
                    Fork.forks.push(this.toObj());
                }
            }
        }
    }

    async _autoDeleteFork() {
        let iteration = 0;
        Fork.forks.map((fork) => {
            if ((new Date().getTime() - fork.date) > 120000) {
                Fork.forks.splice(iteration, 1);
            }
        })
    }
    static async updateForks(forks){
        await Fork._deleteFork(forks);
        await aaddFork(forks);
        async function aaddFork(forks) {
            for (let fork of forks){
                if (fork.initiator1 === undefined||fork.initiator2 === undefined) {
                    return
                }
                else{
                    let iteration = 0;
                    let savedForks = Fork.forks2.filter((savedFork) => {
                        if (!savedFork.initiator1.id || !savedFork.initiator2.id||!savedFork.initiator2.koef){
                            console.log(savedFork)
                        }
                        if (!fork.initiator1.id || !fork.initiator2.id||!fork.initiator2.koef){
                            console.log('pizda v vilke')
                        }
                        if (savedFork.initiator1.id === fork.initiator1.id &&
                            savedFork.initiator2.id === fork.initiator2.id &&
                            savedFork.initiator2.koef === fork.initiator2.koef) {
                            return savedFork
                        }
                        iteration++;
                    })
                    if (savedForks.length === 0) {
                        Fork.forks2.push(fork);
                    } else {
                        if (savedForks[0].initiator2.koef === fork.initiator2.koef &&
                            savedForks[0].initiator2.koef_value === fork.initiator2.koef_value) {
                            // не делаем ничего т.к. это старая вилка которая уже была найдена
                        } else {
                            Fork.forks2.splice(iteration, 1);
                            Fork.forks2.push(fork);
                        }
                    }
                }
            }
        }
    }
    static async _deleteFork(forks){
        let readyToDelete = [];
        let iteration = 0;
        for (let fork of Fork.forks2) {
            let duplicateInits = forks.filter((receiptedFork) => {
                if (fork.id === receiptedFork.id &&
                    fork.team_1 === receiptedFork.team_1 &&
                    fork.team_2 === receiptedFork.team_2 &&
                    fork.platform === receiptedFork.platform &&
                    fork.koef === receiptedFork.koef) {
                    return fork

                }
            })
            if (duplicateInits.length === 0) {
                readyToDelete.push(iteration)
            }
            iteration++;
        }
        for (let item of readyToDelete){
            Fork.forks2.splice(item,1);
        }
    }
}

module.exports = Fork;
