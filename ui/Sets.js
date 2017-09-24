import React from 'react';
import PropTypes from 'prop-types';

const setCodes = {
    mps_akh: 'mp2',
    cei: 'xice',
    ced: 'xcle',
};

const Sets = ({ printings, cardRarity }) => (
  <div>
    {printings
      .filter(set => !(/ME[D1-4]|VMA|TPR|PZ1|PMODO/i.test(set.set)))
      .map((set) => {
          let setCode = set.set.toLowerCase();
          if (Object.hasOwnProperty.call(setCodes, setCode)) {
              setCode = setCodes[setCode];
          }
          let rarity = 'rare';
          if (set.rarity === 'M') {
              rarity = 'mythic';
          } else if (set.rarity === 'U') {
              rarity = 'uncommon';
          } else if (set.rarity === 'C') {
              rarity = 'common';
          } else if (set.rarity === 'T') {
              rarity = 'timeshifted';
          }
          return (
            <i
              style={{ paddingRight: 1 }}
              className={`ss ss-grad ss-2x ss-${setCode} ss-${rarity}`}
            />
          );
      })}
  </div>
);

Sets.propTypes = {
    printings: PropTypes.string.isRequired,
};

export default Sets;
