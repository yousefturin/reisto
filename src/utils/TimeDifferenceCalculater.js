function calculateTimeDifference(timestampObj) {
    // Convert Firestore timestamp to JavaScript Date object
    const targetTime = new Date((timestampObj.seconds * 1000) + (timestampObj.nanoseconds / 1000000));

    const currentTime = new Date();
    const differenceInMilliseconds = Math.abs(currentTime - targetTime);
    const differenceInHours = Math.floor(differenceInMilliseconds / (1000 * 60 * 60));

    if (differenceInHours < 1) {
        const differenceInMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));
        return `${differenceInMinutes}m`;
    } else {
        return differenceInHours < 24 ? `${differenceInHours}h` : `${Math.floor(differenceInHours / 24)}d`;
    }
}

export default calculateTimeDifference;
