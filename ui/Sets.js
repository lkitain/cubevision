import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

import SetIcon from './SetIcon';
import { setType } from './propTypes';
import { styles } from './consts';
import { isNotOnlineOnly } from './helper';

const handleSave = (cardId, multiverseid) => () =>
    fetch('/api/card/setversion', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
            cardId,
            multiverseid,
        }),
    });

const Sets = ({ printings, ownedId, cardId }) => {
    return (
        <div>
            {printings
                // filter out online sets
                .filter(set => isNotOnlineOnly(set))
                .sort((a, b) => a.multiverseid > b.multiverseid)
                .map((set, i, arr) => (
                    <div
                        key={`${set.set}-${set.multiverseid}-${i}`} // eslint-disable-line react/no-array-index-key
                        role="button"
                        tabIndex={0}
                        style={ownedId === set.multiverseid ||
                            (ownedId === null && i === (arr.length - 1)) ? {
                                display: 'inline-block',
                            } : styles.hideOnSmall}
                        onClick={handleSave(cardId, set.multiverseid)}
                    >
                        <SetIcon
                            set={set}
                        />
                    </div>
                ))}
        </div>
    );
};

Sets.propTypes = {
    cardId: PropTypes.number.isRequired,
    ownedId: PropTypes.number,
    printings: PropTypes.arrayOf(setType).isRequired,
};

Sets.defaultProps = {
    ownedId: null,
};

export default Radium(Sets);
