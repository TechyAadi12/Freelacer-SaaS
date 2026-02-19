const Select = ({
    label,
    error,
    options = [],
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
            <select
                className={`input ${error ? 'input-error' : ''} ${className}`}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
        </div>
    );
};

export default Select;
