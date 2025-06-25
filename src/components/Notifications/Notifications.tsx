import React from 'react';
import {useNotification} from '@/context/Notifications/NotificationsContext';

const Notification = () => {
    const {notification, hideNotification} = useNotification();

    if (!notification.show) return null;

    // Define pastel background colors and text colors based on notification type
    const bgColorMap = {
        success: 'bg-green-100',
        error: 'bg-red-100',
        warning: 'bg-yellow-100',
        info: 'bg-blue-100'
    };

    const textColorMap = {
        success: 'text-green-800',
        error: 'text-red-800',
        warning: 'text-yellow-800',
        info: 'text-blue-800'
    };

    return (
        <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60]">
            <div
                className={`${bgColorMap[notification.type]} ${textColorMap[notification.type]} px-6 py-4 rounded-lg shadow-lg max-w-md border border-${notification.type === 'success' ? 'green' : notification.type === 'error' ? 'red' : notification.type === 'warning' ? 'yellow' : 'blue'}-200`}
            >
                <div className="flex justify-between items-center">
                    <p className="font-medium">{notification.message}</p>
                    <button
                        onClick={hideNotification}
                        className={`ml-4 focus:outline-none ${textColorMap[notification.type]} hover:opacity-70 font-bold`}
                    >
                        ×
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Notification;