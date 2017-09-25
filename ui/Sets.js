import React from 'react';
import PropTypes from 'prop-types';

const setCodes = {
    mps_akh: 'mp2',
    cei: 'xice',
    ced: 'xcle',
    tsb: 'tsp',
};

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
          } else if (set.set === 'TSB') {
              rarity = 'timeshifted';
          }
          return (
            <div
                style={{
                    background: ownedId === set.multiverseid ? 'lightsteelblue' : '',
                    display: 'inline-block',
                }}
                onClick={handleSave(cardId, set.multiverseid)}
            >
              <i
                key={`${setCode}-${set.multiverseid}`}
                style={{ paddingRight: 1 }}
                className={`ss ss-grad ss-2x ss-${setCode} ss-${rarity}`}
              />
            </div>
          );
      })}
  </div>
);

Sets.propTypes = {
    ownedId: PropTypes.number,
    cardId: PropTypes.number.isRequired,
    printings: PropTypes.string.isRequired,
};

Sets.defaultProps = {
    ownedId: 0,
};

export default Sets;
