import React from 'react';

export default class Updater extends React.Component {
    constructor(props) {
        super(props);
        this.handleSave = this.handleSave.bind(this);
    }
    handleSave() {
        fetch('/api/cube/postcube', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({
                name: this.name.value,
                cards: this.cards.value,
            }),
        });
    }
    render() {
        return (
          <div>
            <input ref={(name) => { this.name = name; }} />
            <textarea ref={(cards) => { this.cards = cards; }} />
            <button onClick={this.handleSave}>Save</button>
          </div>
        );
    }
}
