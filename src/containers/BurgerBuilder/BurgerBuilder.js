import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-order';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import {connect} from 'react-redux';
import * as actions from '../../store/actions';

class BurgerBuilder extends Component {

        state = {
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
      // axios.get('https://react-my-burger-39aa5.firebaseio.com/ingredients.json')
      //   .then(response => this.setState({ingredients: response.data}))
      //   .catch(error => this.setState({error: true}))
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

        let burger = this.state.error ? <p>Ingredients can not be loaded!</p> : <Spinner />;
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

const mapStateToProps = state => {
  return {
    ings: state.ingredients,
    price: state.totalPrice
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingName) => dispatch({type: actions.ADD_INGREDIENT, ingredientName: ingName}),
    onIngredientRemoved: (ingName) => dispatch({type: actions.REMOVE_INGREDIENT, ingredientName: ingName})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
