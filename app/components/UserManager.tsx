'use client';

import { useState, useEffect } from 'react';
import UserModal from './UserModal';
import Notification from './Notification';

interface UserInfo {
  username: string;
  email: string;
}

interface NotificationState {
  message: string;
  type: 'success' | 'info';
}

interface UserManagerProps {
  onUserInfoChange: (userInfo: UserInfo | null) => void;
}

export default function UserManager({ onUserInfoChange }: UserManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [notification, setNotification] = useState<NotificationState | null>(null);

  // Check for existing user info on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('qa-dashboard-user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserInfo(parsed);
        onUserInfoChange(parsed);
        
        // Show welcome back notification for returning user
        setNotification({
          message: `Welcome back, ${parsed.username}! We're glad to see you again.`,
          type: 'info',
        });
      } catch (e) {
        // Invalid stored data, show modal
        setShowModal(true);
      }
    } else {
      // No user info, show modal
      setShowModal(true);
    }
  }, [onUserInfoChange]);

  const handleUserSubmit = async (username: string, email: string) => {
    try {
      // First, check if user with this email already exists
      const checkResponse = await fetch('/api/user/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (checkResponse.ok) {
        const checkResult = await checkResponse.json();
        
        if (checkResult.exists) {
          // User already exists, just save to localStorage and continue
          console.log('User already exists with email:', email);
          const newUserInfo = { 
            username: checkResult.user.username || username, 
            email: email 
          };
          localStorage.setItem('qa-dashboard-user', JSON.stringify(newUserInfo));
          setUserInfo(newUserInfo);
          onUserInfoChange(newUserInfo);
          setShowModal(false);
          
          // Show welcome back notification
          setNotification({
            message: `Welcome back, ${newUserInfo.username}! We're glad to see you again.`,
            type: 'info',
          });
          return;
        }
      }

      // User doesn't exist, create new entry
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.details || 'Failed to save user information');
      }

      const result = await response.json();
      
      // Store user info locally
      const newUserInfo = { username, email };
      localStorage.setItem('qa-dashboard-user', JSON.stringify(newUserInfo));
      setUserInfo(newUserInfo);
      onUserInfoChange(newUserInfo);
      
      // Close the modal after successful submission
      setShowModal(false);
      
      // Show welcome notification for new user
      setNotification({
        message: `Welcome to QA Dashboard, ${username}! Your account has been created successfully.`,
        type: 'success',
      });
    } catch (error) {
      console.error('Error saving user info:', error);
      throw error;
    }
  };

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
          duration={6000}
        />
      )}
      <UserModal
        isOpen={showModal}
        onClose={() => {
          // Only allow closing if user info exists
          if (userInfo) {
            setShowModal(false);
          }
        }}
        onUserSubmit={handleUserSubmit}
      />
    </>
  );
}

