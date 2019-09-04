import React from 'react';
import { connect } from 'react-redux';
<<<<<<< HEAD

=======
>>>>>>> 69f89181934f556a4bb1a40116f30071e910fe35
import { toggleCartHidden } from '../../redux/cart/cart.actions';

import { ReactComponent as ShoppingIcon } from '../../assets/shopping-bag.svg';

import './cart-icon.styles.scss';

const CartIcon = ({toggleCartHidden}) => (
<<<<<<< HEAD
  <div className="cart-icon" onClick={toggleCartHidden}>
    <ShoppingIcon className='shopping-icon' />
    <span className="item-count"></span>
=======
  <div className="cart-icon"onClick={toggleCartHidden}>
    <ShoppingIcon className='shopping-icon' />
    <span className="item-count">0</span>
>>>>>>> 69f89181934f556a4bb1a40116f30071e910fe35
  </div>
);

const mapDispatchToProps = dispatch => ({
  toggleCartHidden: () => dispatch(toggleCartHidden())
});

export default connect(null, mapDispatchToProps)(CartIcon);
