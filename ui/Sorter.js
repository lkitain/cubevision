import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Radium from 'radium';

const Sorter = ({ onChange, isCurrentCube }) => (
    <div>
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            '@media (min-width: 500px)': {
                justifyContent: 'start',
            },
        }}
        >
            <label htmlFor="standard">
                Exclude Standard
                <input
                    id="standard"
                    type="checkbox"
                    onChange={e => onChange('standard', e.target.checked)}
                />
            </label>
            <label htmlFor="current">Only {isCurrentCube ? 'Our' : 'Current'} Cube</label>
            <input
                id="current"
                type="checkbox"
                onChange={e => onChange('current', e.target.checked)}
            />
            <label htmlFor="excludeCurrent">Exclude {isCurrentCube ? 'Our' : 'Current'} Cube</label>
            <input
                id="excludeCurrent"
                type="checkbox"
                onChange={e => onChange('excludeCurrent', e.target.checked)}
            />
            <label htmlFor="reserved">Only Reserved</label>
            <input
                id="reserved"
                type="checkbox"
                onChange={e => onChange('reserved', e.target.checked)}
            />
        </div>
        <div style={{
            marginTop: 8,
            display: 'flex',
            justifyContent: 'space-between',
            '@media (min-width: 500px)': {
                justifyContent: 'start',
            },
        }}
        >
            <label htmlFor="color">Color</label>
            <input
                id="color"
                type="radio"
                name="sort"
                onChange={e => onChange(e.target.name, e.target.id)}
            />
            <label htmlFor="name">Name</label>
            <input
                id="name"
                type="radio"
                name="sort"
                onChange={e => onChange(e.target.name, e.target.id)}
            />
            <label htmlFor="types">Types</label>
            <input
                id="types"
                type="radio"
                name="sort"
                onChange={e => onChange(e.target.name, e.target.id)}
            />
            <label htmlFor="age">
                Age(?)
                <input
                    id="age"
                    type="radio"
                    name="sort"
                    onChange={e => onChange(e.target.name, e.target.id)}
                />
            </label>
            <label htmlFor="cost">
                Mana Cost
                <input
                    id="cost"
                    type="radio"
                    name="sort"
                    onChange={e => onChange(e.target.name, e.target.id)}
                />
            </label>
        </div>
    </div>
);

Sorter.propTypes = {
    onChange: PropTypes.func.isRequired,
    isCurrentCube: PropTypes.bool,
};

Sorter.defaultProps = {
    isCurrentCube: false,
};

const mapStateToProps = state => ({
    sorter: state.sorter,
});
const mapDispatchToProps = dispatch => ({
    onChange: (sort, value) => dispatch({
        type: 'SET_SORTER',
        data: {
            [sort]: value,
        },
    }),
});

const ConnectedSorter = connect(mapStateToProps, mapDispatchToProps)(Radium(Sorter));

export default ConnectedSorter;
