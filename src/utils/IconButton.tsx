import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const IconButton = (props: any) => {
    
    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: props.backColor }]}
            onPress={props.onPressFunction}
        >
            <FontAwesome5
                name={props.iconName}
                size={20}
                color={'#ffffff'}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 10,
        right: 10,
        elevation: 5,
        marginTop: 50,
    }
})

export default IconButton;