import countries from '@/app/mock_data/countries';

export const mapCountryCode = (code: string) => {
    return countries.find((country) => country.code === code)?.label;
}