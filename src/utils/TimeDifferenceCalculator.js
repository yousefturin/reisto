function calculateTimeDifference(timestampObj) {
    // console.log(timestampObj)
    // Convert Firestore timestamp to JavaScript Date object
    const targetTime = new Date((timestampObj.seconds * 1000) + (timestampObj.nanoseconds / 1000000));

    const currentTime = new Date();
    const differenceInMilliseconds = Math.abs(currentTime - targetTime);
    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);

    if (differenceInSeconds < 60) {
        return `${differenceInSeconds}s`;
    } else {
        const differenceInMinutes = Math.floor(differenceInSeconds / 60);
        if (differenceInMinutes < 60) {
            return `${differenceInMinutes}m`;
        } else {
            const differenceInHours = Math.floor(differenceInMinutes / 60);
            if (differenceInHours < 24) {
                return `${differenceInHours}h`;
            } else {
                const differenceInDays = Math.floor(differenceInHours / 24);
                if (differenceInDays < 30) {
                    return `${differenceInDays}d`;
                } else {
                    // If more than one month, return the date
                    const options = { year: 'numeric', month: 'short', day: 'numeric' };
                    return targetTime.toLocaleDateString(undefined, options);
                }
            }
        }
    }
}

export default calculateTimeDifference;
