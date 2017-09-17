import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CardTable from './CardTable';
import { OUR_CUBE, OUR_BINDER } from './consts';

const Missing = ({ cards }) => (
  <div>
    <h2>Missing ({cards.length})</h2>
    <CardTable cards={cards} />
  </div>
);

Missing.defaultProps = {
    cards: [],
};

Missing.propTypes = {
    cards: PropTypes.arrayOf(PropTypes.shape({
        // card
        name: PropTypes.string,
    })),
};

const mapStateToProps = (state) => {
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
    return ({
        cards: missingCards.map(card => state.getCards[card]),
    });
};

const ConnectedMissing = connect(mapStateToProps)(Missing);

export default ConnectedMissing;
