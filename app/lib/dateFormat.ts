const formatLocalDateTime = (dateInput: string | Date | null | undefined): string => {
    if (!dateInput) return "";

    let date: Date;

    if (dateInput instanceof Date) {
        date = dateInput;
    } else {
        // Treat plain DB timestamp as UTC
        // Append "Z" to force UTC parsing
        date = new Date(dateInput + "Z");
    }

    if (isNaN(date.getTime())) return "";

    return date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};

export default formatLocalDateTime;
