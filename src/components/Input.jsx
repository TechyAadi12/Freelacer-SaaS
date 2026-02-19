const Input = ({
    label,
    error,
    type = 'text',
    className = '',
    required = false,
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="label">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                type={type}
                className={`input ${error ? 'input-error' : ''} ${className}`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
        </div>
    );
};

export default Input;
