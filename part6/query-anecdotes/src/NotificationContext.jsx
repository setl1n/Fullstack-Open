import { createContext, useReducer } from 'react'
import PropTypes from 'prop-types';

const notificationReducer = (state, action) => {
    switch (action.type) {
        case "SET":
            return action.payload
        case "CLEAR":
            return null
        default:
            return state
    }
}

const NotificationContext = createContext()

export const NotificatioNContextProvider = (props) => {
    NotificatioNContextProvider.propTypes = {
        children: PropTypes.any
    }
    const [notification, notificationDispatch] = useReducer(notificationReducer, null)

    return (
        <NotificationContext.Provider value={[notification, notificationDispatch]}>
            {props.children}
        </NotificationContext.Provider>
    )
}

export default NotificationContext