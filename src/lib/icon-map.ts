import {
  IconTruck,
  IconRefresh,
  IconShieldCheck,
  IconCreditCard,
  IconTruckDelivery,
  IconHeadset,
  IconBox,
  IconHeart,
  IconStar,
  IconClock,
  IconGift,
  IconLock,
  IconThumbUp,
  IconAward,
  IconPackage,
  IconCash,
  IconDiscount2,
  IconArrowBack,
  IconWorld,
  IconCheck,
} from '@tabler/icons-react';

const iconMap: Record<string, React.ComponentType<any>> = {
  IconTruck,
  IconRefresh,
  IconShieldCheck,
  IconCreditCard,
  IconTruckDelivery,
  IconHeadset,
  IconBox,
  IconHeart,
  IconStar,
  IconClock,
  IconGift,
  IconLock,
  IconThumbUp,
  IconAward,
  IconPackage,
  IconCash,
  IconDiscount2,
  IconArrowBack,
  IconWorld,
  IconCheck,
};

export function getIcon(name: string): React.ComponentType<any> | null {
  return iconMap[name] || null;
}

export const availableIcons = Object.keys(iconMap);
