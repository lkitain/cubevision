import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CardRow from './CardRow';
import Sorter from './Sorter';
import { colorSort, costSort, sort, isInStandard, isNotOnlineOnly } from './helper';
import { cardType } from './propTypes';
import { LAST_CUBE } from './consts';

const CardTable = ({ sortedCards, cards, canEdit }) => (
    <div>
        <Sorter />
        <div style={{ margin: 4, fontWeight: 'bold' }}>
            {sortedCards.length} of {cards.length}
        </div>
        <table>
            <thead>
                <CardRow isHeader canEdit={canEdit} />
            </thead>
            <tbody>
                {sortedCards.map(card => (
                    <CardRow
                        key={card.card_id}
                        card={card}
                        canEdit={canEdit}
                    />
                ))}
            </tbody>
        </table>
    </div>
);

CardTable.defaultProps = {
    cards: [],
    sortedCards: [],
    canEdit: false,
};

CardTable.propTypes = {
    cards: PropTypes.arrayOf(cardType),
    sortedCards: PropTypes.arrayOf(cardType),
    canEdit: PropTypes.bool,
};

const mapStateToProps = (state, props) => {
    let sortedCards = props.cards.filter(card => card);
    if (state.sorter.standard) {
        sortedCards = sortedCards.filter(card => !isInStandard(card));
    }
    if (state.sorter.current) {
        sortedCards = sortedCards.filter(card =>
            state.getCubeCards[LAST_CUBE].indexOf(card.card_id) > -1);
    }
    if (state.sorter.excludeCurrent) {
        sortedCards = sortedCards.filter(card =>
            state.getCubeCards[LAST_CUBE].indexOf(card.card_id) === -1);
    }
    if (state.sorter.sort === 'name' || state.sorter.sort === 'types') {
        sortedCards = sortedCards.sort(sort(state.sorter.sort));
    } else if (state.sorter.sort === 'age') {
        sortedCards = sortedCards.sort((cardA, cardB) => {
            const a = JSON.parse(cardA.printings).filter(set => isNotOnlineOnly(set))
                .reduce((init, set) =>
                    (init > set.multiverseid ? init : set.multiverseid), 0);
            const b = JSON.parse(cardB.printings).filter(set => isNotOnlineOnly(set))
                .reduce((init, set) =>
                    (init > set.multiverseid ? init : set.multiverseid), 0);
            if (a > b) {
                return -1;
            } else if (a < b) {
                return 1;
            }
            return sort('name');
        });
    } else if (state.sorter.sort === 'color') {
        sortedCards = sortedCards.sort(colorSort);
    } else if (state.sorter.sort === 'cost') {
        sortedCards = sortedCards.sort(costSort);
    }
    return {
        sortedCards,
    };
};


const ConnectedCardTable = connect(mapStateToProps)(CardTable);

export default ConnectedCardTable;
