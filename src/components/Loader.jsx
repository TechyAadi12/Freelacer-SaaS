const Loader = ({ size = 'md', fullScreen = false }) => {
    const sizes = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    const sizeClass = sizes[size] || sizes.md;

    const spinner = (
        <div className={`${sizeClass} relative`}>
            <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-dark-700"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary-600 border-t-transparent animate-spin"></div>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-dark-900/80 backdrop-blur-sm z-50">
                {spinner}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-8">
            {spinner}
        </div>
    );
};

export default Loader;
