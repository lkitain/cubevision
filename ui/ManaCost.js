import React from 'react';
import PropTypes from 'prop-types';

const ManaCost = ({ manaCost }) => {
    if (manaCost !== '' && manaCost !== null) {
        const re = /{([0-9/WRGBUCX]+)}/;
        console.log(manaCost);
        const symbols = manaCost.split(re).filter(x => x !== '');
        return (
          <div>
            {symbols.map(x => (
              <img
                src={`http://gatherer.wizards.com/Handlers/Image.ashx?size=medium&name=${x}&type=symbol`}
              />
            ))}
          </div>
        );
    } else {
        return null;
    }
};

ManaCost.defaultProps = {
    manaCost: '',
};

ManaCost.propTypes = {
    manaCost: PropTypes.string
};

export default ManaCost;
