import useAuth from "../hooks/useAuth";

export default function AuthRequired({
  children,
}: {
  children: React.ReactNode;
}) {
  const {} = useAuth();
  return children;
}
