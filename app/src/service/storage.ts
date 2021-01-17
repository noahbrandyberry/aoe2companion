import {DarkMode} from "../redux/reducer";
import {LeaderboardId} from "../helper/leaderboards";
import store from "../redux/store";
import {v4 as uuidv4} from "uuid";
import {Flag} from '@nex/data';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface IConfig {
    darkMode: DarkMode;
    pushNotificationsEnabled: boolean;
    preventScreenLockOnGuidePage: boolean;
}

export interface IPrefs {
    country?: Flag;
    leaderboardId?: LeaderboardId;
    changelogLastVersionRead?: string;
    techTreeSize?: string;
    ratingHistoryDuration?: string;
}

export interface ISettings {
    id: string;
    steam_id?: string;
    profile_id?: number;
}

export interface IAccount {
    id: string;
}

export interface IFollowingEntry {
    id?: string;
    steam_id?: string;
    profile_id: number;
    name: string;
    games: number;
    country: Flag;
}

export const loadPrefsFromStorage = async () => {
    const entry = await AsyncStorage.getItem('prefs');
    if (entry == null) {
        return {

        };
    }
    return JSON.parse(entry) as IPrefs;
};

export const saveCurrentPrefsToStorage = async () => {
    const prefs = store.getState().prefs;
    await AsyncStorage.setItem('prefs', JSON.stringify(prefs));
};

export const loadConfigFromStorage = async () => {
    const entryJson = await AsyncStorage.getItem('config');
    const entry = (entryJson ? JSON.parse(entryJson) : {}) as IConfig;
    entry.darkMode = entry.darkMode ?? 'system';
    entry.preventScreenLockOnGuidePage = entry.preventScreenLockOnGuidePage ?? true;
    entry.pushNotificationsEnabled = entry.pushNotificationsEnabled ?? false;
    return entry;
};

export const saveConfigToStorage = async (config: IConfig) => {
    await AsyncStorage.setItem('config', JSON.stringify(config));
};

export const loadSettingsFromStorage = async () => {
    const entry = await AsyncStorage.getItem('settings');
    if (entry == null) {
        return null;
    }
    return JSON.parse(entry) as ISettings;
};

export const saveAccountToStorage = async (account: IAccount) => {
    await AsyncStorage.setItem('account', JSON.stringify(account));
};

export const loadAccountFromStorage = async () => {
    const entry = await AsyncStorage.getItem('account');
    if (entry == null) {
        const newAccountId = uuidv4();
        await saveAccountToStorage({ id: newAccountId });
        return {
            id: newAccountId,
        };
    }
    return JSON.parse(entry) as IAccount;
};

export const saveSettingsToStorage = async (settings: ISettings) => {
    await AsyncStorage.setItem('settings', JSON.stringify(settings));
};


export const loadFollowingFromStorage = async () => {
    const entry = await AsyncStorage.getItem('following');
    if (entry == null) {
        return [];
    }
    return JSON.parse(entry) as IFollowingEntry[];
};

export const saveFollowingToStorage = async (following: IFollowingEntry[]) => {
    await AsyncStorage.setItem('following', JSON.stringify(following));
};
