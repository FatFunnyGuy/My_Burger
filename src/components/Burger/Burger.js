import React from 'react';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';
// import {withRouter} from 'react-router-dom'; We can use it to grab routing props from Burger component.

import classes from './Burger.css'

const burger = (props) => {
    let transformedIngredients = Object.keys(props.ingredients)
    .map(igKey => {
        return[...Array(props.ingredients[igKey])].map((_, i) => {
            return <BurgerIngredient key={igKey + i} type={igKey} />;
        });
    })
    .reduce((arr,el) => {
        return arr.concat(el);
    }, []);
    if(transformedIngredients.length === 0) {
        transformedIngredients = <p>Please start adding ingredients!</p>
    }
    return (
        <div className={classes.Burger}>
            <BurgerIngredient type='bread-top' />
            {transformedIngredients}
            <BurgerIngredient type='bread-bottom' />
        </div>
    );
};

// export default withRouter(burger);
export default burger;
