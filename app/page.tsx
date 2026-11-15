import Dashboard from "./_features/dashboard";

// Server component: reads the .env value and passes it to the client dashboard as the default.
export default function Page() {
  const defaultAccessToken = process.env.ZALO_OA_ACCESS_TOKEN ?? "";
  return <Dashboard defaultAccessToken={defaultAccessToken} />;
}
