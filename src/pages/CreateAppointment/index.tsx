import React, { useCallback, useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Platform } from 'react-native'

import { useAuth } from '../../hooks/auth';
import {
  Container,
  Header,
  HeaderTitle,
  BackButton,
  UserAvatar,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Calendar,
  Title,
} from './styles'
import api from '../../services/api'

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

interface RouteParams {
  providerId: string;
}

const CreateAppointment: React.FC = () => {

  const { user } = useAuth();
  const route = useRoute();
  const { goBack } = useNavigation();
  const routeParams = route.params as RouteParams;

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(routeParams.providerId)

  useEffect(() => {
    api.get('providers').then(response => {
      setProviders(response.data)
    });
  }, [])

  const navigateBack = useCallback(() => {
    goBack();
  }, [])

  const handleSelectProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId)
  }, [])

  const handleToggleDatePicker = useCallback(() => {
    //setShowDatePicker(!showDatePicker)
    setShowDatePicker((state) => !state)
  }, [])

  const handleDateChanged = useCallback((event: any, date: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false)
    }

    if (date) {
      setSelectedDate(date);
    }

  }, [])

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabeleireos</HeaderTitle>

        {user.avatar_url && (
          <UserAvatar source={{ uri: user.avatar_url }} />
        )}

      </Header>

      {providers && (
      <ProvidersListContainer>
        <ProvidersList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={providers}
          keyExtractor={provider => provider.id}
          renderItem={({ item: provider }) => (
            <ProviderContainer
              onPress={() => handleSelectProvider(provider.id)}
              selected={provider.id === selectedProvider}
            >
              {provider.avatar_url && (
                <ProviderAvatar source={{ uri: provider.avatar_url }} />
              )}
              <ProviderName selected={provider.id === selectedProvider}>{provider.name}</ProviderName>
            </ProviderContainer>
          )}
        />
      </ProvidersListContainer>
      )}

      <Calendar>
        <Title>Escolha a data</Title>

        <OpenDatePickerButton onPress={handleToggleDatePicker}>
          <OpenDatePickerButtonText>Selecionar outra data</OpenDatePickerButtonText>
        </OpenDatePickerButton>

        {showDatePicker && (
          <DateTimePicker
            mode="date"
            display="calendar"
            textColor="#f4ede8"
            onChange={handleDateChanged}
            value={selectedDate}
          />
        )}

      </Calendar>

    </Container>
  )
}

export default CreateAppointment;
