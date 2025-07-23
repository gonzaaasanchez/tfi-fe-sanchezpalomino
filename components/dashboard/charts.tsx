import React from 'react';
import { Card, CardBody, Heading, SimpleGrid } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
// @ts-ignore
import * as Recharts from 'recharts';

// Datos mock para los gráficos
const petTypesData = [
  { name: 'Perros', value: 45, color: '#3182CE' },
  { name: 'Gatos', value: 35, color: '#E53E3E' },
  { name: 'Peces', value: 18, color: '#38A169' },
  { name: 'Otros', value: 2, color: '#DD6B20' }
];

const newUsersData = [
  { month: 'Ene', users: 120 },
  { month: 'Feb', users: 150 },
  { month: 'Mar', users: 180 },
  { month: 'Abr', users: 200 },
  { month: 'May', users: 220 },
  { month: 'Jun', users: 250 },
  { month: 'Jul', users: 280 },
  { month: 'Ago', users: 300 },
  { month: 'Sep', users: 320 },
  { month: 'Oct', users: 350 },
  { month: 'Nov', users: 380 },
  { month: 'Dic', users: 400 }
];

const reservationsData = [
  { month: 'Ene', reservations: 85 },
  { month: 'Feb', reservations: 92 },
  { month: 'Mar', reservations: 105 },
  { month: 'Abr', reservations: 120 },
  { month: 'May', reservations: 135 },
  { month: 'Jun', reservations: 150 },
  { month: 'Jul', reservations: 165 },
  { month: 'Ago', reservations: 180 },
  { month: 'Sep', reservations: 195 },
  { month: 'Oct', reservations: 210 },
  { month: 'Nov', reservations: 225 },
  { month: 'Dic', reservations: 240 }
];

const revenueData = [
  { category: 'Grooming', revenue: 45000, color: '#3182CE' },
  { category: 'Veterinary', revenue: 75000, color: '#E53E3E' },
  { category: 'Training', revenue: 35000, color: '#38A169' },
  { category: 'Boarding', revenue: 60000, color: '#805AD5' },
  { category: 'Products', revenue: 25000, color: '#DD6B20' }
];

const Charts: React.FC = () => {
  const t = useTranslations('pages.dashboard.index.charts');
  const ResponsiveContainer = Recharts.ResponsiveContainer as any;
  const PieChart = Recharts.PieChart as any;
  const Pie = Recharts.Pie as any;
  const Cell = Recharts.Cell as any;
  const Tooltip = Recharts.Tooltip as any;
  const BarChart = Recharts.BarChart as any;
  const Bar = Recharts.Bar as any;
  const XAxis = Recharts.XAxis as any;
  const YAxis = Recharts.YAxis as any;
  const CartesianGrid = Recharts.CartesianGrid as any;
  const Legend = Recharts.Legend as any;
  const LineChart = Recharts.LineChart as any;
  const Line = Recharts.Line as any;
  const AreaChart = Recharts.AreaChart as any;
  const Area = Recharts.Area as any;

  return (
    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
      {/* Gráfico 1: Tipos de mascotas (Torta) */}
      <Card>
        <CardBody>
          <Heading size="sm" mb={4} textAlign="center">
            {t('petTypes.title')}
          </Heading>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={petTypesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {petTypesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Gráfico 2: Nuevos usuarios por mes (Barras) */}
      <Card>
        <CardBody>
          <Heading size="sm" mb={4} textAlign="center">
            {t('newUsers.title')}
          </Heading>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={newUsersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#3182CE" />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Gráfico 3: Reservas por mes (Líneas) */}
      <Card>
        <CardBody>
          <Heading size="sm" mb={4} textAlign="center">
            {t('reservations.title')}
          </Heading>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reservationsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="reservations" 
                stroke="#E53E3E" 
                strokeWidth={2}
                dot={{ fill: '#E53E3E', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Gráfico 4: Ingresos por categoría (Área) */}
      <Card>
        <CardBody>
          <Heading size="sm" mb={4} textAlign="center">
            {t('revenue.title')}
          </Heading>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, t('revenue.tooltip')]} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stackId="1"
                stroke="#38A169" 
                fill="#38A169" 
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
    </SimpleGrid>
  );
};

export default Charts; 