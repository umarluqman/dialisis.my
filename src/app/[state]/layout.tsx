export default function StateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Add any state-specific layout elements here */}
      {children}
    </div>
  );
}
