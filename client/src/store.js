import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import setAuthToken from './utils/setAuthToken';

const initialState = {};

const middleWare = [thunk];

const store = createStore(
    rootReducer, 
    initialState, 
    composeWithDevTools(applyMiddleware(...middleWare)
));

let currState = {
    auth: {
        token: null,
        isAuthenticated: null,
        loading: true,
        user: null
    }
};

store.subscribe(() => {
    // keep track of prev and curr state to compare
    let prevState = currState;
    currState = store.getState();

    // update token value in local storage if it changes
    if (prevState && prevState.auth.token !== currState.auth.token) {
        const token = currState.auth.token;
        setAuthToken(token);
    }
});

export default store;