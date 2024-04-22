export const CalculateCreateAt = (timeObject) => {
    const { seconds, nanoseconds } = timeObject;
    const date = new Date(seconds * 1000 + nanoseconds / 1000000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};