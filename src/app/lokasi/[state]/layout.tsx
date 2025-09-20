interface Props {
  children: React.ReactNode;
  params: {
    state: string;
  };
}

export default function StateLayout({ children, params }: Props) {
  return children;
}
