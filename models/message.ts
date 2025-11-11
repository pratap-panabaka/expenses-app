export default interface Message {
  id: string | number;
  name: string;
  email: string;
  message: string;
  submittedAt: string;              // raw ISO timestamp (from DB or API)
  submittedAtFormatted?: string;    // optional pre-formatted display version
}
