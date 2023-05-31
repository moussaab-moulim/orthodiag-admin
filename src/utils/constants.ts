import {
  getGridDateOperators,
  getGridNumericOperators,
  getGridStringOperators,
} from '@mui/x-data-grid';

export enum REQUEST_STATES {
  SUCCESS = 'success',
  ERROR = 'error',
  PENDING = 'pending',
}

export const pageSizeOptions = [25, 50, 75, 100];
export const paginationOptions = [100];
export const defaultPageSizeOptions = [25, 50, 75, 100];
export const defaultPageOptions = {
  page: 1,
  limit: 50,
};

export const defaultPimProductParams = {
  channelCode: 'default',
  localeCode: 'fr_FR',
};

export const defaultFilterOperators = getGridStringOperators().filter(
  (operator) =>
    ['equals', 'contains', 'startsWith', 'endsWith'].includes(operator.value)
);
export const defaultDateFilterOperators = getGridDateOperators().filter(
  (operator) =>
    ['after', 'onOrAfter', 'before', 'onOrBefore'].includes(operator.value)
);
export const defaultNumberFilterOperators = getGridNumericOperators().filter(
  (operator) => ['='].includes(operator.value)
);

export const backendFilterOperators: Record<string, string> = {
  contains: 'partial',
  equals: 'exact',
  startsWith: 'start',
  endsWith: 'end',
  after: 'strictly_after',
  onOrAfter: 'after',
  before: 'strictly_before',
  onOrBefore: 'before',
  '=': '',
  is: '',
};

export enum cookie {
  ESTABLISHMENT = 'establishment',
}

export const userAvatar = '/static/mock-images/avatars/avatar-user.png';
