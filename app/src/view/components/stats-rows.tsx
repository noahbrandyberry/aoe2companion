import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Image} from 'expo-image';
import React from 'react';
import {TextLoader} from "./loader/text-loader";
import {Civ, getCivIdByEnum, LeaderboardId} from "@nex/data";
import {useNavigation} from "@react-navigation/native";
import {RootStackProp} from "../../../App2";
import {MyText} from "./my-text";
import Space from "./space";
import {getCivIcon} from "../../helper/civs";
import {createStylesheet} from '../../theming-new';
import {getTranslation} from '../../helper/translate';
import {getMapImage} from "../../helper/maps";
import {CountryImage} from "./country-image";
import {appConfig} from "@nex/dataset";
import {IStatAlly, IStatCiv, IStatMap, IStatOpponent} from "../../api/helper/api.types";


interface IRowPropsCiv {
    data: IStatCiv;
    type: 'civ';
}

interface IRowPropsMap {
    data: IStatMap;
    type: 'map';
}

interface IRowPropsAlly {
    data: IStatAlly;
    type: 'ally';
}

interface IRowPropsOpponent {
    data: IStatOpponent;
    type: 'opponent';
}

function Row({type, data}: IRowPropsCiv | IRowPropsMap | IRowPropsAlly | IRowPropsOpponent) {
    const styles = useStyles();
    const navigation = useNavigation<RootStackProp>();

    const gotoEntity = () => {
        if (type === 'civ') {
            navigation.push('Civ', { civ: getCivIdByEnum(data.civ) });
        }
        if ((type === 'ally' || type === 'opponent') && data.profileId) {
            navigation.push('User', {
                profileId: data.profileId,
            });
        }
    };

    const getIcon = () => {
        if (type === 'civ') {
            return getCivIcon(data);
        }
        if (type === 'map') {
            return getMapImage(data);
        }
    };

    const getName = () => {
        if (type === 'civ') {
            return data.civName;
        }
        if (type === 'map') {
            return data.mapName;
        }
        if ((type === 'ally' || type === 'opponent') && data.profileId) {
            return data.name;
        }
    };

    const won = data.wins / data.games * 100;

    return (
            <View style={styles.row}>
                <TouchableOpacity style={styles.cellLeaderboard} onPress={gotoEntity}>
                    <View style={styles.row}>
                        {
                            (type === 'ally' || type === 'opponent') &&
                            <CountryImage country={data.country} />
                        }
                        {
                            (type === 'civ') &&
                            <Image fadeDuration={0} style={styles.civIcon} source={getIcon()}/>
                        }
                        {
                            (type === 'map') &&
                            <Image fadeDuration={0} style={styles.icon} source={getIcon()}/>
                        }
                        <MyText>{getName()}</MyText>
                    </View>
                </TouchableOpacity>
                <MyText style={styles.cellGames}>
                    {data.games}
                </MyText>
                <MyText style={styles.cellWon}>
                    {isNaN(won) ? '-' : won.toFixed(0) + ' %'}
                </MyText>
            </View>
    )
}


interface IProps {
    type: 'civ' | 'map' | 'ally' | 'opponent';
    title: string;
    leaderboardId?: LeaderboardId;
    data?: IStatCiv[] | IStatMap[] | IStatAlly[] | IStatOpponent[];
}

