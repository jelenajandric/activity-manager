import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import { useAppSelector } from "../../redux/hooks";
import { selectActivities } from "../../redux/activitySlice";
import { Activity } from "../../model/Activity";
import { SearchBar } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { getDateFromString } from "../../functions/GetDateFromString";

const ChronologicallyView = () => {

    const navigation = useNavigation();

    const activities: Activity[] = useAppSelector(selectActivities);
    const [search, setSearch] = useState('');
    const [sortedData, setSortedData] = useState<Activity[]>([])
    const [Refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        getSortedData();
    }, [search])

    const onRefresh = () => {
        setRefreshing(true);
        getSortedData();
        setRefreshing(false);
    }

    const getSortedData = () => {
        var data = activities.slice().sort((a, b) => {
            let aDate = getDateFromString(a.datetime);
            let bDate = getDateFromString(b.datetime);
            return aDate.valueOf() - bDate.valueOf()
        }).filter((act) => {
            return getDateFromString(act.datetime) >= new Date();
        })
        if (search.length > 0) {
            data = data.filter((act) => {
                return act.title.toLocaleLowerCase().includes(search.toLocaleLowerCase());
            })
        }
        setSortedData(data);
    }

    return (
        <View style={styles.body}>
            <View>
                <SearchBar
                    value={search}
                    style={styles.search}
                    placeholder="Pretražite po nazivu"
                    onChangeText={(value) => setSearch(value)}
                    inputContainerStyle={{ backgroundColor: '#fff' }}
                    round
                    containerStyle={{ backgroundColor: '#d2d2d2', alignItems: 'center', justifyContent: 'center' }}
                />
            </View>
            <View style={{ flex: 1 }}>
                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={sortedData}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('OneActivityReview', { id: item.id })}>
                            <Text style={styles.title}>{item.title}</Text>
                            <View style={styles.activity_text_container}>
                                <Text style={styles.activity_text}>{item.category}</Text>
                                <Text style={styles.activity_text}>{item.datetime}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={Refreshing}
                            onRefresh={onRefresh}
                            colors={['#2c3c1f']}
                        />
                    }
                />
            </View>
        </View>
    )
}

export default ChronologicallyView;


const styles = StyleSheet.create({
    body: {
        flex: 1,
        marginTop: 10,
    },
    activity_text_container: {
        flex: 1,
        alignItems: 'center'
    },
    activity_text: {
        margin: 10,
        fontSize: 20,
        color: '#000000'
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
        color: '#000000',
        fontSize: 35,
        margin: 10,
        textAlign: 'center',
        fontWeight: '500',

    },
    search: {
        width: '100%',
        alignSelf: 'center',
        color: '#000000'
    }
});