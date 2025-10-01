export function waitMinutesToText(count: number){
    const lastTwoDigits = count % 100;
    if(lastTwoDigits > 5 && lastTwoDigits < 21){
        return "минут"
    }
    const lastDigit = count % 10;
    switch (true){
        case lastDigit === 0:
            return "минут";
        case lastDigit === 1:
            return "минуту";
        case lastDigit < 5:
            return "минуты";
    }
    return "минут"
}