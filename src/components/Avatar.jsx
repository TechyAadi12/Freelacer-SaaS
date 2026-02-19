import { getInitials } from '../utils/helpers';

const Avatar = ({ name, src, size = 'md', className = '' }) => {
    const sizes = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base',
        xl: 'w-16 h-16 text-lg',
    };

    const sizeClass = sizes[size] || sizes.md;

    if (src) {
        return (
            <img
                src={src}
                alt={name}
                className={`${sizeClass} rounded-full object-cover ${className}`}
            />
        );
    }

    return (
        <div
            className={`${sizeClass} rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold ${className}`}
        >
            {getInitials(name)}
        </div>
    );
};

export default Avatar;
