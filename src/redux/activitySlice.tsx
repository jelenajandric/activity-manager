import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Activity } from '../model/Activity';

export type ActivityState = {
    activities: Activity[],
    activityId: number,
    dates: {},
    notificationTimeMinutes: number,
}

const initialState: ActivityState = {
    activities: [],
    activityId: 1,
    dates: {},
    notificationTimeMinutes: 24 * 60,

}

export const activitySlice = createSlice({
    name: 'activityReducer',
    initialState,
    reducers: {
        setActivities: (state, action: PayloadAction<Activity[]>) => {
            state.activities = action.payload;
        },
        setActivityId: (state, action: PayloadAction<number>) => {
            state.activityId = action.payload;
        },
        setDates: (state, action: PayloadAction<any>) => {
            let acts = action.payload;
            let arrayDates = [...new Set(acts.map((item: Activity) => {
                let day = item.datetime.split('/')[0];
                let mounth = item.datetime.split('/')[1];
                let year = item.datetime.split('/')[2].slice(0, 4);
                let dateISO = year + '-' + mounth + '-' + day;
                return dateISO;
            }))];
            let datesToBeMarked: any = {}
            arrayDates.forEach((item: any) => {
                datesToBeMarked[item] = { selected: true, selectedColor: '#D27D2D', };
            });
            state.dates = datesToBeMarked;
        },
        setNotificationTimeMinutes: (state, action: PayloadAction<number>) => {
            state.notificationTimeMinutes = action.payload;
        }
    }
})

export const { setActivities, setActivityId, setDates, setNotificationTimeMinutes } = activitySlice.actions;
export const selectActivities = (state: RootState) => state.activityReducer.activities;
export const selectActivityId = (state: RootState) => state.activityReducer.activityId;
export const selectDates = (state: RootState) => state.activityReducer.dates;
export const selectNotificationTimeMinutes = (state: RootState) => state.activityReducer.notificationTimeMinutes;

export default activitySlice.reducer;