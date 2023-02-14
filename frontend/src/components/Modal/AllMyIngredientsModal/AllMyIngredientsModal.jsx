import React, { useState, useEffect } from 'react';
import './AllMyIngredientsModal.scss';
import { Circle } from './AllMyIngredientsModalStyle';

function AllMyIngredientsModal({ onClose, fridge, myFridge }) {
  const [isActive, setIsActive] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setIsActive(!isActive);
  };
  const handleClose = () => {
    onClose?.();
  };

  const fridgeIngredient = fridge.map(i => {
    return (
      <span>
        <Circle key={i}>
          <img src={i?.ingredient.ingredientIcon} alt="icon" />
        </Circle>
        <div>{i?.ingredient.ingredientName}</div>
      </span>
    );
  });

  const afterPatch = myFridge.map(f => {
    return (
      <span>
        <Circle key={f}>
          <img src={f.ingredient.ingredientIcon} alt="icon" />
        </Circle>
        <div>{f.ingredient.ingredientName}</div>
      </span>
    );
  });

  return (
    <button className="Overlay" onClick={handleClose}>
      <div aria-hidden className="fridge" onClick={e => e.stopPropagation()}>
        <div className={`door top ${isActive ? 'active' : ''}`} />
        <button
          aria-label="Mute volume"
          className={`door bottom ${isActive ? 'active' : ''}`}
          onClick={handleClick}
        />
        <div className="container">
          <div className="shelves" />
          {myFridge.length > 0 ? afterPatch : fridgeIngredient}
        </div>
      </div>
    </button>
  );
}

export default AllMyIngredientsModal;
