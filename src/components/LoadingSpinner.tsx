interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
  }
  
  const LoadingSpinner = ({ size = 'medium' }: LoadingSpinnerProps) => {
    const sizeClasses = {
      small: 'w-4 h-4',
      medium: 'w-6 h-6',
      large: 'w-8 h-8'
    };
  
    return (
      <div className={`inline-block ${sizeClasses[size]} animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]`} role="status">
        <span className="sr-only">Loading...</span>
      </div>
    );
  };
  
  export default LoadingSpinner;