import { selectError } from './error.selector';
import { makeFakeStore } from '../../mocks/make-fake-store';
import { NameSpace } from '../const';

describe('error selector', () => {
  it('should return error string from state', () => {
    const expectedError = 'Test error message';
    const fakeState = makeFakeStore({
      [NameSpace.Error]: { error: expectedError },
    });

    const result = selectError(fakeState);

    expect(result).toBe(expectedError);
  });

  it('should return null when error is null', () => {
    const fakeState = makeFakeStore({
      [NameSpace.Error]: { error: null },
    });

    const result = selectError(fakeState);

    expect(result).toBeNull();
  });

  it('should return null when error is not defined in state', () => {
    const fakeState = makeFakeStore();

    const result = selectError(fakeState);

    expect(result).toBeNull();
  });

  it('should return empty string when error is empty string', () => {
    const fakeState = makeFakeStore({
      [NameSpace.Error]: { error: '' },
    });

    const result = selectError(fakeState);

    expect(result).toBe('');
  });
});
