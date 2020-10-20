class Initiator {
    // constructor(matchId, team_1, team_2, platform, koef, koef_value) {
    //     this.matchId = matchId,
    //         this.team_1 = team_1,
    //         this.team_2 = team_2,
    //         this.platform = platform,
    //         this.koef = koef,
    //         this.koef_value = koef_value,
    //         this.triggered = 0
    // }

    static initiators = [];

    static async checkInitiator(possibleInitiator) {
        return Initiator.initiators.filter((takedInitiator) => {
            if (takedInitiator.id === possibleInitiator.id &&
                takedInitiator.team_1 === possibleInitiator.team_1 &&
                takedInitiator.team_2 === possibleInitiator.team_2 &&
                takedInitiator.platform === possibleInitiator.platform &&
                takedInitiator.koef === possibleInitiator.koef) {
                return possibleInitiator
            }
        })
    }

static async gett(){
    console.log(Initiator.initiators.length)
        return Initiator.initiators.length;
}
    static async updateInitiators(receiptedInitiators) {
        //TODO: function delete initiators
        // await Initiator._deleteInitiator(receiptedInitiators);
        for (let receiptedInitiator of receiptedInitiators) {
            let duplicateInits = await Initiator.initiators.filter((initiator) => {
                if (initiator.id === receiptedInitiator.id &&
                    initiator.team_1 === receiptedInitiator.team_1 &&
                    initiator.team_2 === receiptedInitiator.team_2 &&
                    initiator.platform === receiptedInitiator.platform &&
                    initiator.koef === receiptedInitiator.koef) {
                    return receiptedInitiator
                }
            });
            if (duplicateInits.length === 0) {
                Initiator.initiators.push(receiptedInitiator);
            }
            else {
                Initiator.initiators.map((initiator) => {
                    if (initiator.id === receiptedInitiator.id &&
                        initiator.team_1 === receiptedInitiator.team_1 &&
                        initiator.team_2 === receiptedInitiator.team_2 &&
                        initiator.platform === receiptedInitiator.platform &&
                        initiator.koef === receiptedInitiator.koef) {
                        initiator.koef_value = receiptedInitiator.koef_value;
                        initiator.triggered = receiptedInitiator.triggered
                    }
                })
            }
        }
    }
    static async _deleteInitiator(receiptedInitiators){
        let readyToDelete = [];
        let iteration = 0;
        for (let initiator of Initiator.initiators) {
            let duplicateInits = receiptedInitiators.filter((receiptedInitiator) => {
                if (initiator.id === receiptedInitiator.id &&
                    initiator.team_1 === receiptedInitiator.team_1 &&
                    initiator.team_2 === receiptedInitiator.team_2 &&
                    initiator.platform === receiptedInitiator.platform &&
                    initiator.koef === receiptedInitiator.koef) {
                    return initiator
                }
            })
            if (duplicateInits.length === 0) {
                readyToDelete.push(iteration)
            }
            iteration++;
        }
        for (let item of readyToDelete){
            Initiator.initiators.splice(item,1);
        }
    }
}

module.exports = Initiator