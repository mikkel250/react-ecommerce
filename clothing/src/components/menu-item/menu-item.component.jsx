import React from 'react';
import { withRouter } from 'react-router-dom';
import './menu-item.styles.scss';

// the brackets around the title below is just destructuring the props so it can be used further down as just {title}. it's the same thing as writing props.title
const MenuItem = ({title, imageUrl, size, history, linkUrl, match }) => (
  //the style below allows adding css properties to JSX (note the camelCase)
  <div
    className={`${size} menu-item`}
    onClick={() => history.push(`${match.url}${linkUrl}`)}
  >
    <div
      className='background-image'
      style={{
      backgroundImage: `url(${imageUrl})`
      }}
    />
    <div className='content'>
      <h1 className='title'>{title.toUpperCase() }</h1>
      <span className="subtitle">SHOP NOW</span>
    </div>
  </div>
);

export default MenuItem;