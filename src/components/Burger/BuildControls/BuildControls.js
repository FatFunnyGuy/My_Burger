import React from 'react';
import classes from './BuildControls.css';
import BuildControl from './BuildControl/BuildControl';

const controls = [
    { label: 'Salad', type: 'salad' },
    { label: 'Bacon', type: 'bacon' },
    { label: 'Cheese', type: 'cheese' },
    { label: 'Meat', type: 'meat' },
];

const buildControls = (props) =>  (
    <div className={classes.BuildControls}>
    <p>Total price is: <strong>{props.price.toFixed(2)}$</strong></p>
        {controls.map(el => <BuildControl
            key={el.label}
            label={el.label}
            addIngred={()=>props.addIng(el.type)}
            remIngred={()=>props.remIng(el.type)}
            type={el.type}
            disabled={props.disabled[el.type]}/>)}
        <button
        className={classes.OrderButton}
        disabled={!props.purchasable}
        onClick={()=> props.purchase()}>ORDER NOW</button>
    </div>
);

export default  buildControls;
