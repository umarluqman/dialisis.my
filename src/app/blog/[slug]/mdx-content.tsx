"use client";

import * as runtime from "react/jsx-runtime";

const useMDXComponent = (code: string) => {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
};

interface MdxContentProps {
  code: string;
  components?: Record<string, React.ComponentType>;
}

export function MdxContent({ code, components }: MdxContentProps) {
  const Component = useMDXComponent(code);
  return <Component components={components} />;
}
