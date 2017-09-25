import { OUR_CUBE, OUR_BINDER } from './consts';

const standardSets = [
    'KAL',
    'AER',
    'AKH',
    'W17',
    'HOU',
    'XLN',
    'RIX',
];

const isInStandard = card => JSON.parse(card.printings)
    .reduce((init, set) => init || standardSets.indexOf(set.set) !== -1, false);

const getMissing = (state) => {
    let ownedCards = [];
    let missingCards = [];
    if (Object.hasOwnProperty.call(state.getCubeCards, OUR_CUBE) &&
        Object.hasOwnProperty.call(state.getCubeCards, OUR_BINDER)
    ) {
        ownedCards = state.getCubeCards[OUR_BINDER]
            .concat(state.getCubeCards[OUR_CUBE]);
        missingCards = Object.keys(state.getCards)
            .filter(card => !ownedCards.includes(parseInt(card, 10)));
    }
    return missingCards;
};

const sort = (field = 'name', directionIn = false) => (a, b) => {
    const direction = directionIn ? 1 : -1;
    if (a[field] < b[field]) {
        return direction;
    } else if (a[field] > b[field]) {
        return direction * -1;
    }
    return 0;
};

export { getMissing, isInStandard, sort };
