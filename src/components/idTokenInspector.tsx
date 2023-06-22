export interface IdTokenInspector {
  claims: object
}
export function IdTokenInspector(props: IdTokenInspector) {
  return (
    <textarea
      rows={7}
      className="w-full rounded-xl border-2 border-black p-4 font-mono text-sm disabled:cursor-not-allowed"
      readOnly
      value={JSON.stringify(props.claims, null, 2)}
    />
  )
}
