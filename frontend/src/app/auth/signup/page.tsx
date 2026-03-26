import { redirect } from 'next/navigation';

/** Signup uses the same flow as login (magic link creates account automatically) */
export default function SignupPage() {
  redirect('/login');
}
