import {Image, Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {RootStackParamList} from '../../../App';
import {getRootNavigation} from "../../service/navigation";
import {MyText} from "./my-text";
import {iconHeight, iconWidth} from "@nex/data";
import {setConfig, setInitialState, useMutate, useSelector} from "../../redux/reducer";
import {useTheme} from "../../theming";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import FontAwesomeIcon5 from "react-native-vector-icons/FontAwesome5";
import {appVariants} from "../../styles";
import {clearCache} from "../../redux/cache";
import {IConfig, saveConfigToStorage} from "../../service/storage";
import {reloadAsync} from 'expo-updates';
import {createStylesheet} from '../../theming-new';
import {closeAppWindowAsync, isElectron} from "../../helper/electron";


export default function Header() {
    const appStyles = useTheme(appVariants);
    const styles = useStyles();
    const [checked, setChecked] = useState(false);
    const mutate = useMutate();
    const config = useSelector(state => state.config);
    const state = useSelector(state => state);

    const nav = async (route: keyof RootStackParamList) => {
        const navigation = getRootNavigation();
        navigation.reset({
            index: 0,
            routes: [{name: route}]
        });
    };

    const toggleDarkMode = async () => {
        const newConfig: IConfig = {
            ...config,
            darkMode: config.darkMode === 'light' ? 'dark' : 'light',
        };
        await saveConfigToStorage(newConfig)
        mutate(setConfig(newConfig));
    };

    const resetState = () => {
        clearCache();
        console.clear();
        mutate(setInitialState());
    };

    const restart = async () => {
        await reloadAsync();
    };

    return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image fadeDuration={0} style={styles.icon} source={require('../../../assets/icon.png')}/>
                    <MyText>AoE II Companion</MyText>

                    {/*<Checkbox.Android*/}
                    {/*    status={checked ? 'checked' : 'unchecked'}*/}
                    {/*    onPress={() => {*/}
                    {/*        mutate(setDarkMode(checked ? 'dark' : 'light'));*/}
                    {/*        setChecked(!checked);*/}
                    {/*    }}*/}
                    {/*/>*/}
                    {/*<MyText>Light Mode</MyText>*/}

                    <View style={appStyles.expanded}/>

                    {/*{*/}
                    {/*    Platform.OS === 'web' &&*/}
                    {/*    <MyText>Download App</MyText>*/}
                    {/*}*/}

                    {
                        !__DEV__ && Platform.OS === 'web' &&
                        <TouchableOpacity onPress={() => window.open('https://aoe2companion.com', '_blank')}>
                            <MyText style={appStyles.link}>aoe2companion.com</MyText>
                        </TouchableOpacity>
                    }

                    {
                        __DEV__ &&
                        <MyText>{(JSON.stringify(state).length / 1000).toFixed()} KB</MyText>
                    }
                    {
                        __DEV__ &&
                        <TouchableOpacity onPress={toggleDarkMode}>
                            <FontAwesomeIcon5 style={styles.menuButton} name="lightbulb" color="#666" size={18} />
                        </TouchableOpacity>
                    }
                    {
                        __DEV__ &&
                        <TouchableOpacity onPress={resetState}>
                            <FontAwesomeIcon style={styles.menuButton} name="refresh" color="#666" size={18} />
                        </TouchableOpacity>
                    }
                    {
                        __DEV__ &&
                        <TouchableOpacity onPress={restart}>
                            <FontAwesomeIcon5 style={styles.menuButton} name="power-off" color="#666" size={18} />
                        </TouchableOpacity>
                    }

                    {
                        isElectron() &&
                        <TouchableOpacity onPress={closeAppWindowAsync}>
                            <FontAwesomeIcon5 style={styles.menuButton} name="times" color="#666" size={18} />
                        </TouchableOpacity>
                    }
                </View>
            </View>
    );
}

const useStyles = createStylesheet(theme => StyleSheet.create({
        menu: {
            // backgroundColor: 'red',
            flexDirection: 'row',
            alignItems: 'center',
        },
        menuButton: {
            ...(Platform.OS === 'web' ? {"-webkit-app-region": "no-drag"} : {}),
            // backgroundColor: 'blue',
            margin: 0,
            marginHorizontal: 10,
        },
        menuButtonDots: {
            // backgroundColor: 'blue',
            margin: 0,
            marginLeft: 0,
        },
        header: {
            // backgroundColor: 'blue',
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        icon: {
            marginRight: 5,
            width: iconWidth,
            height: iconHeight,
        },
        container: {
            ...(Platform.OS === 'web' ? {"-webkit-app-region": "drag"} : {}),
            backgroundColor: theme.backgroundColor,
            flexDirection: 'row',
            // marginTop: Constants.statusBarHeight,
            height: 36,
            paddingTop: Platform.OS === 'ios' ? 0 : 6,
            paddingBottom: Platform.OS === 'ios' ? 4 : 0,
            paddingLeft: 16,
            paddingRight: 12, // because of three dots icon
        },
    }
));
