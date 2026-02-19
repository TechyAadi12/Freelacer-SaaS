import { getStatusColor } from '../utils/helpers';

const Badge = ({ children, variant, className = '' }) => {
    const badgeClass = variant ? getStatusColor(variant) : 'badge-gray';

    return (
        <span className={`${badgeClass} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
