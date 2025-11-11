export interface OpensourceCardModel {
  id: number;
  name: string;
  from?: string;
  to?: string;
  about: string;
  source: string; // should be a valid URL
}

export default OpensourceCardModel;
