import moment from "moment";
import { getDateFromString } from "./GetDateFromString";
import PushNotification from "react-native-push-notification";

export const setNotificationForActivity = (minutes: number, datetime: string, title: string) => {
    let date: Date = getDateFromString(datetime);
    let now = new Date();
    let tmp = moment(date).subtract(minutes, 'minutes').toDate();
    if (date > now && tmp >= now) {
        PushNotification.localNotificationSchedule({
            channelId: 'activiy-channel',
            message: 'Podsjetnik za aktivnost na datum ' + date.toLocaleString("en-GB"),
            title: title,
            date: tmp,
            allowWhileIdle: true,
        });
    }
}
