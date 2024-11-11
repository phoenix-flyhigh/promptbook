const formatTimeAgo = (timestamp: Date) => {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const currentTime: number = Date.now();
    const postedTime: number = Number(new Date(timestamp));
    
    const timeDifferenceInDays = Math.floor((currentTime - postedTime) / (1000 * 86400));
    
    if (timeDifferenceInDays > 6) {
        const currentYear = new Date(currentTime).getFullYear()
        const postedDate = new Date(timestamp)
        
        const postedYear = postedDate.getFullYear()
        const postedDayNumber = postedDate.getDate()
        const postedMonthNumber = postedDate.getMonth()
        const postedMonth = months[postedMonthNumber]
            
        if (currentYear === postedYear)
            return `${postedMonth} ${postedDayNumber}`

        return `${postedMonth} ${postedDayNumber}, ${postedYear}`
    }
    // Time difference in seconds
    const timeDifferenceInSeconds = Math.floor((currentTime - postedTime) / 1000); // Time difference in seconds
    
    if (timeDifferenceInSeconds < 60) {
        return `${timeDifferenceInSeconds} second${timeDifferenceInSeconds > 1 ? 's' : ''} ago`;
    } else if (timeDifferenceInSeconds < 3600) {
        const minutes = Math.floor(timeDifferenceInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (timeDifferenceInSeconds < 86400) {
        const hours = Math.floor(timeDifferenceInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        const days = Math.floor(timeDifferenceInSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
}

export default formatTimeAgo;
