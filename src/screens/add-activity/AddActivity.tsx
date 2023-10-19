import React, { useState } from "react";
import {
    StyleSheet,
    Text, View,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { ScrollView, TextInput } from "react-native-gesture-handler";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import CustomButton from "../../utils/CustomButton";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    selectActivities,
    selectActivityId,
    selectNotificationTimeMinutes,
    setActivities,
    setActivityId,
    setDates
} from "../../redux/activitySlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootStackScreenProps } from "../../types";
import { Activity } from "../../model/Activity";
import { setNotificationForActivity } from "../../functions/SetNotification";
import SegmentedControl from '@react-native-segmented-control/segmented-control';

export const categories = ["Slobodno vrijeme", "Posao", "Putovanje"];

export default function AddActivity({ navigation }: RootStackScreenProps<'AddActivity'>) {

    const activities: Activity[] = useAppSelector(selectActivities);
    const activityId: number = useAppSelector(selectActivityId);
    const notificationTimeMinutes: number = useAppSelector(selectNotificationTimeMinutes);

    const dispatch = useAppDispatch();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());
    const [location, setLocation] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(0);

    const [isDateTimePickerVisible, setDateTimePickerVisibility] = useState(false);
    const [isDatePicked, setIsDatePicked] = useState(false);

    const showDatePicker = () => {
        setDateTimePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDateTimePickerVisibility(false);
    };

    const handleConfirm = (date: Date) => {
        setDate(date);
        setIsDatePicked(true);
        hideDatePicker();
    };

    const saveActivity = async () => {
        if (title.length != 0 && date != null && location.length != 0) {
            var activity: Activity = {
                id: activityId,
                title: title,
                description: description,
                datetime: date.toLocaleString("en-GB"),
                location: location,
                category: categories[selectedCategory],
            }
            const index = activities?.findIndex((ac: Activity) => ac.id === activityId);
            let newActivities: Activity[] = [];
            if (index > -1) {
                newActivities = [...activities];
                newActivities[index] = activity;
            } else {
                newActivities = [...activities, activity];
            }
            await AsyncStorage.setItem("activities", JSON.stringify(newActivities))
                .then(() => {
                    dispatch(setActivities(newActivities));
                    dispatch(setDates(newActivities));
                    setNotification();

                    if (selectedCategory != 0) {
                        let num: number = 1;
                        let newId: number = activityId + num;
                        AsyncStorage.setItem("activityId", newId.toString())
                            .then(() => {
                                dispatch(setActivityId(newId));
                            })
                    }
                    clearInputValues();
                })
            if (activity.category === categories[0]) {
                navigation.navigate('AddImage', { id: activity.id });
            } else {
                navigation.navigate('HomeScreen', {
                    screen: 'Review'
                });
            }

        } else {
            Alert.alert('Upozorenje', 'Morate unijeti sva polja da biste dovršili akciju!');
        }
    }

    const setNotification = () => {
        setNotificationForActivity(notificationTimeMinutes, date.toLocaleString("en-GB"), title);
    }

    const clearInputValues = () => {
        setTitle('');
        setDescription('');
        setLocation('');
        setSelectedCategory(0);
        setIsDatePicked(false)
    }

    return (
        <ScrollView>
            <View style={styles.body}>
                <TextInput
                    value={title}
                    style={styles.input}
                    placeholder="Naziv"
                    placeholderTextColor="#4C4E52"
                    onChangeText={(value) => setTitle(value)}
                />
                <TextInput
                    value={description}
                    style={[styles.input, { height: 150, textAlignVertical: "top" }]}
                    placeholder="Opis"
                    placeholderTextColor="#4C4E52"
                    multiline={true}
                    onChangeText={(value) => setDescription(value)}
                />
                <Text style={styles.text}>
                    Kliknite ispod da biste izabrali datum i vrijeme:
                </Text>
                <TouchableOpacity
                    // style={styles.show_date_picker_button}
                    onPress={showDatePicker}
                    hitSlop={{ top: 25, bottom: 25, left: 35, right: 35 }}
                >
                    <FontAwesome5
                        name={'calendar-day'}
                        size={50}
                        color={'#000'}
                    />
                </TouchableOpacity>
                <DateTimePickerModal
                    isVisible={isDateTimePickerVisible}
                    mode="datetime"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />
                <Text style={styles.text}>
                    Ova aktivnost je zakazana za: {isDatePicked ? date.toLocaleString("en-GB") : ""}
                </Text>
                <TextInput
                    value={location}
                    style={styles.input}
                    placeholder="Lokacija"
                    placeholderTextColor="#4C4E52"
                    onChangeText={(value) => setLocation(value)}
                />
            </View>
            <View>
                <Text style={{ fontSize: 18, margin: 10, color: '#000' }}>
                    Izaberite kategoriju aktivnosti:
                </Text>
                <SegmentedControl
                    style={styles.segmented_control}
                    fontStyle={{ fontSize: 18 }}
                    tabStyle={{ alignContent: 'center', alignItems: 'center' }}
                    values={categories}
                    selectedIndex={selectedCategory}
                    onChange={(event) => {
                        setSelectedCategory(event.nativeEvent.selectedSegmentIndex);
                    }}
                />
            </View>

            <View style={styles.button_container}>
                <CustomButton
                    title="Sačuvaj"
                    color='#1eb900'
                    onPressFunction={saveActivity}
                />
            </View>

        </ScrollView>

    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#555555',
        borderRadius: 10,
        // backgroundColor: '#ffffff',
        textAlign: 'left',
        fontSize: 20,
        margin: 20,
        paddingHorizontal: 10,
        color: '#000',

    },
    text: {
        fontSize: 19,
        margin: 20,
        color: '#000',
    },
    button_container: {
        alignItems: 'center',
        margin: 20,
    },
    segmented_control: {
        height: 70,
        backgroundColor: '#FFDEAD',
        textAlign: 'center',
        textAlignVertical: 'center',
        width: '96%',
        alignSelf: 'center',
    }

})

