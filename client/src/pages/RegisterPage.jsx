import RegisterForm from '../components/Auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <RegisterForm />
    </div>
  );
}
