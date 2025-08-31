


export function reviewCountToText(count: number){
    const lastTwoDigits = count % 100;
    if(lastTwoDigits > 5 && lastTwoDigits < 21){
        return "оценок"
    }
    const lastDigit = count % 10;
    switch (true){
        case lastDigit === 0:
            return "оценок";
        case lastDigit === 1:
            return "оценка";
        case lastDigit < 5:
            return "оценки";
    }
    return "оценок"
}

export function ratingToPercentage(ratingCount: number, totalCount: number){
    if(ratingCount === 0) return 0;
    return Math.round(
        (ratingCount / totalCount) * 100
    )
}