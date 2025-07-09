import { Text } from '@chakra-ui/react';
import { Layout as PrivateLayoutProps } from '@interfaces/layout';
import Sidebar from 'components/layout/sidebar';

export function PrivateLayout({ children }: PrivateLayoutProps) {
  const logo = (
    <Text fontSize="xl" fontWeight="bold" color="white">
      TFI Admin
    </Text>
  );

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar logo={logo} />
      <div style={{ marginLeft: '280px', width: '100%' }}>
        <div style={{ padding: '1rem' }}>
          <div style={{ width: '100%' }}>{children}</div>
        </div>
      </div>
    </div>
  );
}
