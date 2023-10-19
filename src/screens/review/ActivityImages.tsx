import React, { useState, useEffect } from "react";
import { Image, StyleSheet, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from "react-native-gesture-handler";


const ActivityImages = (props: any) => {

    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        prepareImages();
    }, [])

    const prepareImages = () => {
        let id = props.id;
        AsyncStorage.getItem(id.toString())
            .then((imagesFromStorage: any) => {
                const parsed: string[] | any = JSON.parse(imagesFromStorage);
                if (parsed != null && parsed != undefined) {
                    setImages(parsed);
                }
            })

        }

    return (
        <View>
            <ScrollView>
                {images?.map(img => {
                    if (img) {
                        return (
                            <View key={img} style={styles.images_container}>
                                <Image
                                    source={{ uri: img }}
                                    style={{ width: 400, height: 400 }}
                                    resizeMode='contain'
                                />
                            </View>
                        )
                    }
                })}
            </ScrollView>
        </View>
    );


}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        justifyContent: 'center',
    },
    images_container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        marginTop: 30,
        marginBottom: 10,
    },

});

export default ActivityImages;