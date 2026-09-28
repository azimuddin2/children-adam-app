import { Ionicons } from '@expo/vector-icons';

export type ProfileMenuItem = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route?: string;
  variant?: 'default' | 'danger';
};

export const PROFILE_MENU_ITEMS: ProfileMenuItem[] = [
  {
    id: 'poll',
    icon: 'bar-chart-outline',
    label: 'Ummah Poll',
    route: '/poll',
  },
  {
    id: 'edit-profile',
    icon: 'person-outline',
    label: 'Edit Profile',
    route: '/edit-profile',
  },
  {
    id: 'settings',
    icon: 'settings-outline',
    label: 'Settings',
    route: '/settings',
  },
  // Notification আলাদা handle হবে (toggle থাকায়)
  {
    id: 'contact',
    icon: 'document-text-outline',
    label: 'Contact Us',
    route: '/contact',
  },
  {
    id: 'about',
    icon: 'information-circle-outline',
    label: 'About Us',
    route: '/about',
  },
  {
    id: 'privacy',
    icon: 'shield-checkmark-outline',
    label: 'Privacy Policy',
    route: '/privacy-policy',
  },
  {
    id: 'terms',
    icon: 'document-outline',
    label: 'Terms of Services',
    route: '/terms',
  },
];
