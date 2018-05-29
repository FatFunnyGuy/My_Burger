import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index'; // `index` could be ommited here.
import axios from '../../axios-order';

class BurgerBuilder extends Component {

        state = {
        purchasing: false,
    }

    componentDidMount() {
      this.props.onInitIngredients();
    }

    updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map(igKey => ingredients[igKey])
            .reduce((sum, el) => sum+el);

        return sum > 0;
    };

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
      this.props.onInitPurchase();
        // const queryParams = [];
        // for(let i in this.state.ingredients) {
        //   queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        // }
        // queryParams.push('price=' + this.props.price);
        // const queryString = queryParams.join('&');
        // this.props.history.push({
        //   pathname: '/checkout',
        //   search: '?' + queryString
        // });
        this.props.history.push('/checkout');
    }

      render() {

        const disabledInfo = {...this.props.ings};

        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let burger = this.props.error ? <p>Ingredients can not be loaded!</p> : <Spinner />;
        let orderSummary = null;

        if(this.props.ings) {
          burger = (
            <Aux>
              <Burger ingredients={this.props.ings} />
              <BuildControls
                  addIng={this.props.onIngredientAdded}
                  remIng={this.props.onIngredientRemoved}
                  disabled={disabledInfo}
                  price={this.props.price}
                  purchasable={this.updatePurchaseState(this.props.ings)}
                  purchase={this.purchaseHandler}/>
            </Aux>
          )
          orderSummary =  <OrderSummary
              price={this.props.price}
              ingredients={this.props.ings}
              purchaseCancelled={this.purchaseCancelHandler}
              purchaseContinued={this.purchaseContinueHandler}/>;
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

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
    onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
    onInitIngredients: () => dispatch(actions.initIngredients()),
    onInitPurchase: () => dispatch(actions.purchaseInit())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
