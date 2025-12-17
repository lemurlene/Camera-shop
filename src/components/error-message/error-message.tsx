import { useAppSelector } from '../../hooks';
import { selectError } from '../../store/error';
import './style.css';

type ErrorMessageProps = {
  message?: string;
};

function ErrorMessage({ message }: ErrorMessageProps): JSX.Element | null {
  const storeError = useAppSelector(selectError);
  const text = message ?? storeError;

  return text ? (
    <div className="error-message" data-testid="error-message">
      {text}
    </div>
  ) : null;
}

export default ErrorMessage;