export default function StatsRows(props: IProps) {
    const styles = useStyles();

    const { type, data, title } = props;

    if (data?.length === 0) {
        return <View/>;
    }

    return (
            <View style={styles.container}>
                <Space/>
                <View style={styles.row}>
                    <MyText numberOfLines={1} style={styles.cellLeaderboard}>{title}</MyText>
                    <MyText numberOfLines={1} style={styles.cellGames}>{getTranslation('main.stats.heading.games')}</MyText>
                    <MyText numberOfLines={1} style={styles.cellWon}>{getTranslation('main.stats.heading.won')}*</MyText>
                </View>

                {
                    data && data.map((row, i) =>
                        <Row key={i} type={type} data={row as any}/>
                    )
                }

                {
                    !data && Array(8).fill(0).map((a, i) =>
                        <View key={i} style={styles.row}>
                            <TextLoader style={styles.cellLeaderboard}/>
                            <TextLoader style={styles.cellGames}/>
                            <TextLoader style={styles.cellWon}/>
                        </View>
                    )
                }

                {/*{*/}
                {/*    hasAgainstCiv &&*/}
                {/*    <Space/>*/}
                {/*}*/}
                {/*{*/}
                {/*    hasAgainstCiv &&*/}
                {/*    <View style={styles.row}>*/}
                {/*        <MyText numberOfLines={1} style={styles.cellLeaderboard}>{getTranslation('main.stats.heading.againstciv')}</MyText>*/}
                {/*        <MyText numberOfLines={1} style={styles.cellGames}>{getTranslation('main.stats.heading.games')}</MyText>*/}
                {/*        <MyText numberOfLines={1} style={styles.cellWon}>{getTranslation('main.stats.heading.won')}*</MyText>*/}
                {/*    </View>*/}
                {/*}*/}

                {/*{*/}
                {/*    hasAgainstCiv && rowsAgainstCiv && rowsAgainstCiv.map(leaderboard =>*/}
                {/*            <Row key={leaderboard.civ.toString()} data={leaderboard}/>*/}
                {/*    )*/}
                {/*}*/}

                {/*{*/}
                {/*    hasAgainstCiv && !rowsAgainstCiv && Array(8).fill(0).map((a, i) =>*/}
                {/*        <View key={i} style={styles.row}>*/}
                {/*            <TextLoader style={styles.cellLeaderboard}/>*/}
                {/*            <TextLoader style={styles.cellGames}/>*/}
                {/*            <TextLoader style={styles.cellWon}/>*/}
                {/*        </View>*/}
                {/*    )*/}
                {/*}*/}
            </View>
    )
}


const padding = 5;

const useStyles = createStylesheet(theme => StyleSheet.create({
    cellLeaderboard: {
        // backgroundColor: 'red',
        margin: padding,
        flex: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cellGames: {
        margin: padding,
        flex: 1,
        textAlign: 'right',
        fontVariant: ['tabular-nums'],
    },
    cellWon: {
        margin: padding,
        flex: 1,
        textAlign: 'right',
        fontVariant: ['tabular-nums'],
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    container: {
        // backgroundColor: 'red',
    },
    civIcon: appConfig.game === 'aoe2de' ? {
        width: 20,
        height: 20,
        marginRight: 5,
    } : {
        width: 36,
        height: 20,
        marginRight: 5,
    },
    icon: appConfig.game === 'aoe2de' ? {
        width: 20,
        height: 20,
        marginRight: 5,
    } : {
        borderColor: '#C19049',
        borderWidth: 1.2,
        width: 20,
        height: 20,
        marginRight: 5,
    },
}));



// interface IRowProps {
//     data: IStatCiv | IStatMap | IStatAlly | IStatOpponent;
//     type: 'civ' | 'map' | 'ally' | 'opponent';
// }

// Stats Position
//
// function Row({data}: IRowProps) {
//     const theme = useAppTheme();
//     const styles = useStyles();
//     return (
//             <View style={styles.row}>
//                 <View style={styles.cellLeaderboard}>
//                     <View style={styles.icon}>
//                         <FontAwesome5 name={data.position == 'flank' ? 'fist-raised' : 'first-aid'} size={14} color={theme.textNoteColor} />
//                     </View>
//                     <MyText>{getPositionName(data.position)}</MyText>
//                 </View>
//                 <MyText style={styles.cellGames}>
//                     {data.games}
//                 </MyText>
//                 <MyText style={styles.cellWon}>
//                     {isNaN(data.won) ? '-' : data.won.toFixed(0) + ' %'}
//                 </MyText>
//             </View>
//     )
// }

// Stats Duration
//
// function Row({data}: IRowProps) {
//     const theme = useAppTheme();
//     const styles = useStyles();
//     let marginLeft = 0;
//     if (data.duration == 'lessThan5Minutes') {
//         marginLeft = 0;
//     }
//     if (data.duration == 'lessThan30Minutes') {
//         marginLeft = 12.0;
//     }
//     if (data.duration == 'lessThan60Minutes') {
//         marginLeft = 3.0;
//     }
//     if (data.duration == 'greaterThan60Minutes') {
//         marginLeft = 21.5;
//     }
//     return (
//             <View style={styles.row}>
//                 <View style={styles.cellLeaderboard}>
//                     <View style={styles.icon}>
//                         <FontAwesome5 name="clock" size={14} color={theme.textNoteColor}/>
//                     </View>
//                     <MyText style={{marginLeft}}>{getTranslation(`main.stats.duration.${data.duration}` as any)}</MyText>
//                 </View>
//                 <MyText style={styles.cellGames}>
//                     {data.games}
//                 </MyText>
//                 <MyText style={styles.cellWon}>
//                     {isNaN(data.won) ? '-' : data.won.toFixed(0) + ' %'}
//                 </MyText>
//             </View>
//     )
// }
