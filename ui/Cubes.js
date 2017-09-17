import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const Cubes = ({ cubes }) => (
  <div>
    <h2>Cubes</h2>
    <ul>
      {Object.keys(cubes).map(cubeId => (
        <li key={cubeId}>
          <Link to={`/cube/${cubeId}`}>
            {cubes[cubeId].name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);
Cubes.defaultProps = {
    cubes: {},
};

Cubes.propTypes = {
    cubes: PropTypes.object,
};

const mapStateToProps = state => ({ cubes: state.getCubes });

const ConnectedCubes = connect(mapStateToProps)(Cubes);

export default ConnectedCubes;
