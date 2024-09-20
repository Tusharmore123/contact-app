import {configureStore} from '@reduxjs/toolkit';
import reducerSlice from './reducerSlice.js';
const store=configureStore({
    reducer:{
        auth:reducerSlice
    }
})
export {store}