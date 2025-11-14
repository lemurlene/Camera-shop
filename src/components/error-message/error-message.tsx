import { useAppSelector } from '../../hooks';
import { selectError } from '../../store/error/error.selector';
import './style.css';

function ErrorMessage(): JSX.Element | null {
  const error = useAppSelector(selectError);

  return (error)
    ? <div className='error-message' data-testid="error-message">{error}</div>
    : null;
}

export default ErrorMessage;
