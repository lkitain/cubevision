import React from 'react';
import PropTypes from 'prop-types';

import SetIcon from './SetIcon';
import { setType } from './propTypes';

const handleSave = (cardId, multiverseid) => () =>
    fetch('/api/card/setversion', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
            cardId,
            multiverseid,
        }),
    });

const Sets = ({ printings, ownedId, cardId }) => (
    <div>
        {printings
            // filter out online sets
            .filter(set => !(/ME[D1-4]|VMA|TPR|PZ1|PMODO/i.test(set.set)))
            .map((set, i) => (
                <div
                    key={`${set.set}-${set.multiverseid}-${i}`} // eslint-disable-line react/no-array-index-key
                    role="button"
                    tabIndex={0}
                    style={{
                        background: ownedId === set.multiverseid ? 'lightsteelblue' : '',
                        display: 'inline-block',
                    }}
                    onClick={handleSave(cardId, set.multiverseid)}
                >
                    <SetIcon
                        set={set}
                    />
                </div>
            ))}
    </div>
);

Sets.propTypes = {
    ownedId: PropTypes.number,
    cardId: PropTypes.number.isRequired,
    printings: PropTypes.arrayOf(setType).isRequired,
};

Sets.defaultProps = {
    ownedId: 0,
};

export default Sets;
