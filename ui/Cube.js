import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CardTable from './CardTable';
import { OUR_CUBE } from './consts';

const Cube = ({ cube, cards }) => (
  <div>
    <h2>{cube.name}</h2>
    <CardTable cards={cards} canEdit={cube.cube_id === OUR_CUBE} />
  </div>
);

Cube.defaultProps = {
    cube: {},
    cards: [],
};

Cube.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    cube: PropTypes.shape({
        name: PropTypes.string,
    }),
    cards: PropTypes.arrayOf(PropTypes.shape({
        // card
        name: PropTypes.string,
    })),
};

const mapStateToProps = (state, props) => {
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
