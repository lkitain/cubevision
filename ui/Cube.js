import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Cube = ({ cube, cards }) => (
  <div>
    <h2>{cube.name}</h2>
    <ul>
      {cards.map(card => (
        <li key={card.cardId}>{card.name}</li>
      ))}
    </ul>
  </div>
);
Cube.defaultProps = {
    cube: {},
    cards: [],
};

Cube.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.number.isRequired,
        }).isRequired,
    }),
    cube: PropTypes.shape({
        name: PropTypes.string,
    }),
    cards: PropTypes.arrayOf(PropTypes.shape({
        // card
        name: PropTypes.string,
    })),
};

const mapStateToProps = (state, props) => {
    console.log(props);
    const cubeId = props.match.params.id;
    let cards = [];
    if (Object.hasOwnProperty.call(state.getCubeCards, cubeId)) {
        cards = state.getCubeCards[cubeId]
            .map(cardId => state.getCards[cardId]);
    }
    return ({
        cube: state.getCubes[cubeId],
        cards,
    });
};

const ConnectedCube = connect(mapStateToProps)(Cube);

export default ConnectedCube;
