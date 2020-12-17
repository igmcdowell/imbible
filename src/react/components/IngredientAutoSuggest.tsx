import * as React from 'react';
import * as Autosuggest from 'react-autosuggest';
import {SelectedIngredientList} from '../components/SelectedIngredientList';
import {ChangeEvent, SuggestionSelectedEventData} from 'react-autosuggest';
import {useDispatch, useSelector} from 'react-redux';
import {changeSuggestInput, addSuggestion} from '../actions';
import {FullState, IDrink, IngredientOrType} from '../../../types/ingredients';
import {useHistory} from 'react-router-dom';

type ImbibleAutoSuggestion = IngredientOrType | IDrink;
export const IngredientAutoSuggest = () => {
  const {inputProps, suggestions} = useSelector(extractProps);
  const dispatch = useDispatch();
  const history = useHistory();
  const onChange = (event: React.FormEvent<any>, {newValue, method}: ChangeEvent) => {
    if (['type', 'escape', 'click'].includes(method)) dispatch(changeSuggestInput(newValue));
  };
  const onSuggestionSelected = (
    event: React.FormEvent<any>,
    {suggestion, sectionIndex}: SuggestionSelectedEventData<ImbibleAutoSuggestion>
  ) => {
    if (sectionIndex === 0) {
      // Feels kind of hacky - assumes ingredients always are first in list.
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

function findMatches(inputValue: string, suggestions: ImbibleAutoSuggestion[]) {
  return inputValue.length === 0
    ? []
    : suggestions.filter(suggestion => {
        const idx = suggestion.name.toLowerCase().indexOf(inputValue.toLowerCase());
        return idx !== -1 && (idx === 0 || suggestion.name[idx - 1] === ' ');
      });
}

function getSuggestions(allSuggestions: IngredientOrType[], drinks: IDrink[], value: string) {
  const inputValue = value.trim().toLowerCase();
  // Important: If you re-order the results (e.g. drinks before ingredients) you need to change onSuggestionSelected to reflect the new indices
  // This also means no hiding empty sections. Getting around this will require adding a field to the suggestion
  // to disambiguate the type, so we can introspect directly/not rely on index.
  return [
    {
      title: 'Ingredients',
      items: findMatches(inputValue, allSuggestions).slice(0, 5),
    },
    {
      title: 'Drinks',
      items: findMatches(inputValue, drinks).slice(0, 5),
    },
  ];
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
