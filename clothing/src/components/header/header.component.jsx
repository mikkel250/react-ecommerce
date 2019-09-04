import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../firebase/firebase.utils';
import { connect } from 'react-redux';

import CartIcon from '../cart-icon/cart-icon.component';
import CartDropdown from '../cart-dropdown/cart-dropdown.component';

import { ReactComponent as Logo } from '../../assets/crown.svg';

import './header.styles.scss';


const Header = ({currentUser, hidden}) => (
  <div className="header">
    <Link className="logo-container" to='/'>
      <Logo className="logo"></Logo>
    </Link>
    <div className="options">
      <Link className="option" to="/shop">
        SHOP
      </Link>
      <Link className="option" to="/shop">
        Contact
      </Link>
      {
        currentUser ? ( <div className='option' onClick={() => auth.signOut()} >SIGN OUT</div> ) : ( <Link className='option' to='/signin'> SIGN IN </Link> )
      }
      <CartIcon />
    </div>
    {hidden ? null : <CartDropdown />}
  </div>
);

// mapStateToProps and connect are used any time we want properties from the reducers 
const mapStateToProps = ({user: {currentUser}, cart: {hidden}}) => ({ // state here is being pulled by redux from the root reducer
  // property   value 
  currentUser,
  hidden
});

// connect returns a higher order component that takes our component (Header) and that returns a new "souped up" component that has access to the properties in the reducers
export default connect(mapStateToProps)(Header);