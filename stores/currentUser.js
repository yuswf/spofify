import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    // token: typeof window !== 'undefined' ? window.sessionStorage.getItem('token') || '' : '',
    currentUser: {},
};

export const currentUserSlice = createSlice({
    name: 'currentUser',
    initialState,
    reducers: {
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        },
    },
});

export const {setCurrentUser} = currentUserSlice.actions;
export default currentUserSlice.reducer;
