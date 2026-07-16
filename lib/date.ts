export function getISTTodayRange() {
    const now = new Date();

    // Convert current UTC time to IST
    const istNow = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);

    // Start of IST day
    const startIST = new Date(
        istNow.getFullYear(),
        istNow.getMonth(),
        istNow.getDate()
    );

    // Convert back to UTC for storing/querying
    const startUTC = new Date(startIST.getTime() - 5.5 * 60 * 60 * 1000);

    const endUTC = new Date(startUTC);
    endUTC.setUTCDate(endUTC.getUTCDate() + 1);

    return {
        start: startUTC,
        end: endUTC,
    };
}