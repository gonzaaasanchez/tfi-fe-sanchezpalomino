import { ComponentStyleConfig } from '@chakra-ui/react';

export const Table: ComponentStyleConfig = {
  baseStyle: {
    table: {
      borderCollapse: 'collapse',
      width: '100%'
    },
    thead: {
      th: {
        borderTop: 'none',
        padding: '22px 22px 22px 0',
        fontSize: '14px',
        fontWeight: '600',
        lineHeight: '22px',
        color: 'brand1.700',
        verticalAlign: 'top'
      }
    },
    tbody: {
      tr: {
        td: {
          fontSize: '14px',
          lineHeight: '22px',
          padding: '22px 22px 22px 0',
          verticalAlign: 'top',
          borderBottom: '1px solid',
          borderColor: 'gray.200'
        }
      }
    }
  },
  variants: {
    base: {
      table: {
        bg: 'white',
        borderRadius: 'lg',
        overflow: 'hidden'
      }
    },
    shadow: {
      table: {
        bg: 'white',
        borderRadius: '8px',
        boxShadow: '0px 16px 40px 0px rgba(1, 38, 54, 0.08)',
        padding: '3px 24px'
      }
    },
    compact: {
      thead: {
        th: {
          padding: '12px 16px 12px 0',
          fontSize: '13px'
        }
      },
      tbody: {
        tr: {
          td: {
            padding: '12px 16px 12px 0',
            fontSize: '13px'
          }
        }
      }
    }
  },
  defaultProps: {
    variant: 'base',
    colorScheme: 'brand1'
  }
};

// Styles for the table container
export const TableContainer: ComponentStyleConfig = {
  baseStyle: {
    overflowX: 'auto',
    borderRadius: 'lg'
  },
  variants: {
    shadow: {
      borderRadius: '8px',
      boxShadow: '0px 16px 40px 0px rgba(1, 38, 54, 0.08)',
      padding: '3px 24px'
    }
  }
};

// Styles for table actions
export const TableActions: ComponentStyleConfig = {
  baseStyle: {
    minWidth: '150px',
    textAlign: 'center'
  }
};

// Styles for rows with conditional classes
export const TableRow: ComponentStyleConfig = {
  variants: {
    admin: {
      bg: '#fef7e0'
    },
    inactive: {
      opacity: 0.6
    },
    'fw-bold': {
      td: {
        fontWeight: '700 !important'
      }
    }
  }
};

// Styles for pagination
export const TablePagination: ComponentStyleConfig = {
  baseStyle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    px: 6,
    py: 4,
    borderTop: '1px solid',
    borderColor: 'gray.200',
    bg: 'white'
  }
};

// Styles for loading and empty states
export const TableStates: ComponentStyleConfig = {
  baseStyle: {
    textAlign: 'center',
    py: 12
  },
  variants: {
    loading: {
      color: 'brand1.700'
    },
    empty: {
      color: 'gray.500',
      fontSize: 'lg'
    }
  }
};

// Styles for action tooltips
export const TableTooltip: ComponentStyleConfig = {
  baseStyle: {
    bg: 'gray.800',
    color: 'white',
    borderRadius: 'md',
    fontSize: 'sm',
    px: 2,
    py: 1
  }
};

// Styles for custom badges
export const TableBadge: ComponentStyleConfig = {
  baseStyle: {
    borderRadius: 'full',
    px: 2,
    py: 1,
    fontSize: 'xs',
    fontWeight: '500'
  },
  variants: {
    status: {
      active: {
        bg: 'green.100',
        color: 'green.800'
      },
      inactive: {
        bg: 'red.100',
        color: 'red.800'
      }
    },
    role: {
      admin: {
        bg: 'red.100',
        color: 'red.800'
      },
      manager: {
        bg: 'orange.100',
        color: 'orange.800'
      },
      user: {
        bg: 'blue.100',
        color: 'blue.800'
      }
    }
  }
};

// Styles for date cells
export const TableDateCell: ComponentStyleConfig = {
  baseStyle: {
    fontFamily: 'monospace',
    fontSize: '13px'
  }
};

// Styles for sortable columns
export const TableSortableColumn: ComponentStyleConfig = {
  baseStyle: {
    cursor: 'pointer',
    userSelect: 'none'
  }
};

// Styles for sort indicators
export const TableSortIndicator: ComponentStyleConfig = {
  baseStyle: {
    ml: 2,
    fontSize: '12px',
    color: 'brand1.700'
  }
};

// Styles for action buttons
export const TableActionButton: ComponentStyleConfig = {
  baseStyle: {
    mx: 1,
    cursor: 'pointer'
  },
  variants: {
    disabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    loading: {
      opacity: 0.7,
      cursor: 'wait'
    }
  }
};

// Styles for the main table wrapper
export const TableWrapper: ComponentStyleConfig = {
  baseStyle: {
    bg: 'white',
    border: '1px solid',
    borderColor: 'gray.200',
    borderRadius: 'lg',
    overflow: 'hidden'
  },
  variants: {
    shadow: {
      borderRadius: 'lg',
      boxShadow: '0px 16px 40px 0px rgba(1, 38, 54, 0.08)'
    }
  }
}; 