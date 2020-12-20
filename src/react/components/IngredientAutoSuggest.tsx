import * as React from 'react';
import * as Autosuggest from 'react-autosuggest';
import {SelectedIngredientList} from '../components/SelectedIngredientList';
import {ChangeEvent, SuggestionSelectedEventData} from 'react-autosuggest';
import {useDispatch, useSelector} from 'react-redux';
import {changeSuggestInput, addSuggestion} from '../actions';
import {FullState, IDrink, IngredientOrType} from '../../../types/ingredients';
import {useHistory} from 'react-router-dom';

enum SuggestionType {
  Ingredient,
  Drink,
}

type ImbibleAutoSuggestion = (IngredientOrType | IDrink) & {type: SuggestionType};
export const IngredientAutoSuggest = () => {
  const {inputProps, suggestions} = useSelector(extractProps);
  const dispatch = useDispatch();
  const history = useHistory();
  const onChange = (event: React.FormEvent<any>, {newValue, method}: ChangeEvent) => {
    if (['type', 'escape', 'click'].includes(method)) dispatch(changeSuggestInput(newValue));
  };
  const onSuggestionSelected = (
    event: React.FormEvent<any>,
    {suggestion}: SuggestionSelectedEventData<ImbibleAutoSuggestion>
  ) => {
    if (suggestion.type === SuggestionType.Ingredient) {
      dispatch(addSuggestion(suggestion));
    } else {
      // Note: this circumvents dispatch, but we're not keeping location in the redux store, so c'est la vie.
      // Probably would be better to move away from react-router and get all this in redux.
      history.push(`/drinks/${suggestion.id}`);
    }
  };

  return (
    <>
      <Autosuggest<ImbibleAutoSuggestion>
        suggestions={suggestions}
        getSuggestionValue={(suggestion: ImbibleAutoSuggestion) => suggestion.name}
        getSectionSuggestions={section => section.items}
        renderSectionTitle={section => section.title}
        renderSuggestion={(suggestion: ImbibleAutoSuggestion) => <span>{suggestion.name}</span>}
        // TODO: Seems like this is the preferred way of signaling a state, and we're running around it
        onSuggestionsFetchRequested={() => null}
        onSuggestionSelected={onSuggestionSelected}
        // TODO: this should be implemented
        onSuggestionsClearRequested={() => null}
        inputProps={{...inputProps, onChange}}
        multiSection
      />
      <SelectedIngredientList />
    </>
  );
};

function findMatches(inputValue: string, suggestions: IngredientOrType[], type: SuggestionType) {
  return inputValue.length === 0
    ? []
    : suggestions
        .filter(suggestion => {
          const idx = suggestion.name.toLowerCase().indexOf(inputValue.toLowerCase());
          return idx !== -1 && (idx === 0 || suggestion.name[idx - 1] === ' ');
        })
        .map(suggestion => ({...suggestion, type}));
}

function getSuggestions(allSuggestions: IngredientOrType[], drinks: IDrink[], value: string) {
  const inputValue = value.trim().toLowerCase();
  return [
    {
      title: 'Ingredients',
      items: findMatches(inputValue, allSuggestions, SuggestionType.Ingredient).slice(0, 5),
    },
    {
      title: 'Drinks',
      items: findMatches(inputValue, drinks, SuggestionType.Drink).slice(0, 5),
    },
  ].filter(section => section.items.length);
}

const extractProps = ({autoSuggest: {value, pickedSuggestions}, drinks}: FullState) => {
  const availableIngredients = drinks.ingredientTypes.filter(ing => pickedSuggestions.indexOf(ing) === -1);
  const suggestions = getSuggestions(availableIngredients, drinks.drinks, value);
  return {
    inputProps: {
      value,
      placeholder: 'Search by ingredient or drink',
    },
    suggestions,
  };
};
