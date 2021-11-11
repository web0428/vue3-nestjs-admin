export type TableColumnConfig = ColumnConfig[];
export interface ColumnConfig {
  prop: string;
  label: string;
  width?: string;
  translate?: (test: string) => string;
}

export type FormItemConfigGroup = FormItemConfig[];
interface FormItemConfig {
  prop: string;
  label: string;
  type: FormType;
  attrs?: any;
  span?: number;
  style?: string;
  options?: any;
}

export enum FormType {
  ElInput = "ElInput",
  ElInputNumber = "ElInputNumber",
  ElRadio = "ElRadio",
  ElSelect = "ElSelect",
  ElUpload = "ElUpload",
  ElDateTimePicker = "ElDateTimePicker",
  ElDatePicker = "ElDatePicker",
  ElTimePicker = "ElTimePicker",
  ElTimeSelect = "ElTimeSelect",
  ElSwitch = "ElSwitch"
}

export interface ELFormData {
  [propName: string]: any;
}

export interface BaseTableComponent {
  setTableData(data: any): any;
}

export interface BaseFormComponent {
  setFormData(data: any): any;
  getFormData(): any;
}

export interface BaseUploadComponent {
  setImageUrl(id: string): any
}