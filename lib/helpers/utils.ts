import { getReservationStatusOption } from '../constants/reservation-status';

export const formatSegment = (segment: string) => {
  return segment
    .replace(/[-_/]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const getReservationStatusConfig = (
  status: string,
  t?: (key: string) => string
) => {
  const statusOption = getReservationStatusOption(status);

  if (statusOption) {
    return {
      label: t ? t(statusOption.value) : statusOption.label,
      color: statusOption.color,
    };
  }

  return { label: status, color: 'gray' };
};

export interface PermissionChange {
  module: string;
  action: string;
  oldValue: boolean;
  newValue: boolean;
  changeType: 'enabled' | 'disabled';
}

export function detectPermissionChanges(
  oldPermissions: any,
  newPermissions: any
): PermissionChange[] {
  const changes: PermissionChange[] = [];

  // Iterar sobre todos los módulos
  for (const moduleName in oldPermissions) {
    const oldModule = oldPermissions[moduleName];
    const newModule = newPermissions[moduleName];

    // Si el módulo no existe en el nuevo objeto, saltar
    if (!newModule) continue;

    // Iterar sobre todas las acciones del módulo
    for (const actionName in oldModule) {
      const oldValue = oldModule[actionName];
      const newValue = newModule[actionName];

      // Si la acción no existe en el nuevo módulo, saltar
      if (newValue === undefined) continue;

      // Si los valores son diferentes, registrar el cambio
      if (oldValue !== newValue) {
        changes.push({
          module: moduleName,
          action: actionName,
          oldValue,
          newValue,
          changeType: newValue ? 'enabled' : 'disabled',
        });
      }
    }
  }

  return changes;
}

// Tipos para reportes
export interface ReportColumn {
  key: string;
  label: string;
  render?: (value: any, item: any) => string;
}

export interface ReportFilter {
  label: string;
  value: string;
}

export interface ReportOptions {
  title: string;
  columns: ReportColumn[];
  filters?: ReportFilter[];
  totalRecords: number;
  dateFormat?: string;
  statusConfig?: {
    getStatusConfig: (
      status: string,
      t: (key: string) => string
    ) => { label: string; color: string };
    statusKey: string;
  };
}

// Función genérica para generar reportes HTML
export const generateHTMLReport = (options: ReportOptions) => {
  const {
    title,
    columns,
    filters = [],
    totalRecords,
    dateFormat = 'dd/MM/yyyy',
    statusConfig,
  } = options;

  const date = new Date().toLocaleDateString('es-ES');

  let html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #333;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .header h1 {
          margin: 0;
          color: #2c3e50;
        }
        .info {
          margin-bottom: 20px;
        }
        .filters {
          background-color: #f8f9fa;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        .filters h3 {
          margin-top: 0;
          color: #495057;
        }
        .filters ul {
          margin: 0;
          padding-left: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        .status {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
        }
        .status-pending { background-color: #fff3cd; color: #856404; }
        .status-waiting_acceptance { background-color: #d1ecf1; color: #0c5460; }
        .status-confirmed { background-color: #d4edda; color: #155724; }
        .status-started { background-color: #cce5ff; color: #004085; }
        .status-rejected { background-color: #f8d7da; color: #721c24; }
        .status-finished { background-color: #d1e7dd; color: #0f5132; }
        .status-cancelled_owner, .status-cancelled_caregiver { background-color: #e2e3e5; color: #383d41; }
        .status-payment_pending { background-color: #fff3cd; color: #856404; }
        .status-payment_rejected { background-color: #f8d7da; color: #721c24; }
        .status-cancelledOwner { background-color: #e2e3e5; color: #383d41; }
        .status-cancelledCaregiver { background-color: #e2e3e5; color: #383d41; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
      </div>
      
      <div class="info">
        <p><strong>Fecha de generación:</strong> ${date}</p>
        <p><strong>Total de registros:</strong> ${totalRecords}</p>
      </div>
  `;

  if (filters.length > 0) {
    html += `
      <div class="filters">
        <h3>Filtros aplicados:</h3>
        <ul>
    `;
    filters.forEach((filter) => {
      html += `<li>${filter.label}: ${filter.value}</li>`;
    });
    html += `
        </ul>
      </div>
    `;
  }

  html += `
      <table>
        <thead>
          <tr>
  `;

  columns.forEach((column) => {
    html += `<th>${column.label}</th>`;
  });

  html += `
          </tr>
        </thead>
        <tbody>
  `;

  return html;
};

// Función para generar filas de tabla en reportes
export const generateTableRows = (
  data: any[],
  columns: ReportColumn[],
  statusConfig?: {
    getStatusConfig: (
      status: string,
      t: (key: string) => string
    ) => { label: string; color: string };
    statusKey: string;
    t: (key: string) => string;
  }
) => {
  if (!data || data.length === 0) {
    return `<tr><td colspan="${columns.length}" style="text-align: center;">No hay datos disponibles</td></tr>`;
  }

  let rows = '';
  data.forEach((item: any) => {
    rows += '<tr>';
    columns.forEach((column) => {
      let cellContent = '';

      if (column.render) {
        cellContent = column.render(item[column.key], item);
      } else if (column.key.includes('.')) {
        // Para propiedades anidadas como 'user.firstName'
        const keys = column.key.split('.');
        let value = item;
        for (const key of keys) {
          value = value?.[key];
        }
        cellContent = value || '-';
      } else {
        cellContent = item[column.key] || '-';
      }

      // Manejo especial para estados
      if (statusConfig && column.key === statusConfig.statusKey) {
        const statusValue = item[statusConfig.statusKey];
        const statusConfigResult = statusConfig.getStatusConfig(
          statusValue,
          statusConfig.t
        );
        cellContent = `<span class="status status-${statusValue}">${statusConfigResult.label}</span>`;
      }

      // Manejo especial para fechas
      if (column.key.includes('Date') || column.key.includes('At')) {
        if (cellContent && cellContent !== '-') {
          try {
            const date = new Date(cellContent);
            cellContent = date.toLocaleDateString('es-ES');
          } catch {
            // Si no es una fecha válida, mantener el valor original
          }
        }
      }

      rows += `<td>${cellContent}</td>`;
    });
    rows += '</tr>';
  });

  return rows;
};

// Función para completar el reporte HTML
export const completeHTMLReport = (tableRows: string) => {
  return `
        ${tableRows}
        </tbody>
      </table>
    </body>
    </html>
  `;
};

// Función para descargar reporte HTML
export const downloadHTMLReport = (htmlContent: string, filename: string) => {
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
