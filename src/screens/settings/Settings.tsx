import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import SelectDropdown from "react-native-select-dropdown";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectActivities, selectNotificationTimeMinutes, setNotificationTimeMinutes } from "../../redux/activitySlice";
import PushNotification from "react-native-push-notification";
import { Activity } from "../../model/Activity";
import { setNotificationForActivity } from "../../functions/SetNotification";

export default function Settings() {
    
    const dispatch = useAppDispatch();
    const notificationTimeMinutes: number = useAppSelector(selectNotificationTimeMinutes);
    const activities: Activity[] = useAppSelector(selectActivities);

    const dropdownData = ["Sat ranije", "Dan ranije", "Sedam dana ranije", "Isključeno"]

    const saveNotificationTime = async (selectedTime: string) => {
        let minutes: number = getMinutesBySelectedTime(selectedTime);
        if (minutes != notificationTimeMinutes) {
            await AsyncStorage.setItem("notificationTime", minutes.toString()).then(() => {
                dispatch(setNotificationTimeMinutes(minutes));
                PushNotification.cancelAllLocalNotifications();
                if (minutes != 0) {
                    setNewNotifications(minutes);
                }
            })

        }
    }

    const getMinutesBySelectedTime = (selectedTime: string) => {
        let minutes: number = 0;
        switch (selectedTime) {

            case dropdownData[0]: {
                minutes = 60;
                break;
            }
            case dropdownData[1]: {
                minutes = 24 * 60;
                break;
            }
            case dropdownData[2]: {
                minutes = 7 * 24 * 60;
                break;
            }
            case dropdownData[3]: {
                minutes = 0;
                break;
            }
        }
        return minutes;
    }

    const getDefaultValueByIndex = () => {
        switch (notificationTimeMinutes) {

            case 60: {
                return 0;
            }
            case 24 * 60: {
                return 1;
            }
            case 7 * 24 * 60: {
                return 2;

            }
            case 0: {
                return 3;
            }
        }
    }


    const setNewNotifications = (minutes: number) => {
        activities.map((act: Activity) => {
            setNotificationForActivity(minutes, act.datetime, act.title);
        })
    }

    return (
        <ScrollView>
            <View style={styles.body}>
                <View style={styles.dropdown_container}>
                    <Text style={styles.text}>Izaberite vrijeme prikazivanja notifikacije za predstojeće aktivnosti:</Text>
                    <SelectDropdown
                        data={dropdownData}
                        buttonStyle={styles.dropdown_button}
                        dropdownStyle={styles.dropdown}
                        defaultButtonText="Kliknite i izaberite vrijeme"
                        defaultValueByIndex={getDefaultValueByIndex()}
                        onSelect={(selectedItem, index) => {
                            saveNotificationTime(selectedItem)
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem
                        }}
                        rowTextForSelection={(item, index) => {
                            return item
                        }}
                    />
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    body: {
        // flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        textAlign: 'left',
        marginTop: 20,
        color: '#000000',
        marginLeft: 20,
    },
    dropdown_container: {
        borderBottomColor: '#D3D3D3',
        borderBottomWidth: 2,
    },
    dropdown_button: {
        width: '95%',
        borderWidth: 1,
        borderColor: '#2c3c1f',
        borderRadius: 10,
        backgroundColor: '#FFDEAD',
        margin: 20,
        fontSize: 20,

    },
    dropdown: {
        width: '95%',
        borderColor: '#555555',
        borderRadius: 10,

    },

})