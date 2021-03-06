/* This is a module that contains a stateless react component, which constructs
 * the user's current cart. Includes functionality for removing an item from the cart
 */

'use strict';

const React = require('react');

export default function CartList(props) {
  /**
   * Function that takes the user's cart object and constructs a React node for
   * each item in the cart and the total cart cost
   * @param {object} cart - object containing user's current cart
   * @return {object} - array of react components and total cost of cart items
   */
   function constructItems(cart) {
     const currentCart = cart;
     let cartCost = 0;

     const items = currentCart.map((c, i) => {
       const currentCost = (c.amount * c.price);
       cartCost += currentCost; // track the total cost of what's in the cart

       // components that compose a single transaction
       return (
         React.createElement('tr', { className: 'cart-item', key: `cart-item-${i}` },
           React.createElement('td', { className: 'cart-item-moonlet' },
             React.createElement('a', { className: 'cart-moonlet-a',
               href: `/moonlet/${c.item}`, target: '_blank' }, c.item)
           ),
           React.createElement('td', { className: 'cart-item-price' }, `${c.price} C`),
           React.createElement('td', { className: 'cart-item-amount' }, c.amount),
           React.createElement('td', { className: 'cart-item-cost' }, currentCost),
           React.createElement('td', { className: 'cart-item-remove' },
             React.createElement('i', { className: `remove-btn fa fa-times ${c.item}`, onClick: props.handleItemRemove })
           )
         )
       );
     });

     return { items, cost: cartCost } ;
   }

  /* contruct each row of transaction history via table rows */
  const cartNodes = constructItems(props.cart);

  return (
    React.createElement('div', { id: 'cart-list' },
      React.createElement('h2', { className: 'cart-list-header' }, 'Your Current Cart'),
      React.createElement('table', { id: 'cart-list-display' },
        // cart list table header
        React.createElement('thead', null,
          React.createElement('tr', null,
            React.createElement('th', null, 'Moonlet'),
            React.createElement('th', null, 'Price'),
            React.createElement('th', null, 'Amount'),
            React.createElement('th', null, 'Cost'),
            React.createElement('th', null, 'Remove')
          )
        ),
        React.createElement('tbody', null, cartNodes.items)
      ),
      React.createElement('div', { className: 'clear-filler' }),
      React.createElement('h2', { className: 'cart-cost-final' }, 'Total Cost: ',
        React.createElement('span', { className: 'cart-cost-point' }, `${cartNodes.cost} Credits`)
      )
    )
  );
}

CartList.propTypes = {
  cart: React.PropTypes.object,
  handleItemRemove: React.PropTypes.func.isRequired,
};
