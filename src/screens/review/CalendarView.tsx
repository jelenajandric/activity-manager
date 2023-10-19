import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
} from 'react-native';
import { useAppSelector } from "../../redux/hooks";
import { selectActivities, selectDates, } from "../../redux/activitySlice";
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { Activity } from "../../model/Activity";

const CalendarView = () => {

    const activities: Activity[] = useAppSelector(selectActivities);
    const dates: any = useAppSelector(selectDates);
    const navigation = useNavigation();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

    const getEventsForDay = (date: any) => {
        var events = activities.filter((activity) => {
            let day = activity.datetime.split('/')[0];
            let mounth = activity.datetime.split('/')[1];
            let year = activity.datetime.split('/')[2].slice(0, 4);
            let dateISO = year + '-' + mounth + '-' + day;
            return dateISO === date;
        });
        return events;
    };

    const onDayPress = (day: any) => {
        setSelectedDate(day.dateString);
    };

    const getDateInLocaleFormat = (date: string) => {
        let day = date.split('-')[2];
        let mounth = date.split('-')[1];
        let year = date.split('-')[0];
        return day + '.' + mounth + '.' + year + '.';
    }

    return (
        <View style={styles.body}>
            <Calendar
                style={styles.calendar}
                markedDates={dates}
                onDayPress={onDayPress}
            />
            <Text style={styles.text}>Aktivnosti na datum {getDateInLocaleFormat(selectedDate)}</Text>
            <FlatList
                keyExtractor={(item, index) => index.toString()}
                data={getEventsForDay(selectedDate)}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('OneActivityReview', { id: item.id })}>
                        <Text style={styles.title}>{item.title}</Text>
                        <View style={styles.activity_text_container}>
                            <Text style={styles.activity_text}>{item.category}</Text>
                            <Text style={styles.activity_text}>{item.datetime}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>

    )
}

export default CalendarView;


const styles = StyleSheet.create({
    body: {
        flex: 1
    },

    calendar: {
        height: 320,
        marginTop: 15,

    },
    text: {
        fontSize: 20,
        fontWeight: '500',
        color: '#000000',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10,
        justifyContent: 'center',

    },
    activity_text_container: {
        flex: 1,
        alignItems: 'center'
    },
    activity_text: {
        margin: 10,
        fontSize: 20,
        color: '#000'
    },
    item: {
        margin: 10,
        backgroundColor: '#6e754b',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        borderColor: '#2c3c1f',
        borderWidth: 1,
    },
    title: {
        color: '#000',
        fontSize: 35,
        fontWeight: '500',
        margin: 10,
        textAlign: 'center',
    },
})


