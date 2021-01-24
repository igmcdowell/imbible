import * as React from 'react';
import {FullState} from '../../../types/ingredients';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import {changePage} from '../actions';

const DRINKS_PER_PAGE = 5;

export const DrinkList = () => {
  const drinks = useSelector(getDrinks);
  return (
    <>
      <ul className="card drink-list">
        <Pagination />
        {drinks.map(({id, name, source, drinkIngredients}) => (
          <li key={id}>
            <div className="drink-headline">
              <Link to={`/drinks/${id}`}>{name}</Link>
              <span className="source">{source}</span>
            </div>
            <span className="ingredients">{drinkIngredients.map(ing => ing.name).join(', ')}</span>
          </li>
        ))}
      </ul>
    </>
  );
};

const isSubset = (candidate: number[], arr: number[]) => {
  const len = candidate.length;
  for (let i = 0; i < len; i++) {
    if (arr.indexOf(candidate[i]) === -1) return false;
  }
  return true;
};

const getDisplayDrinkData = ({autoSuggest: {pickedSuggestions, pageNum}, drinks}: FullState) => {
  const selectedIngredientTypes = pickedSuggestions.map(s => s.id);
  return {
    drinks: drinks.drinks.filter(d =>
      isSubset(selectedIngredientTypes, d.ingredientTypes.concat(d.ingredientSuperTypes))
    ),
    pageNum,
  };
};

const getDrinks = (state: FullState) => {
  const {drinks, pageNum} = getDisplayDrinkData(state);
  return drinks.slice(pageNum * DRINKS_PER_PAGE, (pageNum + 1) * DRINKS_PER_PAGE);
};

// TODO: factor out shared selector and move to other file.
const Pagination = () => {
  const {hasMore, maxPage, pageNum} = useSelector(getPaginationData);
  const dispatch = useDispatch();
  if (pageNum === 0 && !hasMore) {
    // If there's nothing more to show and we're on the first page, no need for pagination.
    return null;
  }
  return (
    <div className="pagination">
      <div>{pageNum > 0 ? <span onClick={() => dispatch(changePage(pageNum - 1))}>Prev </span> : null}</div>
      <div>
        {pageNum + 1} of {maxPage + 1}
      </div>
      <div>{hasMore ? <span onClick={() => dispatch(changePage(pageNum + 1))}> Next</span> : null}</div>
    </div>
  );
};

const getPaginationData = (state: FullState) => {
  const {drinks, pageNum} = getDisplayDrinkData(state);
  const maxPage = Math.ceil(drinks.length / DRINKS_PER_PAGE) - 1;
  const hasMore = maxPage > pageNum;
  return {hasMore, maxPage, pageNum};
};
