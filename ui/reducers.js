import { combineReducers } from 'redux';
import { OUR_CUBE, OUR_BINDER } from './consts';

const getCubes = (cubes = {}, action) => {
    switch (action.type) {
    case 'RECEIVE_CUBES':
        return action.cubes.reduce((init, cube) => ({ ...init, [cube.cube_id]: cube }));
    default:
        return cubes;
    }
};

const getCards = (cards = {}, action) => {
    switch (action.type) {
    case 'RECEIVE_CARDS':
        return action.cards.reduce((init, card) => ({ ...init, [card.card_id]: card }));
    default:
        return cards;
    }
};

const getCubeCards = (cards = {}, action) => {
    let outCards;
    switch (action.type) {
    case 'RECEIVE_CUBE_CARDS':
        // eslint-disable-next-line camelcase
        return action.cubes.reduce((init, { card_id, cube_id }) => {
            const ret = { ...init };
            if (!Object.hasOwnProperty.call(ret, cube_id)) {
                ret[cube_id] = [];
            }
            ret[cube_id].push(card_id);
            return ret;
        }, {});
    case 'REPLACE_CARD':
        outCards = { ...cards };
        outCards[OUR_CUBE][cards[OUR_CUBE].indexOf(action.oldCardId)] = action.newCardId;
        outCards[OUR_BINDER][cards[OUR_BINDER].indexOf(action.newCardId)] = action.oldCardId;
        return outCards;
    default:
        return cards;
    }
};

const sorter = (sortings = {
    sort: 'name',
}, action) => {
    switch (action.type) {
    case 'SET_SORTER':
        return { ...sortings, ...action.data };
    default:
        return sortings;
    }
};

const rootReducer = combineReducers({
    getCubes,
    getCards,
    getCubeCards,
    sorter,
});

export default rootReducer;
