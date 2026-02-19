const Card = ({ children, className = '', hover = false, onClick }) => {
    return (
        <div
            className={`card ${hover ? 'cursor-pointer hover:scale-[1.02]' : ''} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default Card;
