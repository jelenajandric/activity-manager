import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

const Map = (props: any) => {

    const [longitude, setLongitude] = useState<number>(0);
    const [latitude, setLatitude] = useState<number>(0);
    const [isLoading, setLoading] = useState(true);
    const [isCityInfoAvailable, setIsCityInfoAvailable] = useState(true);

    useEffect(() => {
        findLatitudeAndLongitude();
    }, [])

    const findLatitudeAndLongitude = async () => {
        let city = props.city;
        console.log("city" , city)

        try {
            //https://api.api-ninjas.com/v1/city?name= api koji sam prvobitno koristila ali sada ne radi
            const response = await fetch('https://api.api-ninjas.com/v1/geocoding?city=' + city,
                {
                    method: 'GET',
                    headers: new Headers({
                        'X-Api-Key': 'QK0Zkj80k08N06s9p6Y4o5259UZlKqxW4GQ6rZ8V',
                        'Content-Type': 'application/json'
                    })
                });
            const json = await response.json();
            console.log(json, "   json")
            if (json.length > 0) {
                setLatitude(json[0].latitude);
                setLongitude(json[0].longitude);
                // console.log("long " , longitude, " lat " , latitude)
                setIsCityInfoAvailable(true);
            } else {
                setIsCityInfoAvailable(false);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            {isLoading ? (
                <ActivityIndicator />
            ) : (
                isCityInfoAvailable ? (
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        region={{
                            latitude: latitude,
                            longitude: longitude,
                            latitudeDelta: 0.015,
                            longitudeDelta: 0.0121,
                        }}
                    >
                    </MapView>) : (<View />)
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 400,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 50,

    },
    map: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
    },
});

export default Map;
