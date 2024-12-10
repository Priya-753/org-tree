// NPM imports
import { ColDef } from 'ag-grid-enterprise';
import { AgGridReactProps } from 'ag-grid-react';

// API dataset sizes
export const API_PAGE_RECORDS_COMPLIANCE_MASTER = 100;
export const API_PAGE_RECORDS_COMPLIANCE_TRACKER = 100;
export const API_PAGE_RECORDS_CORPORATE_STRUCTURE_BANK_DETAILS = 100;
export const API_PAGE_RECORDS_CORPORATE_STRUCTURE_CAPITAL_STRUCTURE_CAPITAL_REGISTER = 100;
export const API_PAGE_RECORDS_CORPORATE_STRUCTURE_CAPITAL_STRUCTURE_INTRUMENTS = 100;
export const API_PAGE_RECORDS_CORPORATE_STRUCTURE_COMPANY_DIRECTORS = 100;
export const API_PAGE_RECORDS_CORPORATE_STRUCTURE_GROUP_OVERVIEW = 100;
export const API_PAGE_RECORDS_CORPORATE_STRUCTURE_REFERENCE_NUMBERS = 100;
export const API_PAGE_RECORDS_CORPORATE_STRUCTURE_SIGNIFICANT_CONTROL_REGISTER = 100;
export const API_PAGE_RECORDS_DEALS = 100;
export const API_PAGE_RECORDS_SHAREHOLDERS = 100;

// Transitions
export const TRANSITION_SNAP = 1;
export const TRANSITION_FAST = 250;
export const TRANSITION_MEDIUM = 500;
export const TRANSITION_SLOW = 1000;

// Content Types
export const CONTENT_TYPE_DOCX =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
export const CONTENT_TYPE_PDF = 'application/pdf';
export const CONTENT_TYPE_DOC = 'application/msword';
export const CONTENT_TYPE_ZIP = 'application/zip';
export const CONTENT_TYPE_CSV = 'text/csv';

// AG Grid
export const AG_GRID_OPTIONS: AgGridReactProps = {
  animateRows: true,
  className: 'ag-theme-alpine ag-grid-deals-plus',
  domLayout: 'normal',
  enableRangeSelection: false,
  headerHeight: 35,
  onModelUpdated: (event) => {
    event.api.getDisplayedRowCount() === 0
      ? event.api.showNoRowsOverlay()
      : event.api.hideOverlay();
  },
  rowHeight: 30,
  scrollbarWidth: 5,
  tooltipMouseTrack: true,
  tooltipShowDelay: 500,
  groupDefaultExpanded: -1,
  autoGroupColumnDef: {
    minWidth: 200,
    pinned: 'left',
    lockPinned: true,
  },
};

// Ag Grid (default column definitions)
export const DEFAULT_COLUMN_DEFINITIONS = {
  autoHeight: true,
  cellClass: 'no-border',
  cellStyle: { border: 'none' },
  filterParams: {
    debounceMs: 50,
  },
  resizable: true,
  sortable: true,
  suppressNavigable: true,
  menuTabs: [],
  valueFormatter: (params: any) => {
    if (params.value === '') {
      return '-';
    }
  },
};

// Ag Grid (delete + icon common column definitions)
export const AG_GRID_EDIT_BUTTON_AND_ICON_SETTINGS: ColDef = {
  filter: false,
  headerName: '',
  menuTabs: [],
  resizable: false,
  sortable: false,
  suppressMovable: true,
  suppressColumnsToolPanel: true,
  suppressSizeToFit: true,
};

export const AG_GRID_KEBAB_SETTINGS: ColDef = {
  ...AG_GRID_EDIT_BUTTON_AND_ICON_SETTINGS,
  cellClass: 'cell-with-icon',
  pinned: 'right',
  width: 32,
};

export const AG_GRID_ICON_SETTINGS: ColDef = {
  cellClass: 'cell-with-icon',
  cellStyle: { border: 'none' },
  pinned: 'left',
  width: 1,
};

export const AG_GRID_ICON_SETTINGS_RIGHT: ColDef = {
  cellClass: 'cell-with-icon',
  cellStyle: { border: 'none' },
  pinned: 'right',
  width: 1,
};

export const AG_GRID_RESIZE_DEBOUNCE = 100;

interface GridColumnSettings {
  width?: number;
}

export const AG_GRID_CUSTOMIZE_KEBAB_SETTING = (
  params?: GridColumnSettings
): ColDef => {
  return {
    ...AG_GRID_KEBAB_SETTINGS,
    width:
      params && typeof params.width === 'number'
        ? params.width
        : AG_GRID_KEBAB_SETTINGS.width,
  };
};

// Breakpoint ranges
export const BREAKPOINTS = {
  mobile: [1, 767],
  tabletPortrait: [768, 1023],
  tabletLandscape: [1024],
  desktop: [1025, 9999],
};

export const STRUCTURE_TYPE_OPTIONS = [
  {
    label: 'Fund',
    value: 1,
  },
  {
    label: 'Master Holding Structure',
    value: 2,
  },
  {
    label: 'Portfolio',
    value: 3,
  },
];

export const NOTIFICATION_TYPE_CAPITAL_TABLE = 'Capital Table';
export const UNISSUED_INVESTOR_TYPE = 'Reserve';

export const PARTNERSHIP = 'Partnership';
export const CORPORATION = 'Corporation';
export const LLC = 'Limited Liability Company';
export const NOTIFICATION_TYPE_OTHER = 'Other';
