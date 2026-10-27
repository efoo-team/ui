// Fallback for tsconfig.build.json (NodeNext), which does not read the per-file *.module.css.d.ts.
declare module '*.module.css' {
  const classNames: Record<string, string>;
  export default classNames;
}
