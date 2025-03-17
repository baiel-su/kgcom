import fetchcUserProfileAction from '@/app/(pages)/user-profile/user-profile-server';
import { useEffect, useState } from 'react';

interface curUserProfile {
    id: string;
    full_name: string;
    email: string;
    // Add other fields as needed
}

interface UseFetchcurUserResult {
    curUser: curUserProfile | null;
    loading: boolean;
    error: string | null;
}

export const useFetchcurUser = (curUserId: string): UseFetchcurUserResult => {
    const [curUser, setcurUser] = useState<curUserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchcurUser = async () => {
            setLoading(true);
            setError(null);

            try {
                const curUserData = await fetchcUserProfileAction();
                setcurUser(curUserData);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch curUser profile');
            } finally {
                setLoading(false);
            }
        };

        if (curUserId) {
            fetchcurUser();
        }
    }, [curUserId]);

    return { curUser, loading, error };
};