

const LoadingSpinner: React.FC = () => {
    return (
        <div className="inline-flex items-center justify-center">
            <img
                src="/assets/logo.jpg"
                alt="Loading..."
                className="h-5 w-5 rounded-full animate-spin"
                style={{ animationDuration: '1s' }}
            />
        </div>
    );
};

export default LoadingSpinner;
