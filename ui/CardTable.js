import React from 'react';
import PropTypes from 'prop-types';

export default class CardTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sort: null,
            direction: false,
        };
    }
    doSort(field) {
        return () =>
            this.setState({
                sort: field,
                direction: this.state.sort === field ?
                    !this.state.direction : this.state.direction,
            });
    }
    sort() {
        if (this.state.sort === null) {
            return this.props.cards;
        }
        return this.props.cards.sort((a, b) => {
            const direction = this.state.direction ? 1 : -1;
            if (a[this.state.sort] < b[this.state.sort]) {
                return direction;
            } else if (a[this.state.sort] > b[this.state.sort]) {
                return direction * -1;
            }
            return 0;
        });
    }
    render() {
        const cards = this.sort();
        return (
          <table>
            <thead>
              <tr>
                <th>
                  <button onClick={this.doSort('name')}>
                    Name
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {cards.map(card => (
                <tr key={card.card_id}>
                  <td>{card.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
    }
}

CardTable.defaultProps = {
    cards: [],
};

CardTable.propTypes = {
    cards: PropTypes.arrayOf(PropTypes.shape({
        card_id: PropTypes.number,
        name: PropTypes.string,
    })),
};
