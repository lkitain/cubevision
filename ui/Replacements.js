import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { replaceCard } from './actions';
import { LAST_CUBE, OUR_BINDER } from './consts';
import { sort } from './helper';
import { cardType } from './propTypes';

class Replacements extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleSave = this.handleSave.bind(this);
    }

    handleSave() {
        const { cardId, replaceCard } = this.props;
        fetch('/api/card/replace', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({
                newCardId: this.cards.value,
                oldCardId: cardId,
            }),
        }).then((result) => {
            if (result.status === 200) {
                replaceCard(parseInt(this.cards.value, 10), cardId);
            }
        });
    }

    render() {
        const { cards } = this.props;
        return (
            <div>
                <select ref={(cardList) => { this.cards = cardList; }}>
                    {cards.map(card => (
                        <option value={card.card_id} key={card.card_id}>
                            {card.name}
                        </option>
                    ))}
                </select>
                <button type="button" onClick={this.handleSave}>Save</button>
            </div>
        );
    }
}

Replacements.defaultProps = {
    cards: [],
};

Replacements.propTypes = {
    cardId: PropTypes.number.isRequired,
    cards: PropTypes.arrayOf(cardType),
    replaceCard: PropTypes.func.isRequired,
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

const mapDispatchToProps = dispatch => ({
    replaceCard: (newCardId, oldCardId) => dispatch(replaceCard(newCardId, oldCardId)),
});

const ConnectedReplacements = connect(mapStateToProps, mapDispatchToProps)(Replacements);

export default ConnectedReplacements;
