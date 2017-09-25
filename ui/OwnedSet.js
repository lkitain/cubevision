import React from 'react';
import PropTypes from 'prop-types';

const setCodes = {
    mps_akh: 'mp2',
    cei: 'xice',
    ced: 'xcle',
    tsb: 'tsp',
};

const OwnedSet = ({ printings, ownedId, cardId }) => {
    let owned = {};
    printings
      .forEach((set) => {
          if (set.multiverseid === ownedId) {
              owned = set;
          }
      });

    const setCode = owned.set.toLowerCase();
    let rarity = 'rare';
    if (owned.rarity === 'M') {
        rarity = 'mythic';
    } else if (owned.rarity === 'U') {
        rarity = 'uncommon';
    } else if (owned.rarity === 'C') {
        rarity = 'common';
    } else if (owned.set === 'TSB') {
        rarity = 'timeshifted';
    }
    return (
      <div>
        <i
          className={`ss ss-grad ss-2x ss-${setCode} ss-${rarity}`}
        />
      </div>
    )
};

OwnedSet.propTypes = {
    ownedId: PropTypes.number,
    cardId: PropTypes.number.isRequired,
    printings: PropTypes.string.isRequired,
};

OwnedSet.defaultProps = {
    ownedId: 0,
};

export default OwnedSet;
