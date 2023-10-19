import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, Text, View } from 'react-native'
import { RootStackScreenProps } from "../../types";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { categories } from "../add-activity/AddActivity";
import { selectActivities, setActivities, setDates } from "../../redux/activitySlice";
import ActivityImages from "./ActivityImages";
import Map from "./Map";
import { ScrollView } from "react-native-gesture-handler";
import IconButton from "../../utils/IconButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Activity } from "../../model/Activity";

export default function OneActivityReview({ navigation, route }: RootStackScreenProps<'OneActivityReview'>) {

    const activities: Activity[] = useAppSelector(selectActivities);
    const dispatch = useAppDispatch();
    const [activity, setActivity] = useState<Activity>();

    useEffect(() => {
        prepareActivity();
    }, [])

    const prepareActivity = () => {
        let id = route.params.id;
        activities.forEach(element => {
            if (element.id === id) {
                setActivity(element);
            }
        });
    }

    const deleteActivity = () => {
        let newActivities: Activity[] = activities.filter(act => act.id != activity?.id);
        dispatch(setActivities(newActivities));
        dispatch(setDates(newActivities));
        if (activity?.category == categories[0]) {
            AsyncStorage.removeItem(activity.id.toString());
        }
        AsyncStorage.removeItem('activities').then(() => {
            AsyncStorage.setItem('activities', JSON.stringify(newActivities)).then(() => {
                navigation.navigate('HomeScreen', {
                    screen: 'Review'
                });
            })
        })
    }

    const showConfirmDialog = () => {
        return Alert.alert(
            "Da li ste sigurni?",
            "Da li ste sigurni da želite obrisati ovu aktivnost?",
            [
                {
                    text: "Da",
                    onPress: () => {
                        deleteActivity();
                    }
                },
                {
                    text: "Odustani",
                },
            ]
        );
    };

    return (
        <View style={styles.body}>
            <ScrollView>
                <View style={styles.body} >
                    <View>
                        <Text style={styles.title}>{activity?.title}</Text>
                        <Text style={styles.category}>{activity?.category}</Text>
                        <Text style={styles.category}>Lokacija: {activity?.location}</Text>
                        <Text style={styles.description}>{activity?.description}</Text>
                        <Text style={styles.date}>{activity?.datetime}</Text>
                        {activity?.category === categories[0] ?
                            (
                                <ActivityImages
                                    id={activity?.id}
                                />
                            ) :
                            (
                                activity?.category === categories[2] ?
                                    (<Map
                                        city={activity.location}
                                    />)
                                    :
                                    (<View />)
                            )
                        }
                    </View>
                </View>
            </ScrollView>
            <IconButton
                iconName='trash-alt'
                onPressFunction={showConfirmDialog}
                backColor='#ff0000'
            />
        </View>

    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: '#FFDEAD',
    },
    title: {
        textAlign: 'center',
        fontSize: 55,
        fontWeight: '400',
        color: '#2c3c1f',
        margin: 5,
    },
    category: {
        textAlign: 'center',
        fontSize: 18,
        marginTop:4,
    },
    description: {
        textAlign: 'center',
        color: '#2c3c1f',
        margin: 20,
        fontSize: 25,

    },
    date: {
        textAlign: 'center',
        fontSize: 18,
    }
})