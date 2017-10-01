import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { cardType } from './propTypes';
import ManaCost from './ManaCost';
import Sets from './Sets';
import OwnedSet from './OwnedSet';
import Replacements from './Replacements';
import { isInStandard } from './helper';
import { LAST_CUBE } from './consts';

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
                    <button onClick={doSort('owned_multiverseid')}>
                        Image
                    </button>
                </th>
                <th>
                    <button onClick={doSort('mana_cost')}>
                        Mana Cost
                    </button>
                </th>
                <th>
                    <button onClick={doSort('types')}>
                        Types
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
    let backgroundColor = 'rgb(135, 110, 90)';
    let color = 'white';
    if (card.color.length > 1) {
        backgroundColor = 'rgb(223, 204, 151)';
        color = 'black';
    } else if (card.color === 'G') {
        backgroundColor = 'rgb(200, 217, 209)';
        color = 'black';
    } else if (card.color === 'W') {
        backgroundColor = 'rgb(248, 248, 246)';
        color = 'black';
    } else if (card.color === 'R') {
        backgroundColor = 'rgb(245, 210, 190)';
        color = 'black';
    } else if (card.color === 'B') {
        backgroundColor = 'rgb(194, 187, 187)';
        color = 'black';
    } else if (card.color === 'U') {
        backgroundColor = 'rgb(182, 216, 233)';
        color = 'black';
    }
    return (
        <tr
            style={{
                height: 31,
                backgroundColor,
                color,
            }}
        >
            <td style={{ fontWeight: 'bold' }}>{card.name} {card.reserved ? '*' : ''}</td>
            <td>
                <a
                    target="__blank"
                    rel="noopener noreferrer"
                    href={`http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${card.owned_multiverseid || card.multiverse_id}&type=card`}
                >
                    {card.owned_multiverseid ? (
                        <OwnedSet
                            printings={JSON.parse(card.printings)}
                            ownedId={card.owned_multiverseid}
                            cardId={card.card_id}
                        />
                    ) : 'Image'}
                </a>
            </td>
            <td><ManaCost manaCost={card.mana_cost} /></td>
            <td>{card.types.replace(',', ' ')}</td>
            <td>
                <Sets
                    printings={JSON.parse(card.printings)}
                    ownedId={card.owned_multiverseid}
                    cardId={card.card_id}
                />
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
    card: cardType,
    doSort: PropTypes.func,
    isHeader: PropTypes.bool,
    inCurrent: PropTypes.bool,
    canEdit: PropTypes.bool,
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
        inCurrent,
    });
};

const ConnectedCardRow = connect(mapStateToProps)(CardRow);

export default ConnectedCardRow;
