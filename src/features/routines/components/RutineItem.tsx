import React from 'react';
import { useRouter } from 'expo-router';
import { TouchableOpacity, Image, Text, StyleSheet, View } from 'react-native';
import { RoutineItemProps, RutinePropsWithChildren } from '@/core/types/types';
import { useAuthentication } from '@/features/auth/context/AuthenticationContext';
import { useModalContext } from '@/features/auth/context/userModalDisplayContext';
import theme from '@/core/theme/theme';

const RutineItem: React.FC<RoutineItemProps & RutinePropsWithChildren> = ({ routine, SessionRequired }) => {
  const { session } = useAuthentication();
  const { open } = useModalContext();
  const router = useRouter();

  const handlePress = () => {
    if (SessionRequired && !session) {
      open();
    } else {
      router.push({ pathname: '/Rutina', params: { title: routine.title } });
    }
  };

  return (
    <TouchableOpacity style={styles.routineItem} onPress={handlePress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image source={routine.image} style={styles.routineImage} />
      </View>
      <Text style={styles.routineText}>{routine.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  routineItem: {
    width: '45%',
    aspectRatio: 0.9,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 10,
    ...theme.shadow.sm,
  },
  imageContainer: {
    width: '70%',
    aspectRatio: 1,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  routineImage: {
    width: '70%',
    height: '70%',
    resizeMode: 'contain',
  },
  routineText: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
    color: theme.colors.textDark,
    textAlign: 'center',
  },
});

export default RutineItem;
