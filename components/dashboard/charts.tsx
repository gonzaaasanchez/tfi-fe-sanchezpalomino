import React from 'react';
import {
  Card,
  CardBody,
  Heading,
  SimpleGrid,
  Box,
  Text,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { useDashboard } from '../../lib/hooks';
// @ts-ignore
import * as Recharts from 'recharts';

const Charts: React.FC = () => {
  const t = useTranslations('pages.dashboard.index.charts');
  const { data, loading, error } = useDashboard();

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
  const Text = Recharts.Text as any;

  if (loading) {
    return (
      <Box
        textAlign="center"
        py={8}
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={4}
      >
        <Spinner
          size="lg"
          color="blue.500"
        />
        <Text
          color="gray.600"
        >
          {t('petTypes.loading')}
        </Text>
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box
        textAlign="center"
        py={8}
      >
        <Text
          color="red.500"
          mb={4}
        >
          {error || t('error.title')}
        </Text>
        <Text color="gray.600">{t('error.message')}</Text>
      </Box>
    );
  }

  return (
    <VStack
      spacing={6}
      align="stretch"
    >
      {/* Primera fila: Gráfico 1 */}
      <Card>
        <CardBody>
          <Heading
            size="sm"
            mb={4}
            textAlign="center"
          >
            {t('reservations.title')}
          </Heading>
          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <LineChart data={data.reservations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="reservations"
                name={t('reservations.legend')}
                stroke="#E53E3E"
                strokeWidth={2}
                dot={{ fill: '#E53E3E', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Segunda fila: Gráfico 2 y 3 juntos */}
      <SimpleGrid
        columns={{ base: 1, lg: 2 }}
        spacing={6}
      >
        {/* Gráfico 2: Ingresos por categoría (Dona) */}
        <Card>
          <CardBody>
            <Heading
              size="sm"
              mb={2}
              textAlign="center"
            >
              {t('revenue.title')}
            </Heading>
            <Box
              textAlign="center"
              mb={4}
            >
              <div
                style={{
                  fontSize: '18px',
                  color: '#24BE5C',
                  display: 'inline-block',
                }}
              >
                {t('revenue.total')}
                {data.revenue
                  .reduce((total: number, item: any) => total + item.revenue, 0)
                  .toLocaleString()}
              </div>
            </Box>
            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <PieChart>
                <Pie
                  data={data.revenue}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  labelLine={false}
                  label={({ category, percent }: any) =>
                    `${category} ${((percent || 0) * 100).toFixed(0)}%`
                  }
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {data.revenue.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [
                    `$${value.toLocaleString()}`,
                    t('revenue.tooltip'),
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
        {/* Gráfico 3: Tipos de mascotas (Torta) */}
        <Card>
          <CardBody>
            <Heading
              size="sm"
              mb={4}
              textAlign="center"
            >
              {t('petTypes.title')}
            </Heading>
            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <PieChart>
                <Pie
                  data={data.petTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) =>
                    `${name} ${((percent || 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.petTypes.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Tercera fila: Gráfico 4 */}
      <Card>
        <CardBody>
          <Heading
            size="sm"
            mb={4}
            textAlign="center"
          >
            {t('newUsers.title')}
          </Heading>
          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart data={data.newUsers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="users"
                name={t('newUsers.legend')}
                fill="#3182CE"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default Charts;
