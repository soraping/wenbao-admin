export interface PaginationProps {
  pageNo?: number;
  pageCount?: number;
  total?: number;
  pageSize?: number;
  pageSizes?: number[];
  showSizePicker?: boolean;
  showQuickJumper?: boolean;
  prefix?: (args: any) => string
}
