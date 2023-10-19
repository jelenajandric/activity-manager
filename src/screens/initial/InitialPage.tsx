import React, { useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet
} from 'react-native';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
    setActivityId,
    setNotificationTimeMinutes
} from "../../redux/activitySlice";
import { RootStackScreenProps } from '../../types';


export default function InitialPage({ navigation }: RootStackScreenProps<'InitialPage'>) {

    const dispatch = useAppDispatch();

    useEffect(() => {
        createChannels();
        findNotificationTime();
        findActivityId()
        setTimeout(() => {
            navigation.navigate('HomeScreen', {
                screen: 'Review'
            });
        }, 2000);
    }, []);

    const createChannels = () => {
        PushNotification.createChannel({
            channelId: "activiy-channel",
            channelName: "Activity Channel"
        }, () => {
        })
    }

    const findNotificationTime = () => {
        AsyncStorage.getItem("notificationTime")
            .then((notificationTime: any) => {
                if (notificationTime != null && notificationTime != undefined) {
                    dispatch(setNotificationTimeMinutes(Number.parseInt(notificationTime)))
                } else {
                    let minutes: number = 24 * 60;
                    AsyncStorage.setItem('notificationTime', minutes.toString())
                    dispatch(setNotificationTimeMinutes(minutes));
                }
            })
    }

    const findActivityId = async () => {
        await AsyncStorage.getItem("activityId")
            .then((id: any) => {
                if (id != null && id != undefined) {
                    dispatch(setActivityId(parseInt(id)));
                } else {
                    AsyncStorage.setItem('activityId', '1')
                }
            })
    }

    return (
        <View style={styles.body} >
            <Image
                style={styles.logo}
                source={require('../../../assets/logo.jpg')}
            />
            <Text
                style={[
                    styles.text
                ]}
            >
                Activity Manager
            </Text>
        </View>
    )

}


const styles = StyleSheet.create({
    body: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFDEAD',
    },
    logo: {
        width: 250,
        height: 250,
        margin: 20,
        borderRadius: 50,
    },
    text: {
        fontSize: 40,
        color: '#ffffff',
    },
})