import { OUR_CUBE, OUR_BINDER } from './consts';

const standardSets = [
    'GRN',
    'RNA',
    'WAR',
    'M20',
    'ELD',
    'THB',
    'IKO',
];

const isInStandard = card => JSON.parse(card.printings)
    .reduce((init, set) => init || standardSets.indexOf(set.set) !== -1, false);

const isNotOnlineOnly = set => !(/ME[D1-4]|VMA|TPR|PZ1|PMODO/i.test(set.set));

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

const colorSortHelper = (cardA, cardB) => {
    const a = cardA.color;
    const b = cardB.color;
    if (a === b) {
        return 0;
    } else if (a === 'W') {
        return -1;
    } else if (b === 'W') {
        return 1;
    } else if (a === 'U') {
        return -1;
    } else if (b === 'U') {
        return 1;
    } else if (a === 'B') {
        return -1;
    } else if (b === 'B') {
        return 1;
    } else if (a === 'R') {
        return -1;
    } else if (b === 'R') {
        return 1;
    } else if (a === 'G') {
        return -1;
    } else if (b === 'G') {
        return 1;
    } else if (a === 'C') {
        return -1;
    } else if (b === 'C') {
        return 1;
    }
    return 0;
};

const colorSort = (cardA, cardB) => {
    const colorSorting = colorSortHelper(cardA, cardB);
    if (colorSorting !== 0) {
        return colorSorting;
    }
    return sort('name')(cardA, cardB);
};

const sort = (field = 'name', directionIn = false) => (a, b) => {
    const direction = directionIn ? 1 : -1;
    if (a[field] < b[field]) {
        return direction;
    } else if (a[field] > b[field]) {
        return direction * -1;
    }
    if (field !== 'name') {
        return colorSort(a, b);
    }
    return 0;
};

const costSort = (cardA, cardB) => {
    const returnValue = colorSortHelper(cardA, cardB);
    if (returnValue === 0) {
        if (cardA.cmc === cardB.cmc) {
            return sort('name')(cardA, cardB);
        } else if (cardA.cmc > cardB.cmc) {
            return 1;
        }
        return -1;
    }
    return returnValue;
};

export {
    colorSort,
    costSort,
    getMissing,
    isInStandard,
    isNotOnlineOnly,
    sort,
};
