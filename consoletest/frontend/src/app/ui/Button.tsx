export default function Button({
    buttonName,
    onClick,
}: {
    buttonName?: string;
    onClick?: React.MouseEventHandler
}) {
    return (
        <button onClick={onClick}>
            {buttonName}
        </button>
    )
}