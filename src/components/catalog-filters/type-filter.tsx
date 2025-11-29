import { memo, useCallback, KeyboardEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { changeType, selectCurrentType, selectCurrentCategory } from '../../store/filters';
import { Types, TYPE_KEYS } from '../../const/const';

const TypeFilter = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const currentType = useAppSelector(selectCurrentType);
  const currentCategory = useAppSelector(selectCurrentCategory);

  const handleTypeChange = useCallback((typeKey: keyof typeof Types) => {
    dispatch(changeType(typeKey));
  }, [dispatch]);

  const handleTypeKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>, typeKey: keyof typeof Types) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTypeChange(typeKey);
    }
  }, [handleTypeChange]);

  const isTypeDisabled = (typeKey: keyof typeof Types): boolean =>
    currentCategory === 'videocamera' && (typeKey === 'film' || typeKey === 'snapshot');

  const isTypeChecked = (typeKey: keyof typeof Types): boolean =>
    currentType.includes(typeKey);

  return (
    <fieldset className="catalog-filter__block" data-testid="type-filter">
      <legend className="title title--h5">Тип камеры</legend>
      {TYPE_KEYS.map((typeKey) => (
        <div key={typeKey} className="custom-checkbox catalog-filter__item">
          <label>
            <input
              type="checkbox"
              name="type"
              checked={isTypeChecked(typeKey)}
              onChange={() => handleTypeChange(typeKey)}
              onKeyDown={(e) => handleTypeKeyDown(e, typeKey)}
              disabled={isTypeDisabled(typeKey)}
              aria-checked={isTypeChecked(typeKey)}
              aria-disabled={isTypeDisabled(typeKey)}
              tabIndex={0}
            />
            <span className="custom-checkbox__icon"></span>
            <span className="custom-checkbox__label">
              {Types[typeKey]}
            </span>
          </label>
        </div>
      ))}
    </fieldset>
  );
};

export const TypeFilterMemo = memo(TypeFilter);
