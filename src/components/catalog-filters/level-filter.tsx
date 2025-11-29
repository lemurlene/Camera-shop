import { memo, useCallback, KeyboardEvent, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { changeLevel, selectCurrentLevel } from '../../store/filters';
import { Levels, LEVEL_KEYS } from '../../const/const';


const LevelFilter = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const rawCurrentLevel = useAppSelector(selectCurrentLevel);

  const currentLevel = useMemo(() =>
    Array.isArray(rawCurrentLevel) ? rawCurrentLevel : [],
  [rawCurrentLevel]
  );

  const handleLevelChange = useCallback((levelKey: keyof typeof Levels) => {
    dispatch(changeLevel(levelKey));
  }, [dispatch]);

  const handleLevelKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>, levelKey: keyof typeof Levels) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleLevelChange(levelKey);
      }
    },
    [handleLevelChange]
  );

  const isLevelChecked = (levelKey: keyof typeof Levels): boolean =>
    currentLevel.includes(levelKey);

  return (
    <fieldset className="catalog-filter__block" data-testid="level-filter">
      <legend className="title title--h5">Уровень</legend>
      {LEVEL_KEYS.map((levelKey) => (
        <div key={levelKey} className="custom-checkbox catalog-filter__item">
          <label>
            <input
              type="checkbox"
              name="level"
              checked={isLevelChecked(levelKey)}
              onChange={() => handleLevelChange(levelKey)}
              onKeyDown={(e) => handleLevelKeyDown(e, levelKey)}
              aria-checked={isLevelChecked(levelKey)}
              tabIndex={0}
            />
            <span className="custom-checkbox__icon"></span>
            <span className="custom-checkbox__label">
              {Levels[levelKey]}
            </span>
          </label>
        </div>
      ))}
    </fieldset>
  );
};

export const LevelFilterMemo = memo(LevelFilter);
