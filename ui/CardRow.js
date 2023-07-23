import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

import { cardType } from './propTypes';
import ManaCost from './ManaCost';
import Sets from './Sets';
import OwnedSet from './OwnedSet';
import Replacements from './Replacements';
import { styles } from './consts';

const CardRow = ({ card, isHeader, canEdit }) => {
    if (isHeader) {
        return (
            <tr>
                <th>
                    Name
                </th>
                <th style={styles.hideOnSmall}>
                    Image
                </th>
                <th style={styles.hideOnSmall}>
                    Mana Cost
                </th>
                <th>
                    Types
                </th>
                <th>
                    Sets
                </th>
                <th>
                    Last Cube
                </th>
                {canEdit && (
                    <th style={styles.hideOnSmall}>
                        Remove
                    </th>
                )}
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
    } else if (card.types === 'Land') {
        backgroundColor = 'rgb(196, 177, 112)';
        color = 'black';
    }
    let reserved = '';
    if (card.reserved) {
        reserved = (
            <span style={{
                fontWeight: 'normal',
                fontSize: 'x-small',
                verticalAlign: 'top',
            }}
            >
                &reg;
            </span>
        );
    }
    let multiverseId = card.owned_multiverseid || card.multiverse_id;
    const printings = JSON.parse(card.printings);
    if (!multiverseId && printings) {
        printings.forEach((printing) => {
            if (printing.multiverseid && printing.multiverseid > multiverseId) {
                multiverseId = printing.multiverseid;
            }
        });
    }
    return (
        <tr
            style={{
                height: 31,
                backgroundColor,
                color,
            }}
        >
            <td style={{ fontWeight: 'bold' }}>
                { ` ${card.name} ${reserved}` }
            </td>
            <td style={styles.hideOnSmall}>
                <a
                    target="__blank"
                    rel="noopener noreferrer"
                    href={`https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${multiverseId}&type=card`}
                >
                    {card.owned_multiverseid ? (
                        <OwnedSet
                            printings={printings}
                            ownedId={card.owned_multiverseid}
                            cardId={card.card_id}
                        />
                    ) : 'Image'}
                </a>
            </td>
            <td style={styles.hideOnSmall}>
                <ManaCost manaCost={card.mana_cost} />
            </td>
            <td>{card.types ? card.types.replace(',', ' ') : 'Unknown'}</td>
            <td>
                <Sets
                    printings={printings}
                    ownedId={card.owned_multiverseid}
                    cardId={card.card_id}
                />
            </td>
            <td>
                {card.lastCube}
            </td>
            {canEdit && (
                <th style={styles.hideOnSmall}>
                    <Replacements cardId={card.card_id} />
                </th>
            )}
        </tr>
    );
};

CardRow.defaultProps = {
    isHeader: false,
    card: {},
    canEdit: false,
};

CardRow.propTypes = {
    card: cardType,
    isHeader: PropTypes.bool,
    canEdit: PropTypes.bool,
};

export default Radium(CardRow);
