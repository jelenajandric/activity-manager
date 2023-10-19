export const getDateFromString = (dateString: string) => {
    let dateOf = dateString.split(',')[0];
    let timeOf = dateString.split(',')[1].trim();

    let tmp = dateOf.split('/');
    let year = tmp[2];
    let mounthIndex: number = Number.parseInt(tmp[1]) - 1;
    let day = tmp[0];

    tmp = timeOf.split(':');
    let hours = tmp[0];
    let minutes = tmp[1];
    let seconds = tmp[2];

    return new Date(Number.parseInt(year), mounthIndex, Number.parseInt(day),
        Number.parseInt(hours), Number.parseInt(minutes), Number.parseInt(seconds));

}