import React from 'react';
import PropTypes from 'prop-types';

const ManaCost = ({ manaCost }) => {
    if (manaCost !== '' && manaCost !== null) {
        const re = /{([0-9/WRGBUCXP]+)}/;
        const symbols = manaCost.split(re).filter(x => x !== '').map(y => y.replace('/', ''));
        return (
            <div style={{ whiteSpace: 'nowrap' }}>
                {symbols.map((x, i) => (
                    <img
                        key={i} // eslint-disable-line react/no-array-index-key
                        alt={x}
                        src={`http://gatherer.wizards.com/Handlers/Image.ashx?size=medium&name=${x}&type=symbol`}
                    />
                ))}
            </div>
        );
    }
    return null;
};

ManaCost.defaultProps = {
    manaCost: '',
};

ManaCost.propTypes = {
    manaCost: PropTypes.string,
};

export default ManaCost;
