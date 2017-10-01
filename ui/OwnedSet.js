import React from 'react';
import PropTypes from 'prop-types';

import SetIcon from './SetIcon';
import { setType } from './propTypes';

const OwnedSet = ({ printings, ownedId }) => {
    let owned = {};
    printings
        .forEach((set) => {
            if (set.multiverseid === ownedId) {
                owned = set;
            }
        });

    return <SetIcon set={owned} />;
};

OwnedSet.propTypes = {
    ownedId: PropTypes.number,
    printings: PropTypes.arrayOf(setType).isRequired,
};

OwnedSet.defaultProps = {
    ownedId: 0,
};

export default OwnedSet;
