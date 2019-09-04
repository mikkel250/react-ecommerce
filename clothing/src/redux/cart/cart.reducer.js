import CartActionTypes from './cart.types';

const INITIAL_STATE = {
  hidden: true
};

const cartReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CartActionTypes.TOGGLE_CART_HIDDEN:
      return {
        ...state,
        hidden: !state.hidden
<<<<<<< HEAD
      }
=======
      };
>>>>>>> 69f89181934f556a4bb1a40116f30071e910fe35
    default:
      return state;
  }
};

<<<<<<< HEAD
export default cartReducer;
=======
export default cartReducer
>>>>>>> 69f89181934f556a4bb1a40116f30071e910fe35
