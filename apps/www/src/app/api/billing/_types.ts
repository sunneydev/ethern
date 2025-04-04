export interface SubscriptionActivatedEvent {
  event_id: string;
  event_type: string;
  occurred_at: Date;
  notification_id: string;
  data: Data;
}

export interface Data {
  id: string;
  items: Item[];
  status: string;
  discount: null;
  paused_at: null;
  address_id: string;
  created_at: Date;
  started_at: Date;
  updated_at: Date;
  business_id: null;
  canceled_at: null;
  custom_data: null;
  customer_id: string;
  import_meta: null;
  billing_cycle: BillingCycle;
  currency_code: string;
  next_billed_at: Date;
  billing_details: null;
  collection_mode: string;
  first_billed_at: Date;
  scheduled_change: null;
  current_billing_period: CurrentBillingPeriod;
}

export interface BillingCycle {
  interval: string;
  frequency: number;
}

export interface CurrentBillingPeriod {
  ends_at: Date;
  starts_at: Date;
}

export interface Item {
  price: Price;
  status: string;
  quantity: number;
  recurring: boolean;
  created_at: Date;
  updated_at: Date;
  trial_dates: null;
  next_billed_at: Date;
  previously_billed_at: Date;
}

export interface Price {
  id: string;
  name: null;
  type: string;
  status: string;
  quantity: Quantity;
  tax_mode: string;
  created_at: Date;
  product_id: string;
  unit_price: UnitPrice;
  updated_at: Date;
  custom_data: null;
  description: string;
  import_meta: null;
  trial_period: null;
  billing_cycle: BillingCycle;
  unit_price_overrides: any[];
}

export interface Quantity {
  maximum: number;
  minimum: number;
}

export interface UnitPrice {
  amount: string;
  currency_code: string;
}

export interface CustomerResponse {
  data: Customer[];
  meta: Meta;
}

export interface Customer {
  id: string;
  status: string;
  custom_data: null;
  name: null;
  email: string;
  marketing_consent: boolean;
  locale: string;
  created_at: Date;
  updated_at: Date;
  import_meta: null;
}

export interface Meta {
  request_id: string;
  pagination: Pagination;
}

export interface Pagination {
  per_page: number;
  next: string;
  has_more: boolean;
  estimated_total: number;
}

export interface SubscriptionsList {
  data: Subscription[];
  meta: Meta;
}

export interface Subscription {
  id: string;
  status: string;
  customer_id: string;
  address_id: string;
  business_id: null;
  currency_code: CurrencyCode;
  created_at: Date;
  updated_at: Date;
  started_at: Date;
  first_billed_at: Date;
  next_billed_at: Date | null;
  paused_at: Date | null;
  canceled_at: Date | null;
  collection_mode: string;
  billing_details: BillingDetails | null;
  current_billing_period: CurrentBillingPeriod | null;
  billing_cycle: BillingCycle;
  scheduled_change: null;
  items: Item[];
  custom_data: null;
  discount: null;
  import_meta: null;
}

export interface BillingCycle {
  frequency: number;
}

export enum Interval {
  Day = "day",
  Month = "month",
  Week = "week",
  Year = "year",
}

export interface BillingDetails {
  enable_checkout: boolean;
  purchase_order_number: string;
  additional_information: null;
  payment_terms: BillingCycle;
}

export type CurrencyCode = "USD" | "GBP" | "EUr";

export interface Pagination {
  per_page: number;
  next: string;
  has_more: boolean;
  estimated_total: number;
}

export interface TransactionList {
  data: Transaction[];
  meta: Meta;
}

export interface Transaction {
  id: string;
  status: string;
  customer_id: string;
  address_id: string;
  business_id: null;
  custom_data: null;
  origin: string;
  collection_mode: string;
  subscription_id: string;
  invoice_id: null;
  invoice_number: null;
  discount_id: null;
  billing_details: null;
  billing_period: BillingPeriod;
  currency_code: string;
  created_at: Date;
  updated_at: Date;
  billed_at: null;
  items: Item[];
  details: Details;
  payments: any[];
  checkout: Checkout;
  customer: Customer;
  address: Address;
  tax_details: TaxDetails;
  available_payment_methods: string[];
}

export interface Address {
  id: string;
  customer_id: string;
  description: string;
  first_line: string;
  second_line: string;
  city: string;
  postal_code: string;
  region: string;
  country_code: string;
  status: string;
  custom_data: null;
  created_at: Date;
  updated_at: Date;
  import_meta: null;
}

export interface BillingPeriod {
  starts_at: Date;
  ends_at: Date;
}

export interface Checkout {
  url: string;
}

export interface Details {
  tax_rates_used: TaxRatesUsed[];
  totals: DetailsTotals;
  adjusted_totals: AdjustedTotals;
  payout_totals: null;
  adjusted_payout_totals: null;
  line_items: LineItem[];
}

export interface AdjustedTotals {
  subtotal: string;
  tax: string;
  total: string;
  grand_total: string;
  fee: string;
  earnings: string;
  currency_code: string;
}

export interface LineItem {
  id: string;
  price_id: string;
  quantity: number;
  totals: UnitTotalsClass;
  product: Product;
  tax_rate: string;
  unit_totals: UnitTotalsClass;
  proration: Proration;
}

export interface Product {
  id: string;
  name: string;
  type: string;
  tax_category: string;
  description: string;
  image_url: string;
  custom_data: CustomData | null;
  status: string;
  import_meta: null;
  created_at: Date;
  updated_at: Date;
}

export interface CustomData {
  features: Features;
  suggested_addons: string[];
  upgrade_description: string;
}

export interface Features {
  aircraft_performance: boolean;
  compliance_monitoring: boolean;
  flight_log_management: boolean;
  payment_by_invoice: boolean;
  route_planning: boolean;
  sso: boolean;
}

export interface Proration {
  rate: string;
  billing_period: BillingPeriod;
}

export interface UnitTotalsClass {
  subtotal: string;
  discount: string;
  tax: string;
  total: string;
}

export interface TaxRatesUsed {
  tax_rate: string;
  totals: UnitTotalsClass;
}

export interface DetailsTotals {
  subtotal: string;
  tax: string;
  discount: string;
  total: string;
  fee: null;
  credit: string;
  credit_to_balance: string;
  balance: string;
  grand_total: string;
  earnings: null;
  currency_code: string;
}

export interface Item {
  price: Price;
  quantity: number;
  proration: Proration;
}

export interface BillingCycle {
  interval: string;
  frequency: number;
}

export interface Quantity {
  minimum: number;
  maximum: number;
}

export interface UnitPrice {
  amount: string;
  currency_code: string;
}

export interface TaxDetails {
  entity: string;
  registration_number: string;
  postal_code: string;
  region: string;
  state: string;
  country_code: string;
}

export interface Meta {
  request_id: string;
}
