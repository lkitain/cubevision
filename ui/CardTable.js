import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CardRow from './CardRow';
import { sort } from './helper';

export default class CardTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sort: null,
            direction: false,
        };
        this.doSort = this.doSort.bind(this);
    }
    doSort(field) {
        const self = this;
        return () =>
            self.setState({
                sort: field,
                direction: self.state.sort === field ?
                    !self.state.direction : self.state.direction,
            });
    }
    sort() {
        if (this.state.sort === null) {
            return this.props.cards;
        }
        return this.props.cards.sort(sort(this.state.sort, this.state.direction));
    }
    render() {
        const cards = this.sort();
        return (
          <table>
            <thead>
              <CardRow isHeader doSort={this.doSort} canEdit={this.props.canEdit} />
            </thead>
            <tbody>
              {cards.map(card => (
                <CardRow key={card.card_id} card={card} canEdit={this.props.canEdit} />
              ))}
            </tbody>
          </table>
        );
    }
}

CardTable.defaultProps = {
    cards: [],
    canEdit: false,
};

CardTable.propTypes = {
    cards: PropTypes.arrayOf(PropTypes.shape({
        card_id: PropTypes.number,
        name: PropTypes.string,
    })),
    canEdit: PropTypes.bool,
};
