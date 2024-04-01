export const ConfirmationPaper = () => {
    const date = new Date();
    return (
        <div>
            {date.getDate()}
            {date.getTime()}
        </div>
    );
};
