import 'reset-css/reset.css';
import '../../scss/generic.scss';
import './remote.scss';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      { children }
    </>
  );
}
