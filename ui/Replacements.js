import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { LAST_CUBE, OUR_BINDER } from './consts';
import { sort } from './helper';

class Replacements extends React.Component {
    constructor(props) {
        super(props);
        this.handleSave = this.handleSave.bind(this);
    }
    handleSave() {
        fetch('/api/card/replace', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({
                newCardId: this.cards.value,
                oldCardId: this.props.cardId,
            }),
        });
    }
    render() {
        return (
          <div>
            <select ref={(cards) => { this.cards = cards; }}>
              {this.props.cards.map(card => (
                <option value={card.card_id} key={card.card_id}>{card.name}</option>
              ))}
            </select>
            <button onClick={this.handleSave}>Save</button>
          </div>
        );
    }
}

Replacements.defaultProps = {
    cards: [],
};

Replacements.propTypes = {
    cardId: PropTypes.number.isRequired,
    cards: PropTypes.arrayOf(PropTypes.shape({
        // card
        name: PropTypes.string,
    })),
};

const mapStateToProps = (state) => {
    let cards = [];
    if (Object.hasOwnProperty.call(state.getCubeCards, OUR_BINDER)) {
        cards = state.getCubeCards[OUR_BINDER]
            .filter(binderId => state.getCubeCards[LAST_CUBE].indexOf(binderId) > -1)
            .map(cardId => state.getCards[cardId])
            .sort(sort());
    }
    return ({
        cards,
    });
};

const ConnectedReplacements = connect(mapStateToProps)(Replacements);

export default ConnectedReplacements;
