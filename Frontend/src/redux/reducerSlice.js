import { createSlice } from '@reduxjs/toolkit';


const initialValue = {
    signIn: false,
    userData: null,
    contacts: [],
    filtered_contacts: [],
    verifyOtp: false
}
const reducerSlice = createSlice({
    name: 'auth',
    initialState: initialValue,
    reducers: {
        login: (state, action) => {
            state.signIn = true
            state.userData = action.payload

        },
        logout: (state, action) => {
            state.signIn = false
            state.userData = null
            state.contacts = []
            state.filtered_contacts = []
        },
        getContacts: (state, action) => {
            state.contacts = action.payload
        },
        validateOtp: (state, action) => {
            state.verifyOtp = true
        },
        resetOtp: (state, action) => {
            state.verifyOtp = false
        },
        filteredContacts: (state, action) => {
            const searchString = action.payload.toLowerCase();
            state.filtered_contacts = searchString ? state.contacts.filter((contact) =>
            (contact.contact_name.toLowerCase().includes(searchString)
                || contact.contact_email.toLowerCase().includes(searchString)
                || contact.contact_phone.toLowerCase().includes(searchString)
            )
            )
                : state.contacts // Reset to full list when search is cleared

        }
    }
})
export default reducerSlice.reducer;

export const { login, logout, getContacts, validateOtp, resetOtp, filteredContacts } = reducerSlice.actions;