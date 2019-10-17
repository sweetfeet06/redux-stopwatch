import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { createStore } from 'redux';

//user of model view intent architecture
let view = (model) => {
    let minutes = Math.floor(model.time / 60);
    let seconds = model.time - (minutes * 60);
    let secondsFormatted = `${seconds < 10 ? '0': ''}${seconds}`;
    let handler = (event) => {
        container.dispatch( model.running ? {type: 'STOP'} : {type: 'START'});
    }
    return <div>
        <div>{minutes}:{secondsFormatted}</div>
        <button onClick={handler} >{model.running ? 'Stop' : 'Start'}</button>
    </div>;
}

let intents = {
    TICK: 'TICK',
    START: 'START',
    STOP: 'STOP',
    RESET: 'RESET'
};

const update = (model = {running: false, time:0}, action) => {
    const updates = {
        'TICK': (model) => Object.assign(model, {time: model.time + (model.running ? 1 : 0)}),
        'STOP': (model) => Object.assign(model, {running: false}),
        'START': (model) => Object.assign(model, {running: true}),
        'RESET': (model) => Object.assign(model, {time: 0})
    };
    return (updates[action.type] || (() => model))(model);
};


let container = createStore(update, false);

const render = () => {
    ReactDOM.render(view(container.getState()), document.getElementById('root'));
};
container.subscribe(render);

setInterval(() => {
        container.dispatch({type: 'TICK'});
    }, 1000);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
