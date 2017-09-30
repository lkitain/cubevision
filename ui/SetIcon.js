import React from 'react';

import { setType } from './propTypes';
import { SET_CODES } from './consts';

const SetIcon = ({ set }) => {
    let setCode = set.set.toLowerCase();
    if (Object.hasOwnProperty.call(SET_CODES, setCode)) {
        setCode = SET_CODES[setCode];
    }
    let rarity = 'rare';
    if (set.rarity === 'M') {
        rarity = 'mythic';
    } else if (set.rarity === 'U') {
        rarity = 'uncommon';
    } else if (set.rarity === 'C') {
        rarity = 'common';
    } else if (set.set === 'TSB') {
        rarity = 'timeshifted';
    }
    return (
        <i
            style={{ paddingRight: 1 }}
            className={`ss ss-grad ss-2x ss-${setCode} ss-${rarity}`}
        />
    );
};

SetIcon.propTypes = {
    set: setType.isRequired,
};

export default SetIcon;
