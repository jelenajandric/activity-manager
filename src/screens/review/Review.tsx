import React, { useEffect, useState } from "react";
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
    selectActivities,
    setActivities,
    setDates
} from "../../redux/activitySlice";
import { HomeTabScreenProps } from "../../types";
import SwitchSelector from "react-native-switch-selector";
import CalendarView from "./CalendarView";
import ChronologicallyView from "./ChronologicallyView";
import { Activity } from "../../model/Activity";



export default function Review({ navigation }: HomeTabScreenProps<'Review'>) {

    const activities: Activity[] = useAppSelector(selectActivities);
    const dispatch = useAppDispatch();

    const [selectedReview, setSelectedReview] = useState(0);

    const options = [
        { label: "Kalendarski prikaz", value: "0" },
        { label: "Hronološki prikaz", value: "1" },
    ];

    useEffect(() => {
        getActivities();
    }, [])

    const getActivities = () => {
        AsyncStorage.getItem("activities")
            .then((activitiesFromStorage: any) => {
                const parsed: Activity[] | any = JSON.parse(activitiesFromStorage);
                if (parsed && typeof parsed === 'object') {
                    dispatch(setActivities(parsed))
                    dispatch(setDates(parsed));
                }
            })
    }

    const onPressSwitchSelector = (value: any) => {
        setSelectedReview(value);
    }

    return (
        <View style={styles.body}>
            <SwitchSelector
                options={options}
                initial={0}
                style={styles.switch_selector}
                buttonColor='#6e754b'
                onPress={value => onPressSwitchSelector(value)}
                fontSize={17}
            />
            {selectedReview == 0 ? <CalendarView /> : <ChronologicallyView />}
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
    },
    switch_selector: {
        width: '90%',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 15,
        borderWidth: 1,
        borderRadius: 90,
        borderColor: '#2c3c1f',
    },
})


