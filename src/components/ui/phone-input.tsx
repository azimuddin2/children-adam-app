import { Ionicons } from '@expo/vector-icons';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode,
} from 'libphonenumber-js';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

countries.registerLocale(enLocale);

type PhoneInputProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
};

const DEFAULT_COUNTRY: CountryCode = 'BD';

const countryCodeToFlag = (code: string) =>
  code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));

const getCountryName = (code: string) => countries.getName(code, 'en') || code;

const ALL_COUNTRIES = getCountries();

export default function PhoneInput({
  value,
  onChange,
  onBlur,
  placeholder = 'Enter your phone number',
}: PhoneInputProps) {
  const [countryCode, setCountryCode] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [nationalNumber, setNationalNumber] = useState('');
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');
  const isInternalChange = useRef(false);

  const callingCode = getCountryCallingCode(countryCode);

  useEffect(() => {
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }

    if (!value) {
      setNationalNumber('');
      return;
    }
    const parsed = parsePhoneNumberFromString(value);
    if (parsed?.country) {
      setCountryCode(parsed.country);
      setNationalNumber(parsed.nationalNumber);
    } else {
      setNationalNumber(value.replace(/^\+?\d{1,3}/, ''));
    }
  }, [value]);

  const emitCombinedValue = (code: CountryCode, national: string) => {
    isInternalChange.current = true;
    if (!national) {
      onChange('');
      return;
    }
    onChange(`+${getCountryCallingCode(code)}${national}`);
  };

  const handleSelectCountry = (code: CountryCode) => {
    setCountryCode(code);
    setVisible(false);
    setSearch('');
    emitCombinedValue(code, nationalNumber);
  };

  const handleChangeNumber = (text: string) => {
    const digitsOnly = text.replace(/[^0-9]/g, '');
    setNationalNumber(digitsOnly);
    emitCombinedValue(countryCode, digitsOnly);
  };

  const formatter = new AsYouType(countryCode);
  const displayValue = nationalNumber ? formatter.input(nationalNumber) : '';

  const filteredCountries = useMemo(() => {
    if (!search) return ALL_COUNTRIES;
    const query = search.toLowerCase();
    return ALL_COUNTRIES.filter((code) => {
      const name = getCountryName(code).toLowerCase();
      return name.includes(query) || code.toLowerCase().includes(query);
    });
  }, [search]);

  return (
    <View className="flex-row items-center rounded-xl border border-gray-200 bg-white">
      <TouchableOpacity
        onPress={() => setVisible(true)}
        className="flex-row items-center border-r border-gray-200 px-3 py-4"
      >
        <Text className="text-base">{countryCodeToFlag(countryCode)}</Text>
        <Text className="ml-1 text-sm text-gray-900">+{callingCode}</Text>
        <Ionicons
          name="chevron-down"
          size={16}
          color="#6B7280"
          style={{ marginLeft: 4 }}
        />
      </TouchableOpacity>

      <TextInput
        value={displayValue}
        onChangeText={handleChangeNumber}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        keyboardType="phone-pad"
        className="flex-1 px-4 py-4 text-sm text-gray-900"
      />

      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View className="flex-1 bg-white pt-14 px-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold">Select Country</Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Ionicons
                name="close"
                size={20}
                color="#111827"
                className="bg-gray-200 rounded-full p-1"
              />
            </TouchableOpacity>
          </View>

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search country"
            placeholderTextColor="#9CA3AF"
            className="rounded-xl border border-gray-200 px-4 py-3 mb-3 text-sm"
          />

          <FlatList
            data={filteredCountries}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelectCountry(item)}
                className="flex-row items-center py-3 border-b border-gray-100"
              >
                <Text className="text-lg mr-3">{countryCodeToFlag(item)}</Text>
                <Text className="flex-1 text-sm text-gray-900">
                  {getCountryName(item)}
                </Text>
                <Text className="text-sm text-gray-500">
                  +{getCountryCallingCode(item)}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}
