import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, type Mock } from 'vitest';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { changeLevel, selectCurrentLevel } from '../../store/filters';
import { LevelFilterMemo } from './level-filter';
import { Levels, LEVEL_KEYS } from '../../const/const';
import { State } from '../../store/type';
import { makeFakeStore } from '../../mocks/make-fake-store';

vi.mock('../../hooks', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

vi.mock('../../store/filters', async () => {
  const actual = await vi.importActual<typeof import('../../store/filters')>('../../store/filters');
  return {
    ...actual,
    changeLevel: vi.fn((levelKey: string) => ({
      type: 'filters/changeLevel',
      payload: levelKey
    })),
    selectCurrentLevel: vi.fn(),
  };
});

const mockedUseAppDispatch = useAppDispatch as Mock;
const mockedUseAppSelector = useAppSelector as Mock;
const mockedChangeLevel = vi.mocked(changeLevel);
const mockedSelectCurrentLevel = vi.mocked(selectCurrentLevel);

const setup = (currentLevel: typeof LEVEL_KEYS = []) => {
  const user = userEvent.setup();

  mockedUseAppSelector.mockImplementation((selector: (state: State) => unknown) => {
    if (selector === mockedSelectCurrentLevel) {
      return currentLevel;
    }

    const mockState = makeFakeStore({
      FILTERS: {
        category: null,
        level: currentLevel,
        type: [],
        minPrice: null,
        maxPrice: null,
      }
    });
    return selector(mockState);
  });

  const utils = render(<LevelFilterMemo />);

  return {
    user,
    ...utils,
  };
};

describe('LevelFilter component', () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    mockedUseAppDispatch.mockReturnValue(mockDispatch);
    mockedUseAppSelector.mockImplementation((selector: (state: State) => unknown) => {
      if (selector === mockedSelectCurrentLevel) {
        return [];
      }
      const mockState = makeFakeStore();
      return selector(mockState);
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders all level checkboxes', () => {
    setup();

    LEVEL_KEYS.forEach((levelKey) => {
      expect(screen.getByLabelText(Levels[levelKey])).toBeInTheDocument();
    });

    expect(screen.getByText('Уровень')).toBeInTheDocument();
  });

  it('calls changeLevel when checkbox is clicked', async () => {
    const { user } = setup();

    const checkbox = screen.getByLabelText(Levels[LEVEL_KEYS[0]]);
    await user.click(checkbox);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockedChangeLevel).toHaveBeenCalledWith(LEVEL_KEYS[0]);
  });

  it('calls changeLevel when Enter key is pressed', async () => {
    const { user } = setup();

    const checkbox = screen.getByLabelText(Levels[LEVEL_KEYS[0]]);
    checkbox.focus();
    await user.keyboard('{Enter}');

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockedChangeLevel).toHaveBeenCalledWith(LEVEL_KEYS[0]);
  });

  it('calls changeLevel when Space key is pressed', async () => {
    const { user } = setup();

    const checkbox = screen.getByLabelText(Levels[LEVEL_KEYS[0]]);
    checkbox.focus();
    await user.keyboard(' ');

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockedChangeLevel).toHaveBeenCalledWith(LEVEL_KEYS[0]);
  });

  it('marks checkboxes as checked based on currentLevel', () => {
    const selectedLevels = [LEVEL_KEYS[0], LEVEL_KEYS[2]];

    setup(selectedLevels);

    LEVEL_KEYS.forEach((levelKey) => {
      const checkbox = screen.getByLabelText(Levels[levelKey]);
      if (selectedLevels.includes(levelKey)) {
        expect(checkbox).toBeChecked();
      } else {
        expect(checkbox).not.toBeChecked();
      }
    });
  });

  it('sets correct aria attributes', () => {
    const selectedLevels = [LEVEL_KEYS[0]];

    setup(selectedLevels);

    const selectedCheckbox = screen.getByLabelText(Levels[selectedLevels[0]]);
    expect(selectedCheckbox).toHaveAttribute('aria-checked', 'true');

    const unselectedCheckbox = screen.getByLabelText(Levels[LEVEL_KEYS[1]]);
    expect(unselectedCheckbox).toHaveAttribute('aria-checked', 'false');
  });

  it('has correct fieldset structure', () => {
    setup();

    const fieldset = screen.getByRole('group');
    expect(fieldset).toHaveClass('catalog-filter__block');

    const legend = screen.getByText('Уровень');
    expect(legend).toHaveClass('title', 'title--h5');

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(LEVEL_KEYS.length);
  });

  it('is memoized component', () => {
    expect(typeof LevelFilterMemo).toBe('object');
    expect(LevelFilterMemo).toHaveProperty('type');
  });

  it('handles empty currentLevel correctly', () => {
    setup([]);

    LEVEL_KEYS.forEach((levelKey) => {
      expect(screen.getByLabelText(Levels[levelKey])).not.toBeChecked();
    });
  });

  it('handles multiple selected levels correctly', () => {
    const selectedLevels = [LEVEL_KEYS[0], LEVEL_KEYS[1], LEVEL_KEYS[2]];

    setup(selectedLevels);

    selectedLevels.forEach((levelKey) => {
      expect(screen.getByLabelText(Levels[levelKey])).toBeChecked();
    });
  });

  it('prevents default behavior on keyboard events', async () => {
    const { user } = setup();

    const checkbox = screen.getByLabelText(Levels[LEVEL_KEYS[0]]);
    checkbox.focus();
    await user.keyboard('{Enter}');

    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('maintains focus management', async () => {
    const { user } = setup();

    const firstCheckbox = screen.getByLabelText(Levels[LEVEL_KEYS[0]]);
    const secondCheckbox = screen.getByLabelText(Levels[LEVEL_KEYS[1]]);

    await user.tab();
    expect(firstCheckbox).toHaveFocus();

    await user.tab();
    expect(secondCheckbox).toHaveFocus();
  });

  it('has correct input attributes', () => {
    setup();

    const checkbox = screen.getByLabelText(Levels[LEVEL_KEYS[0]]);

    expect(checkbox).toHaveAttribute('type', 'checkbox');
    expect(checkbox).toHaveAttribute('name', 'level');
    expect(checkbox).toHaveAttribute('tabindex', '0');
  });

  it('applies correct CSS classes', () => {
    setup();

    const fieldset = screen.getByRole('group');
    expect(fieldset).toHaveClass('catalog-filter__block');

    const legend = screen.getByText('Уровень');
    expect(legend).toHaveClass('title', 'title--h5');

    const checkboxContainer = screen.getByLabelText(Levels[LEVEL_KEYS[0]]).closest('.custom-checkbox');
    expect(checkboxContainer).toHaveClass('catalog-filter__item');
  });
});

describe('LevelFilter edge cases', () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    mockedUseAppDispatch.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('handles unknown level keys gracefully', () => {
    setup(['unknown_level' as keyof typeof Levels]);

    expect(screen.getByText('Уровень')).toBeInTheDocument();
  });

  it('handles all levels selected', () => {
    setup(LEVEL_KEYS);

    LEVEL_KEYS.forEach((levelKey) => {
      expect(screen.getByLabelText(Levels[levelKey])).toBeChecked();
    });
  });

  it('toggles level selection correctly', async () => {
    const { user } = setup([LEVEL_KEYS[0]]);

    const checkbox = screen.getByLabelText(Levels[LEVEL_KEYS[0]]);

    await user.click(checkbox);

    expect(mockedChangeLevel).toHaveBeenCalledWith(LEVEL_KEYS[0]);
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: LEVEL_KEYS[0]
      })
    );
  });

  it('does not call changeLevel for other keyboard events', async () => {
    const { user } = setup();

    const checkbox = screen.getByLabelText(Levels[LEVEL_KEYS[0]]);
    checkbox.focus();

    await user.keyboard('a');
    await user.keyboard('{Tab}');
    await user.keyboard('{Escape}');

    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
