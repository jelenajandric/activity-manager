import React, { useState, useEffect } from 'react';
import {
    View,
    Image,
    PermissionsAndroid,
    StyleSheet,
    TextInput,
    Text,
    TouchableOpacity,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
    launchImageLibrary, launchCamera,
    ImageLibraryOptions, CameraOptions
}
    from 'react-native-image-picker';
import * as ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackScreenProps } from '../../types';
import CustomButton from '../../utils/CustomButton';
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectActivityId, setActivityId } from '../../redux/activitySlice';
import IconButton from '../../utils/IconButton';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


export default function AddImage({ navigation, route }: RootStackScreenProps<'AddImage'>) {

    const [remotePath, setRemotePath] = useState('');
    const [images, setImages] = useState<string[]>([]);

    const activityId: number = useAppSelector(selectActivityId);

    const dispatch = useAppDispatch();

    const addImage = (newImage: string) => {
        let newImages: string[] = [];
        if (images.length != 0) {
            newImages = [...images, newImage];
        } else {
            newImages = [newImage];
        }
        setImages(newImages);
    }

    const removeImage = (imageToDelete: string) => {
        const filteredImages = images.filter(image => image !== imageToDelete);
        setImages(filteredImages);
    }

    const saveAll = () => {
        AsyncStorage.setItem(route.params.id.toString(), JSON.stringify(images)).then(() => {
            let num: number = 1;
            let newId: number = activityId + num;
            AsyncStorage.setItem("activityId", newId.toString())
                .then(() => {
                    dispatch(setActivityId(newId));
                })
        })
        navigation.navigate('HomeScreen', {
            screen: 'Review'
        });

    }

    const openImagePicker = () => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
        };

        launchImageLibrary(options, (response: any) => {
            if (response.didCancel) {
                // console.log('User cancelled image picker');
            } else if (response.error) {
                // console.log('Image picker error: ', response.error);
            } else {
                let imageUri = response.uri || response.assets?.[0]?.uri;
                addImage(imageUri);
            }
        });
    };

    const handleCameraLaunch = () => {
        const options: CameraOptions = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
        };

        launchCamera(options, (response: any) => {
            // console.log('Response = ', response);
            if (response.didCancel) {
                // console.log('User cancelled camera');
            } else if (response.error) {
                // console.log('Camera Error: ', response.error);
            } else {
                let imageUri = response.uri || response.assets?.[0]?.uri;
                addImage(imageUri);
            }
        });
    }

    const addPhotoFromRemoteLocation = () => {
        addImage(remotePath);
    }

    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "Dozvola za upotrebu kamere",
                    message: "Aplikacija želi da pristupi kameri",
                    buttonNeutral: "Pitaj me kasnije",
                    buttonNegative: "Ne dozvoli",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                handleCameraLaunch();
            }
        } catch (err) {
            // console.warn(err);
        }
    };

    return (
        <View style={styles.body}>
            <ScrollView>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={styles.text}>
                        Direktno uslikajte slike, učitajte iz galerije ili ostavite link do slike sa udaljene lokacije.
                    </Text>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: "space-evenly", flexDirection: 'row', flexWrap: 'wrap', }}>
                        <View style={{ flex: 1, alignItems: 'center', }}>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: '#6e754b' }]}
                                onPress={openImagePicker}
                            >
                                <FontAwesome5
                                    name='file-image'
                                    size={50}
                                    color={'#fff'}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center', }}>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: '#6e754b', }]}
                                onPress={requestCameraPermission}
                            >
                                <FontAwesome5
                                    name='camera'
                                    size={50}
                                    color={'#fff'}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TextInput
                        value={remotePath}
                        style={styles.input}
                        placeholder="Putanja do slike sa udaljene lokacije"
                        placeholderTextColor="#4C4E52"
                        onChangeText={(value) => setRemotePath(value)}
                    />
                    <View style={{ flex: 1, alignItems: 'center', marginBottom: 50, }}>
                        <CustomButton
                            title='Dodaj'
                            onPressFunction={addPhotoFromRemoteLocation}
                            color='#6e754b'
                            style={styles.custom_button}
                            text_style={styles.custom_text}
                        />
                    </View>
                </View>

                {images?.map(img => {
                    if (img) {
                        return (
                            <View key={img} style={styles.images_container}>
                                <Image
                                    source={{ uri: img }}
                                    style={{ width: 300, height: 300 }}
                                    resizeMode='contain'
                                />
                                <View style={styles.delete_button}>
                                    <CustomButton
                                        title='Obriši'
                                        onPressFunction={() => { removeImage(img) }}
                                        color='#ff0000'
                                        style={styles.custom_button}
                                        text_style={styles.custom_text}
                                    />
                                </View>
                            </View>
                        )
                    }
                })}
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <CustomButton
                        title="Sačuvaj"
                        color='#1eb900'
                        onPressFunction={saveAll}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        justifyContent: 'center',
    },
    input: {
        width: '95%',
        borderWidth: 1,
        borderColor: '#555555',
        borderRadius: 10,
        backgroundColor: '#ffffff',
        color: '#000',
        textAlign: 'left',
        fontSize: 18,
        margin: 10,
        paddingHorizontal: 10,
    },
    delete_button: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 50,
        width: '30%'
    },
    images_container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',

    },
    custom_button: {
        height: 40,
        width: 80,
        fontSize: 15,
        color: '#000',
    },
    custom_text: {
        fontSize: 15,
    },
    open_button: {
        width: 185,
    },
    text: {
        fontSize: 18,
        textAlign: 'center',
        margin: 10,
        color:'#000'
    },
    button: {
        width: 80,
        height: 80,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    }
})