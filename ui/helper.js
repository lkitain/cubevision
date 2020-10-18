import { OUR_CUBE, OUR_BINDER } from './consts';

const standardSets = [
    'ELD',
    'THB',
    'IKO',
    'M21',
    'ZNR',
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
    if (a === '' && b === '') {
        if (cardA.types === cardB.types) {
            return 0;
        }
        if (cardA.types.includes('Land')) {
            return 1;
        }
        return -1;
    }
    if (a === b) {
        return 0;
    }
    if (a === '') {
        return 1;
    }
    if (b === '') {
        return -1;
    }

    if (a.length > b.length) {
        return 1;
    }
    if (a.length < b.length) {
        return -1;
    }

    const orders = ['W', 'U', 'B', 'R', 'G', 'C'];

    if (a.length > orders.length) {
        return 0;
    }
    let res = 0;
    const aArray = a.split('');
    const bArray = b.split('');

    res = orders.reduce((tmp, color) => {
        if (tmp !== 0) {
            return tmp;
        }
        for (let i = 0; i < aArray.length; i += 1) {
            if (aArray[i] === color) {
                return -1;
            }
            if (bArray[i] === color) {
                return 1;
            }
        }
        return tmp;
    }, res);
    return res;
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
