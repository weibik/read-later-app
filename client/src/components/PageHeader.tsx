import Button from '../components/Button';

type PageHeaderProps = {
  onLogout?: () => void;
};

function PageHeader({ onLogout }: PageHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="mx-auto max-w-5xl px-5 py-3 flex items-center justify-between">
        <h1 className="text-base font-medium">Read Later</h1>
        {onLogout && (
          <Button
            variant="ghost"
            onClick={() => {
              onLogout();
            }}
          >
            Log out
          </Button>
        )}
      </div>
    </header>
  );
}

export default PageHeader;
