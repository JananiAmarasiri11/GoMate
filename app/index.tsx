import { RootState } from '@/store';
import { Redirect } from 'expo-router';
import { useSelector } from 'react-redux';

export default function Index() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}