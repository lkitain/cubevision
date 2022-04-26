import React from 'react';
import PropTypes from 'prop-types';

import SetIcon from './SetIcon';
import { setType } from './propTypes';

const OwnedSet = ({ printings, ownedId }) => {
    let owned = {};
    if (ownedId === -1) {
        return <>Proxy</>;
    }
    printings
        .forEach((set) => {
            if (parseInt(set.multiverseid, 10) === ownedId) {
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
