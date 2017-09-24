import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ManaCost from './ManaCost';
import Sets from './Sets';
import Replacements from './Replacements';
import { LAST_CUBE } from './consts';

const standardSets = [
    'KAL',
    'AER',
    'AKH',
    'W17',
    'HOU',
];

const CardRow = ({ card, isHeader, doSort, canEdit, inCurrent }) => {
    if (isHeader) {
        return (
            <tr>
              <th>
                <button onClick={doSort('name')}>
                  Name
                </button>
              </th>
              <th>
                  Image
              </th>
              <th>
                <button onClick={doSort('mana_cost')}>
                  Mana Cost
                </button>
              </th>
              <th>
                <button onClick={doSort('cmc')}>
                  CMC
                </button>
              </th>
              <th>
                <button onClick={doSort('color')}>
                  Color
                </button>
              </th>
              <th>
                <button onClick={doSort('types')}>
                  Types
                </button>
              </th>
              <th>
                <button onClick={doSort('reserved')}>
                  Reserved
                </button>
              </th>
              <th>
                Sets
              </th>
              {canEdit &&
              <th>
                Remove
              </th>}
            </tr>
        );
    }
    if (card.name === 'Gideon of the Trials') {
        console.log(card);
    }
    const inStandard = JSON.parse(card.printings)
        .reduce((init, set) => init || standardSets.indexOf(set.set) !== -1, false);
    return (
        <tr
          style={{
              height: 31,
              backgroundColor: inCurrent ? 'white' : 'lightgrey',
              color: inStandard ? 'chocolate' : 'black',
          }}
        >
          <td>{card.name}</td>
          <td>
            <a
              target="__blank"
              rel="noopener noreferrer"
              href={`http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${card.multiverse_id}&type=card`}
            >
                Image
            </a>
          </td>
          <td><ManaCost manaCost={card.mana_cost} /></td>
          <td>{card.cmc}</td>
          <td>{card.color}</td>
          <td>{card.types.replace(',', ' ')}</td>
          <td>{card.reserved ? '*' : ''}</td>
          <td>
            <Sets printings={JSON.parse(card.printings)} />
          </td>
          {canEdit &&
          <th>
            <Replacements cardId={card.card_id} />
          </th>}
        </tr>
    );
};

CardRow.defaultProps = {
    isHeader: false,
    card: {},
    doSort: () => {},
    canEdit: false,
    cubes: [],
    inCurrent: false,
};

CardRow.propTypes = {
    card: PropTypes.shape({
        card_id: PropTypes.number,
        name: PropTypes.string,
    }),
    doSort: PropTypes.func,
    isHeader: PropTypes.bool,
    cubes: PropTypes.arrayOf(PropTypes.shape({
        cube_id: PropTypes.number,
        name: PropTypes.string,
    })),
    inCurrent: PropTypes.bool,
};

const mapStateToProps = (state, props) => {
    const cubes = [];
    let inCurrent = false;
    if (!props.isHeader) {
        Object.keys(state.getCubeCards).forEach((cubeId) => {
            if (state.getCubeCards[cubeId].indexOf(props.card.card_id) > -1) {
                cubes.push(state.getCubes[cubeId]);
                if (parseInt(cubeId, 10) === LAST_CUBE) {
                    inCurrent = true;
                }
            }
        });
    }
    return ({
        cubes,
        inCurrent,
    });
};

const ConnectedCardRow = connect(mapStateToProps)(CardRow);

export default ConnectedCardRow;
