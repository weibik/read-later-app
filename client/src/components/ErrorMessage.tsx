import { AlertCircle } from 'lucide-react';

type ErrorMessageProps = {
  message: string;
};

function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
      <AlertCircle size={16} aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
export default ErrorMessage;
