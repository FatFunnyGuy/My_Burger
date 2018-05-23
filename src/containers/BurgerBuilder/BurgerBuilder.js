import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-order';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {

        state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
      axios.get('https://react-my-burger-39aa5.firebaseio.com/ingredients.json')
        .then(response => this.setState({ingredients: response.data}))
        .catch(error => this.setState({error: true}))
    }

    updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map(igKey => ingredients[igKey])
            .reduce((sum, el) => sum+el);

        this.setState({purchasable: sum > 0});
    };

    addIngredientHandler = (type) => {
        let newIngridientsList = {...this.state.ingredients};
        newIngridientsList[type]++;
        let newPrice = this.state.totalPrice + INGREDIENT_PRICES[type];
        this.setState({ingredients: newIngridientsList, totalPrice: newPrice});
        this.updatePurchaseState(newIngridientsList);
    }

    removeIngredientHandler = (type) => {
        let newIngridientsListRemove = {...this.state.ingredients};
        newIngridientsListRemove[type]--;
        let newPriceRemove = this.state.totalPrice - INGREDIENT_PRICES[type];
        this.setState({
            ingredients: newIngridientsListRemove,
            totalPrice: newPriceRemove});
        this.updatePurchaseState(newIngridientsListRemove);
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        this.setState({loading: true});

        const order = {
          ingredients: this.state.ingredients,
          price: this.state.totalPrice,
          customer: {
            name: 'Uladzimir Ivanov',
            address: {
              street: 'TestStreet, 25',
              zipCode: '41354',
              country: 'Belarus'
            },
            deliveryMethod: 'fastest'
          }
        }

        axios.post('/orders.json', order)
          .then(response => this.setState({loading: false, purchasing: false}))
          .catch(error => this.setState({loading: false, purchasing: false}));
    }

      render() {

        const disabledInfo = {...this.state.ingredients};

        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let burger = this.state.error ? <p>Ingredients can not be loaded!</p> : <Spinner />;
        let orderSummary = null;

        if(this.state.ingredients) {
          burger = (
            <Aux>
              <Burger ingredients={this.state.ingredients} />
              <BuildControls
                  addIng={this.addIngredientHandler}
                  remIng={this.removeIngredientHandler}
                  disabled={disabledInfo}
                  price={this.state.totalPrice}
                  purchasable={this.state.purchasable}
                  purchase={this.purchaseHandler}/>
            </Aux>
          )
          orderSummary =  <OrderSummary
              price={this.state.totalPrice}
              ingredients={this.state.ingredients}
              purchaseCancelled={this.purchaseCancelHandler}
              purchaseContinued={this.purchaseContinueHandler}/>;
        }

        if(this.state.loading) {
          orderSummary = <Spinner />
        }

        return (
          <Aux>
            <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
              {orderSummary}
            </Modal>
            {burger}
          </Aux>
        );
      }
    }

export default withErrorHandler(BurgerBuilder, axios);
