export default interface ProjectCardModel {
  id: number;
  name: string;
  about: string;
  from?: string;
  to?: string;
  company?: string;
  role?: string;
  techs: string[];
  source?: string;
  liveLink?: string;
}
